// ============================================================
// camera.js — Cinematic camera animations
//
// All three flight routines (crater flyby, Earth warp, Moon
// return) use requestAnimationFrame with cubic easing so
// transitions feel smooth and natural.
// ============================================================

import * as THREE from 'three';

// Ease-Out Cubic: fast start, gentle landing
function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Ease-In-Out Cubic: smooth acceleration + deceleration
function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Fly the camera to a position above a crater and look at it.
 * @param {THREE.PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {THREE.Vector3} targetPos - World-space crater center
 * @param {number} diameter - Crater diameter in meters
 */
export function flyToCrater(camera, controls, targetPos, diameter) {
    const startCamPos  = camera.position.clone();
    const startTarget  = controls.target.clone();
    const viewDist     = Math.max(2000, diameter * 2.0);
    const finalCamPos  = new THREE.Vector3(
        targetPos.x,
        targetPos.y + viewDist * 0.6,
        targetPos.z + viewDist
    );

    let frame = 0;
    const duration = 60; // ~1 s at 60 fps

    function tick() {
        frame++;
        const ease = easeOut(frame / duration);
        camera.position.lerpVectors(startCamPos, finalCamPos, ease);
        controls.target.lerpVectors(startTarget, targetPos, ease);
        controls.update();
        if (frame < duration) requestAnimationFrame(tick);
    }
    tick();
}

/**
 * Warp the camera toward the Earth sphere, then fade in Earth UI.
 * @param {THREE.PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {THREE.Group} earthGroup
 * @param {number} earthRadius - meters
 * @param {function} onComplete - called when flight finishes
 * @returns {{ savedPos: THREE.Vector3, savedTarget: THREE.Vector3 }}
 *          Saved camera state so returnToMoon can restore it.
 */
export function transitionToEarth(camera, controls, earthGroup, earthRadius, onComplete) {
    controls.enabled = false;

    const savedPos    = camera.position.clone();
    const savedTarget = controls.target.clone();

    // earthGroup may be parented to the camera, so use getWorldPosition
    // to get its actual world-space centre for the flight calculation.
    const earthCenter = new THREE.Vector3();
    earthGroup.getWorldPosition(earthCenter);
    const flightDir   = new THREE.Vector3().subVectors(earthCenter, camera.position).normalize();
    const stopDist    = earthCenter.distanceTo(camera.position) - earthRadius * 1.5;
    const finalCamPos = camera.position.clone().add(flightDir.multiplyScalar(stopDist));

    let frame = 0;
    const duration = 90; // ~1.5 s at 60 fps

    function tick() {
        frame++;
        const ease = easeInOut(frame / duration);
        camera.position.lerpVectors(savedPos, finalCamPos, ease);
        controls.target.lerpVectors(savedTarget, earthCenter, ease);
        controls.update();
        if (frame < duration) {
            requestAnimationFrame(tick);
        } else {
            onComplete();
        }
    }
    tick();

    return { savedPos, savedTarget };
}

/**
 * Cinematic return to the Moon from Earth view.
 *
 * Four-phase flight:
 *   Phase 1 (0–18%)  — Pull back radially from tile surface until the
 *                       Earth globe becomes visible in frame.
 *   Phase 2 (18–36%) — Zoom out to a deep-space vantage so the full
 *                       Earth sphere sits centred in the frame.
 *   Phase 3 (36–72%) — Bézier arc sweeping from Earth globe position
 *                       through a high ecliptic midpoint to the Moon.
 *   Phase 4 (72–100%)— Approach and settle gently into Moon orbit.
 *
 * Total duration ~4.6 s at 60 fps.
 *
 * @param {THREE.PerspectiveCamera} camera
 * @param {OrbitControls}           controls
 * @param {THREE.Vector3}           savedPos     — pre-Earth camera position (Moon orbit)
 * @param {THREE.Vector3}           savedTarget  — pre-Earth orbit target (Moon centre)
 * @param {THREE.Vector3}           earthCenter  — world-space centre of the Earth sphere
 * @param {number}                  earthRadius  — visual radius of the Earth sphere (m)
 * @param {function}                onComplete   — called when flight ends
 */
export function returnToMoon(camera, controls, savedPos, savedTarget, earthCenter, earthRadius, onComplete) {
    controls.enabled = false;

    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();

    // Phase 1 end: above tile surface, pulling out toward the globe edge.
    const earthDir    = earthCenter.clone().normalize();
    const pullBackPos = earthCenter.clone().addScaledVector(earthDir, earthRadius * 3.5);

    // Phase 2 end: stand-off distance — full globe visible, dramatic scale.
    const globeViewPos = earthCenter.clone().addScaledVector(earthDir, earthRadius * 8);

    // Phase 3 Bézier midpoint: high above the ecliptic between Earth and Moon.
    const midPoint = new THREE.Vector3().addVectors(globeViewPos, savedPos).multiplyScalar(0.5);
    midPoint.y += Math.max(500000, globeViewPos.distanceTo(savedPos) * 0.6);

    // Bezier helper: quadratic P0 → P1 → P2
    function bezier3(p0, p1, p2, t) {
        const mt = 1 - t;
        return new THREE.Vector3(
            mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
            mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
            mt * mt * p0.z + 2 * mt * t * p1.z + t * t * p2.z
        );
    }

    // Phase durations (frames at 60 fps)
    const PHASE1 = 50;   // ~0.8 s — pull back from terrain surface
    const PHASE2 = 60;   // ~1.0 s — zoom out to see the full globe
    const PHASE3 = 90;   // ~1.5 s — arc through deep space
    const PHASE4 = 80;   // ~1.3 s — approach and settle at Moon
    const TOTAL  = PHASE1 + PHASE2 + PHASE3 + PHASE4; // ~4.6 s

    let frame = 0;

    function tick() {
        frame++;

        let camPos;

        if (frame <= PHASE1) {
            // Phase 1: rise radially away from the tile surface toward the globe edge
            const t    = frame / PHASE1;
            const ease = t * t; // ease-in quad — weighted departure
            camPos = new THREE.Vector3().lerpVectors(startCamPos, pullBackPos, ease);
            controls.target.lerpVectors(startTarget, earthCenter, ease);

        } else if (frame <= PHASE1 + PHASE2) {
            // Phase 2: zoom out to globe-view vantage — easeInOut
            const t    = (frame - PHASE1) / PHASE2;
            const ease = easeInOut(t);
            camPos = new THREE.Vector3().lerpVectors(pullBackPos, globeViewPos, ease);
            controls.target.copy(earthCenter); // keep Earth centred in frame

        } else if (frame <= PHASE1 + PHASE2 + PHASE3) {
            // Phase 3: Bézier arc from globe vantage toward Moon — easeInOut
            const t    = (frame - PHASE1 - PHASE2) / PHASE3;
            const ease = easeInOut(t);
            camPos = bezier3(globeViewPos, midPoint, savedPos, ease);
            // Look-at smoothly transitions Earth → Moon
            controls.target.lerpVectors(earthCenter, savedTarget, ease);

        } else {
            // Phase 4: gentle ease-out arrival into Moon orbit
            const t    = (frame - PHASE1 - PHASE2 - PHASE3) / PHASE4;
            const ease = easeOut(t);
            const approachStart = savedPos.clone().addScaledVector(
                new THREE.Vector3(0, 1, 0), 10000 * (1 - ease)
            );
            camPos = new THREE.Vector3().lerpVectors(approachStart, savedPos, ease);
            controls.target.lerpVectors(
                savedTarget.clone().add(new THREE.Vector3(0, 3000, 0)),
                savedTarget,
                ease
            );
        }

        camera.position.copy(camPos);
        controls.update();

        if (frame < TOTAL) {
            requestAnimationFrame(tick);
        } else {
            camera.position.copy(savedPos);
            controls.target.copy(savedTarget);
            controls.update();
            controls.enabled = true;
            onComplete();
        }
    }
    tick();
}
