// ============================================================
// input.js — Pointer handlers and UI control bindings
//
// Separating input from logic means main.js doesn't need to
// know about DOM events, and this file doesn't need to know
// about physics. All communication is through callbacks and
// the shared state object.
// ============================================================

import * as THREE from 'three';
import { state } from './state.js';
import { updateCurve } from './ui/charts.js';

const raycaster = new THREE.Raycaster();
raycaster.layers.enable(1); // Earth mesh lives on layer 1
const pointer = new THREE.Vector2();

/**
 * Wire up pointermove and pointerdown for 3D targeting.
 *
 * @param {object} deps
 * @param {THREE.PerspectiveCamera} deps.camera
 * @param {THREE.Mesh} deps.moonMesh       - Raycasting target for the terrain
 * @param {THREE.Mesh} deps.earthMesh      - Raycasting target for the Earth sphere
 * @param {THREE.Mesh} deps.reticule       - Red targeting ring (hover)
 * @param {THREE.Mesh} deps.targetMarker   - Green targeting ring (confirmed target)
 * @param {function}   deps.onEarthClick   - Called when user clicks the Earth
 */
export function initPointerHandlers({ camera, moonMesh, earthMesh, reticule, targetMarker, onEarthClick }) {
    // Flat ground plane at y=0 for Earth-mode reticule targeting.
    // The ENU frame places the tile surface at y=0, so this matches the terrain.
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const groundHit = new THREE.Vector3();

    function onPointerMove(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        if (state.currentMode === 'earth') {
            // Show reticule hovering on the flat ENU ground plane
            if (raycaster.ray.intersectPlane(groundPlane, groundHit)) {
                reticule.position.set(groundHit.x, 1, groundHit.z);
                reticule.visible = true;
                document.body.style.cursor = 'crosshair';
            } else {
                reticule.visible = false;
                document.body.style.cursor = 'default';
            }
            return;
        }

        if (state.currentMode !== 'moon') return;

        // Earth hover — show pointer cursor, hide reticule
        if (raycaster.intersectObject(earthMesh).length > 0) {
            document.body.style.cursor = 'pointer';
            reticule.visible = false;
            return;
        }

        // Moon hover — track reticule
        const hits = raycaster.intersectObject(moonMesh);
        if (hits.length > 0) {
            reticule.position.set(hits[0].point.x, hits[0].point.y + 10, hits[0].point.z);
            reticule.visible = true;
            document.body.style.cursor = 'crosshair';
        } else {
            reticule.visible = false;
            document.body.style.cursor = 'default';
        }
    }

    function onPointerDown(event) {
        // Ignore clicks on UI overlay elements in all modes
        if (
            event.target.closest('#ui-controls') ||
            event.target.tagName === 'BUTTON' ||
            event.target.closest('#chart-container') ||
            event.target.closest('#earth-search-bar') ||
            event.target.closest('#earth-target-strip')
        ) return;

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        if (state.currentMode === 'earth') {
            // Only set target on left-click (button 0).
            // Let OrbitControls handle right-click (pan) and middle-click.
            if (event.button === 0 && raycaster.ray.intersectPlane(groundPlane, groundHit)) {
                state.params.target.set(groundHit.x, 0, groundHit.z);
                targetMarker.position.set(groundHit.x, 1, groundHit.z);
                targetMarker.visible = true;
            }
            return;
        }

        if (state.currentMode !== 'moon') return;

        // Earth sphere click
        if (raycaster.intersectObject(earthMesh).length > 0) {
            onEarthClick();
            return;
        }

        // Moon click — confirm target
        const hits = raycaster.intersectObject(moonMesh);
        if (hits.length > 0) {
            state.params.target.copy(hits[0].point);
            targetMarker.position.set(hits[0].point.x, hits[0].point.y + 20, hits[0].point.z);
            targetMarker.visible = true;
        }
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
}

/**
 * Wire up all UI controls (sliders, selects, buttons).
 *
 * @param {object} deps
 * @param {function} deps.onFire   - Called when Fire button is clicked
 * @param {function} deps.onReset  - Called when Reset button is clicked
 */
export function initControlBindings({ onFire, onReset }) {
    // Generic slider helper
    const bindSlider = (id, displayId, unit, setter) => {
        const input = document.getElementById(id);
        const display = document.getElementById(displayId);
        if (!input) return;
        input.addEventListener('input', (e) => {
            setter(Number(e.target.value));
            if (display) display.innerText = e.target.value + unit;
            updateCurve();
        });
    };

    bindSlider('inp-velocity', 'val-velocity', ' km/s', v => { state.params.velocity = v; });
    bindSlider('inp-angle', 'val-angle', ' deg', v => { state.params.angle = v; });

    // Logarithmic mass slider (exponent → actual kg value)
    const massInput = document.getElementById('inp-mass');
    const massDisplay = document.getElementById('val-mass');
    if (massInput) {
        massInput.addEventListener('input', (e) => {
            const val = Math.pow(10, Number(e.target.value));
            state.params.mass = val;
            if (massDisplay) massDisplay.innerText = val.toExponential(1) + ' kg';
            updateCurve();
        });
    }

    // Density select
    const densitySelect = document.getElementById('inp-density');
    if (densitySelect) {
        densitySelect.addEventListener('change', (e) => {
            state.params.density = Number(e.target.value);
        });
    }

    // Fire / Reset buttons
    document.getElementById('fire-btn')?.addEventListener('click', onFire);
    document.getElementById('reset-btn')?.addEventListener('click', onReset);
}
