// ============================================================
// state.js — Centralized mutable simulation state
//
// All modules import this singleton rather than using module-
// scoped globals, making state transitions easy to track and
// future features like "undo" or "save/load" straightforward.
// ============================================================

import * as THREE from 'three';

export const state = {
    // --- User-controlled simulation parameters ---
    params: {
        velocity: 10,   // km/s
        angle: 90,      // degrees (90 = vertical impact)
        mass: 1e8,      // kg
        density: 3000,  // kg/m³ (rock default)
        target: new THREE.Vector3(0, 0, 0),
    },

    // --- Active projectiles (Projectile instances) ---
    projectiles: [],

    // --- Impact history for charts and labels ---
    impactCount: 0,
    impactHistory: [], // [{ id, energy, mass, velocity, craterDiameter, projectileDiameter }]

    // --- Scene mode ---
    currentMode: 'moon', // 'moon' | 'earth' | 'transitioning'

    // --- Countdown state ---
    timeToImpact: 0,
    isProjectileInbound: false,

    // --- Chart UI state ---
    isCurveVisible: false,

    // --- Earth mode state ---
    earth: {
        tileset: null,          // TilesRenderer instance (set by Earth.js)
        lat: 33.4484,           // Current tile centre latitude  (default: Phoenix, AZ)
        lng: -112.0740,         // Current tile centre longitude
        impactLocation: {
            lat:  33.4484,      // Confirmed target latitude
            lng: -112.0740,     // Confirmed target longitude
            name: 'Phoenix, AZ, USA',
        },
    },
};
