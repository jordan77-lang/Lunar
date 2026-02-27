// ============================================================
// markers.js — Holographic crater gauges and CSS2D labels
//
// After each impact, createImpactMarker() drops a floating
// label and a set of Three.js measurement overlays: a diameter
// ring, crosshair lines, and a depth indicator.
// ============================================================

import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export function createImpactMarker(parentGroup, position, diameter, depth, impactCount, onClickFly) {
    // --- CSS2D floating label ---
    const div = document.createElement('div');
    div.className = 'impact-marker';
    div.innerHTML = `<span class="marker-id">IMPACT ${impactCount}</span><br>` +
        `Ø ${(diameter / 1000).toFixed(1)} km<br>` +
        `↓ ${(depth / 1000).toFixed(1)} km`;
    div.onclick = () => onClickFly(position, diameter);

    const label = new CSS2DObject(div);
    label.position.copy(position);
    // Lift label above rim; minimum 500 m to avoid clipping small craters
    label.position.y += Math.max(500, diameter * 0.15);
    parentGroup.add(label);

    // --- Holographic gauge group ---
    const gaugeGroup = new THREE.Group();
    gaugeGroup.position.copy(position);
    parentGroup.add(gaugeGroup);

    const lift = Math.max(1, diameter * 0.015);
    const radius = diameter / 2;
    const tickLen = diameter * 0.04;
    const ringThickness = diameter * 0.012;

    const cyanColor = 0x00ccff;
    const depthColor = 0xff6644;

    // 1. Diameter ring
    const ringMat = new THREE.MeshBasicMaterial({
        color: cyanColor,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
    });
    const ringGeo = new THREE.RingGeometry(radius - ringThickness, radius, 96);
    ringGeo.rotateX(-Math.PI / 2);
    ringGeo.translate(0, lift, 0);
    gaugeGroup.add(new THREE.Mesh(ringGeo, ringMat));

    // 2. Ghosted disc fill
    const discGeo = new THREE.CircleGeometry(radius - ringThickness, 64);
    discGeo.rotateX(-Math.PI / 2);
    discGeo.translate(0, lift - 1, 0);
    gaugeGroup.add(new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({
        color: cyanColor,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
    })));

    // 3. Dashed crosshair lines
    const lineMat = new THREE.LineDashedMaterial({
        color: cyanColor,
        transparent: true,
        opacity: 0.45,
        dashSize: diameter * 0.03,
        gapSize: diameter * 0.02,
    });

    const makeDashed = (a, b) => {
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([a, b]),
            lineMat
        );
        line.computeLineDistances();
        return line;
    };

    gaugeGroup.add(makeDashed(new THREE.Vector3(-radius, lift, 0), new THREE.Vector3(radius, lift, 0)));
    gaugeGroup.add(makeDashed(new THREE.Vector3(0, lift, -radius), new THREE.Vector3(0, lift, radius)));

    // 4. Endpoint tick marks
    const tickMat = new THREE.LineBasicMaterial({ color: cyanColor, transparent: true, opacity: 0.6 });
    const tickPts = [
        new THREE.Vector3(-radius, lift, -tickLen), new THREE.Vector3(-radius, lift, tickLen),
        new THREE.Vector3(radius, lift, -tickLen), new THREE.Vector3(radius, lift, tickLen),
        new THREE.Vector3(-tickLen, lift, -radius), new THREE.Vector3(tickLen, lift, -radius),
        new THREE.Vector3(-tickLen, lift, radius), new THREE.Vector3(tickLen, lift, radius),
    ];
    gaugeGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), tickMat));

    // 5. Depth indicator (dashed vertical line + top/bottom ticks)
    const depthMat = new THREE.LineDashedMaterial({
        color: depthColor,
        transparent: true,
        opacity: 0.5,
        dashSize: depth * 0.06,
        gapSize: depth * 0.04,
    });

    const depthLine = makeDashed(new THREE.Vector3(0, lift, 0), new THREE.Vector3(0, lift - depth, 0));
    depthLine.material = depthMat;
    depthLine.computeLineDistances();
    gaugeGroup.add(depthLine);

    const depthTickSize = diameter * 0.06;
    const depthTickMat = new THREE.LineBasicMaterial({ color: depthColor, transparent: true, opacity: 0.5 });

    const makeHorizTick = (y) => new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-depthTickSize, y, 0),
            new THREE.Vector3(depthTickSize, y, 0),
        ]),
        depthTickMat
    );

    gaugeGroup.add(makeHorizTick(lift));
    gaugeGroup.add(makeHorizTick(lift - depth));
}
