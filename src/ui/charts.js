// ============================================================
// charts.js — Chart.js impact data visualization
//
// Owns the Chart instance and chart-type state. Exposes
// refreshChart() so hud.js can trigger an update after each
// impact, and updateCurve() for the theoretical overlay.
// ============================================================

import Chart from 'chart.js/auto';
import { state } from '../state.js';
import { HOLSAPPLE_COEFF, HOLSAPPLE_MASS_EXP, HOLSAPPLE_VEL_EXP } from '../constants.js';

let impactChart = null;
let currentChartType = 'energy';

// Shared dark-theme axis style reused across chart configs
const darkAxis = (title) => ({
    grid: { color: 'rgba(255,255,255,0.1)' },
    ticks: { color: '#ccc' },
    title: { display: !!title, text: title, color: '#ccc' },
});

function buildConfig() {
    if (currentChartType === 'energy') {
        const recent = state.impactHistory.slice(-5);
        return {
            type: 'bar',
            data: {
                labels: recent.map(d => `Impact ${d.id}`),
                datasets: [{
                    label: 'Impact Energy (J)',
                    data: recent.map(d => d.energy),
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    borderColor: 'rgba(0, 255, 136, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: { ...darkAxis('Energy (J)'), beginAtZero: true },
                    x: { ticks: { color: '#ccc' } },
                },
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } },
            },
        };
    }

    if (currentChartType === 'crater-dia') {
        return {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Mass (kg) vs Crater Dia (km)',
                    data: state.impactHistory.map(d => ({ x: d.mass, y: d.craterDiameter / 1000 })),
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                }],
            },
            options: {
                scales: {
                    x: {
                        ...darkAxis('Mass (kg)'),
                        type: 'linear',
                        position: 'bottom',
                        ticks: { color: '#ccc', callback: v => Number(v).toExponential() },
                    },
                    y: { ...darkAxis('Crater Diameter (km)'), beginAtZero: true },
                },
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } },
            },
        };
    }

    // vel-dia
    return {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Velocity (km/s) vs Crater Dia (km)',
                data: state.impactHistory.map(d => ({ x: d.velocity, y: d.craterDiameter / 1000 })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
            }],
        },
        options: {
            scales: {
                x: { ...darkAxis('Velocity (km/s)'), type: 'linear', position: 'bottom' },
                y: { ...darkAxis('Crater Diameter (km)'), beginAtZero: true },
            },
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: 'white' } } },
        },
    };
}

export function updateCurve() {
    if (!impactChart || currentChartType === 'energy') return;

    // Remove old curve dataset if present
    const existingIdx = impactChart.data.datasets.findIndex(d => d.label === 'Theoretical Curve');
    if (existingIdx !== -1) impactChart.data.datasets.splice(existingIdx, 1);

    if (!state.isCurveVisible) {
        impactChart.update();
        return;
    }

    const angleRad = state.params.angle * (Math.PI / 180);
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);
    const curvePoints = [];

    if (currentChartType === 'crater-dia') {
        const v_ms = state.params.velocity * 1000;
        for (let exp = 8; exp <= 15; exp += 0.1) {
            const m = Math.pow(10, exp);
            const d_m = HOLSAPPLE_COEFF * Math.pow(m, HOLSAPPLE_MASS_EXP) * Math.pow(v_ms, HOLSAPPLE_VEL_EXP) * angleFactor;
            curvePoints.push({ x: m, y: d_m / 1000 });
        }
    } else {
        const m = state.params.mass;
        for (let v_km = 5; v_km <= 80; v_km += 1) {
            const v_ms = v_km * 1000;
            const d_m = HOLSAPPLE_COEFF * Math.pow(m, HOLSAPPLE_MASS_EXP) * Math.pow(v_ms, HOLSAPPLE_VEL_EXP) * angleFactor;
            curvePoints.push({ x: v_km, y: d_m / 1000 });
        }
    }

    impactChart.data.datasets.push({
        label: 'Theoretical Curve',
        data: curvePoints,
        type: 'line',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
    });

    impactChart.update();
}

export function refreshChart() {
    if (impactChart) impactChart.destroy();

    const canvas = document.getElementById('impactChart');
    if (!canvas) return;

    impactChart = new Chart(canvas.getContext('2d'), buildConfig());
    updateCurve();
}

export function initCharts() {
    const selector = document.getElementById('chart-selector');
    const toggleBtn = document.getElementById('btn-toggle-curve');

    selector?.addEventListener('change', () => {
        currentChartType = selector.value;
        toggleBtn.style.display = currentChartType === 'energy' ? 'none' : 'inline-block';
        refreshChart();
    });

    toggleBtn?.addEventListener('click', () => {
        state.isCurveVisible = !state.isCurveVisible;
        toggleBtn.innerText = state.isCurveVisible ? 'HIDE CURVE' : 'SHOW CURVE';
        updateCurve();
    });

    // Set initial toggle visibility
    if (toggleBtn) toggleBtn.style.display = 'none';

    refreshChart();
}
