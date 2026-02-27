// ============================================================
// Earth.js — Google Photorealistic 3D Tiles + geo utilities
//
// Streams real Earth terrain into the Three.js scene via
// 3DTilesRendererJS (NASA-AMMOS/3d-tiles-renderer@0.3.x).
//
// Coordinate system:
//   Google tiles use ECEF (Earth-Centered, Earth-Fixed) in
//   metres. We place the tile root at the world origin with a
//   rotation so that the chosen impact lat/lng faces the camera.
//
// Usage:
//   const earth = new EarthTiles(scene, camera, renderer, apiKey);
//   earth.flyToLocation(lat, lng);   // recentre tiles + camera
//   earth.update();                  // call every frame
//   earth.dispose();                 // cleanup on return-to-moon
// ============================================================

import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import { GoogleCloudAuthPlugin, GLTFExtensionsPlugin } from '3d-tiles-renderer/plugins';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { state } from '../state.js';

// Shared DRACOLoader instance — reused across tile loads to avoid
// re-initialising the WASM decoder on every flyToLocation call.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dracoLoader.setDecoderConfig({ type: 'js' });  // JS decoder works everywhere

// WGS-84 semi-major axis (metres)
const WGS84_A = 6378137.0;
// WGS-84 first eccentricity squared
const WGS84_E2 = 0.00669437999014;

/**
 * Convert geodetic (lat/lng in degrees, alt in metres) → ECEF XYZ.
 */
export function geoToECEF(lat, lng, alt = 0) {
    const φ = lat * (Math.PI / 180);
    const λ = lng * (Math.PI / 180);
    const sinφ = Math.sin(φ), cosφ = Math.cos(φ);
    const sinλ = Math.sin(λ), cosλ = Math.cos(λ);
    const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinφ * sinφ);
    return new THREE.Vector3(
        (N + alt) * cosφ * cosλ,
        (N + alt) * cosφ * sinλ,
        (N * (1 - WGS84_E2) + alt) * sinφ
    );
}

/**
 * Build a rotation matrix that maps ECEF → local ENU frame at lat/lng.
 * In the local frame: +X = East, +Y = North, +Z = Up.
 */
export function ecefToENUMatrix(lat, lng) {
    const φ = lat * (Math.PI / 180);
    const λ = lng * (Math.PI / 180);
    const sinφ = Math.sin(φ), cosφ = Math.cos(φ);
    const sinλ = Math.sin(λ), cosλ = Math.cos(λ);

    // Columns: East, North, Up expressed in ECEF
    const east = new THREE.Vector3(-sinλ, cosλ, 0);
    const north = new THREE.Vector3(-sinφ * cosλ, -sinφ * sinλ, cosφ);
    const up = new THREE.Vector3(cosφ * cosλ, cosφ * sinλ, sinφ);

    const m = new THREE.Matrix4();
    m.makeBasis(east, north, up);
    return m;
}

export class EarthTiles {
    /**
     * @param {THREE.Scene}          scene
     * @param {THREE.Camera}         camera
     * @param {THREE.WebGLRenderer}  renderer
     * @param {string}               apiKey   — Google Maps Platform API key
     */
    constructor(scene, camera, renderer, apiKey) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.apiKey = apiKey;
        this.tiles = null;
        this.group = new THREE.Group();
        scene.add(this.group);

        // Current centre of the tile view
        this._lat = 0;
        this._lng = 0;
    }

    /**
     * Initialise (or reinitialise) TilesRenderer centred on lat/lng.
     * Safe to call multiple times — disposes previous instance first.
     */
    flyToLocation(lat, lng) {
        this._lat = lat;
        this._lng = lng;

        // Dispose previous tileset
        if (this.tiles) {
            this.tiles.dispose();
            this.group.clear();
        }

        // Use GoogleCloudAuthPlugin for proper session-based authentication.
        // The plugin automatically:
        //   1. Sets the root URL to Google's 3D Tiles endpoint
        //   2. Appends the API key + session token to every tile request
        //   3. Handles session token refresh on expiry
        const tiles = new TilesRenderer();
        tiles.registerPlugin(new GoogleCloudAuthPlugin({
            apiToken: this.apiKey,
            autoRefreshToken: true,
        }));
        tiles.registerPlugin(new GLTFExtensionsPlugin({
            dracoLoader,
            autoDispose: false,  // we manage the shared DRACOLoader ourselves
        }));
        tiles.setCamera(this.camera);
        tiles.setResolutionFromRenderer(this.camera, this.renderer);

        // Place tile group so that the target lat/lng is at the world origin.
        // We apply the inverse of the ECEF → ENU rotation so tiles render
        // in a right-side-up orientation with +Y pointing away from Earth.
        const ecefOrigin = geoToECEF(lat, lng, 0);
        const enuMatrix = ecefToENUMatrix(lat, lng);

        // tiles.group transform: shift ECEF origin to (0,0,0) then rotate
        const shift = new THREE.Matrix4().makeTranslation(
            -ecefOrigin.x, -ecefOrigin.y, -ecefOrigin.z
        );
        // enuMatrix maps ECEF cols → ENU. We want ENU axes as world axes.
        const rot = enuMatrix.clone().transpose(); // ECEF→ENU = transpose of basis
        const combined = new THREE.Matrix4().multiplyMatrices(rot, shift);

        this.group.matrix.copy(combined);
        this.group.matrix.decompose(
            this.group.position,
            this.group.quaternion,
            this.group.scale
        );
        this.group.matrixAutoUpdate = false;

        this.group.add(tiles.group);
        this.tiles = tiles;

        // Store in state for access by main.js
        state.earth.tileset = tiles;
        state.earth.lat = lat;
        state.earth.lng = lng;
    }

    /** Call every frame in the render loop. */
    update() {
        if (!this.tiles) return;
        this.tiles.update();
    }

    /** Remove from scene and release GPU resources. */
    dispose() {
        if (this.tiles) {
            this.tiles.dispose();
            this.tiles = null;
        }
        this.group.clear();
        state.earth.tileset = null;
    }
}
