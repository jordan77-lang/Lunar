// ============================================================
// hud.js — Impact dashboard and crater profile canvas
//
// Updates the left-hand panel (energy, diameter, depth,
// morphology) and draws the 2D crater cross-section diagram.
// ============================================================

import { state } from '../state.js';
import {
    SIMPLE_COMPLEX_THRESHOLD_M,
    MEGATON_TNT_J,
} from '../constants.js';
import { refreshChart } from './charts.js';

// Cache DOM refs on first call (elements are guaranteed to exist by this point)
let _els = null;
function els() {
    if (!_els) {
        _els = {
            energy:      document.getElementById('energy'),
            energyTnt:   document.getElementById('energy-tnt'),
            diameter:    document.getElementById('diameter'),
            depth:       document.getElementById('depth'),
            craterShape: document.getElementById('crater-shape'),
            placeholder: document.getElementById('chart-placeholder'),
        };
    }
    return _els;
}

export function updateStats(energy, diameter, depth, mass, projectileDiameter, locationName = null) {
    const e = els();

    // --- Energy display ---
    e.energy.innerText = energy.toExponential(2);

    const megatons = energy / MEGATON_TNT_J;
    if (e.energyTnt) {
        if (megatons >= 0.001) {
            e.energyTnt.innerText = `≈ ${megatons < 1 ? megatons.toFixed(3) : megatons.toFixed(1)} Mt TNT`;
        } else {
            e.energyTnt.innerText = `≈ ${(megatons * 1000).toFixed(2)} kt TNT`;
        }
    }

    // --- Diameter / Depth (meters → km for display) ---
    e.diameter.innerText = (diameter / 1000).toFixed(2);
    e.depth.innerText    = (depth / 1000).toFixed(2);

    // --- Morphology ---
    const isComplex = diameter > SIMPLE_COMPLEX_THRESHOLD_M;
    if (e.craterShape) {
        if (isComplex) {
            e.craterShape.innerText    = 'Complex (Central Peak)';
            e.craterShape.style.color  = '#ffb86c';
        } else {
            e.craterShape.innerText    = 'Simple (Bowl-Shaped)';
            e.craterShape.style.color  = '#00ff88';
        }
    }

    drawCraterProfile(isComplex);

    // --- Update impact history and refresh chart ---
    state.impactCount++;
    state.impactHistory.push({
        id: state.impactCount,
        energy,
        mass,
        velocity: state.params.velocity, // km/s
        craterDiameter: diameter,        // meters
        projectileDiameter,
        location: locationName,          // null for Moon impacts, address string for Earth
    });

    if (e.placeholder) e.placeholder.classList.add('hidden');
    refreshChart();
}

export function drawCraterProfile(isComplex) {
    const canvas = document.getElementById('craterProfile');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Ground line
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 4);
    ctx.lineTo(w, h / 4);
    ctx.stroke();

    // Crater profile curve
    const accent = isComplex ? '#ffb86c' : '#00ff88';
    ctx.strokeStyle = accent;
    ctx.shadowColor  = accent;
    ctx.shadowBlur   = 10;
    ctx.lineWidth    = 2;

    const cw      = w * 0.8;
    const startX  = (w - cw) / 2;
    const endX    = startX + cw;
    const groundY = h / 4;
    const rimY    = h / 4 - 10;
    const bottomY = h - 15;

    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(startX - 20, groundY);
    ctx.lineTo(startX, rimY);

    if (isComplex) {
        // Terraced walls + central peak
        ctx.bezierCurveTo(startX + cw * 0.2, bottomY, startX + cw * 0.4, bottomY, w / 2, bottomY - 30);
        ctx.bezierCurveTo(endX - cw * 0.4,   bottomY, endX - cw * 0.2,   bottomY, endX,   rimY);
    } else {
        // Smooth parabolic bowl
        ctx.bezierCurveTo(startX + cw * 0.33, bottomY, endX - cw * 0.33, bottomY, endX, rimY);
    }

    ctx.lineTo(endX + 20, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Fill
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = isComplex ? 'rgba(255, 184, 108, 0.15)' : 'rgba(0, 255, 136, 0.15)';
    ctx.fill();

    ctx.shadowBlur = 0;
}
