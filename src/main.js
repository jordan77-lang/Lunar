import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as CANNON from 'cannon-es';
import Chart from 'chart.js/auto';
import { Moon } from './scene/Moon.js';
import { Projectile } from './physics/Projectile.js';

import { SoundManager } from './utils/Sound.js';
import { Explosion } from './utils/Explosion.js';

// --- Sound ---
const soundManager = new SoundManager();

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.querySelector('#app').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // Allow clicking through
document.body.appendChild(labelRenderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
scene.add(dirLight);

// --- Physics World ---
const world = new CANNON.World();
world.gravity.set(0, -1.62, 0);

// --- Game Objects ---
const moon = new Moon(scene, world);
const explosionSystem = new Explosion(scene);

let projectiles = [];

// --- Parameters ---
const params = {
    velocity: 10,
    angle: 45,
    mass: 1000, // kg
    density: 3000, // kg/m^3 (rock)
    reset: () => fireProjectile(),
    target: new THREE.Vector3(0, 0, 0) // Default target center
};

// --- Targeting Reticule ---
const reticuleGeo = new THREE.RingGeometry(0.5, 0.8, 32);
reticuleGeo.rotateX(-Math.PI / 2);
const reticuleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
const reticule = new THREE.Mesh(reticuleGeo, reticuleMat);
reticule.position.copy(params.target);
reticule.position.y = 0.1; // Slightly above ground
scene.add(reticule);

// --- Persistent Target Marker ---
const markerGeo = new THREE.RingGeometry(0.2, 0.4, 32);
markerGeo.rotateX(-Math.PI / 2);
const markerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1.0, side: THREE.DoubleSide });
const targetMarker = new THREE.Mesh(markerGeo, markerMat);
targetMarker.visible = false;
scene.add(targetMarker);

// Raycaster for Picking
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update Reticule
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(moon.mesh);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        reticule.position.set(point.x, 0.1, point.z);
        document.body.style.cursor = 'crosshair';
    } else {
        document.body.style.cursor = 'default';
    }
}

function onPointerDown(event) {
    if (event.target.closest('#ui-controls') || event.target.tagName === 'BUTTON' || event.target.closest('#chart-container')) {
        return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(moon.mesh);

    if (intersects.length > 0) {
        // Set solid target
        params.target.copy(intersects[0].point);

        // Move Marker
        targetMarker.position.set(intersects[0].point.x, 0.12, intersects[0].point.z);
        targetMarker.visible = true;
    }
}

// Add listeners
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerdown', onPointerDown);

// --- UI Updates ---
const uiEnergy = document.getElementById('energy');
const uiDiameter = document.getElementById('diameter');
const uiDepth = document.getElementById('depth');
const uiCountdownBox = document.getElementById('countdown-box');
const uiTimeVal = document.getElementById('time-val');

let timeToImpact = 0;
let isProjectileInbound = false;

// Chart Setup
const ctx = document.getElementById('impactChart').getContext('2d');
const impactChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Impact Energy (J)',
            data: [],
            backgroundColor: 'rgba(0, 255, 136, 0.2)',
            borderColor: 'rgba(0, 255, 136, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#ccc' }
            },
            x: {
                ticks: { color: '#ccc' }
            }
        },
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: 'white' } }
        }
    }
});

let impactCount = 0;

function updateStats(energy, diameter, depth) {
    uiEnergy.innerText = energy.toExponential(2);
    uiDiameter.innerText = diameter.toFixed(2);
    uiDepth.innerText = depth.toFixed(2);

    // Update Chart
    impactCount++;
    impactChart.data.labels.push(`Impact ${impactCount}`);
    impactChart.data.datasets[0].data.push(energy);

    // Keep chart clean (last 5 impacts)
    if (impactChart.data.labels.length > 5) {
        impactChart.data.labels.shift();
        impactChart.data.datasets[0].data.shift();
    }

    impactChart.update();
}

// --- Logic ---
function fireProjectile() {
    if (projectiles.length > 0) return;

    // Physics Constants
    const g = 1.62;
    const v = params.velocity;
    const angleRad = params.angle * (Math.PI / 180);

    // Impact Velocity Components (Desired at ground level)
    const vX_impact = v * Math.cos(angleRad);
    const vY_impact = v * Math.sin(angleRad); // Magnitude

    // 1. Calculate Max Height (Energy Constraint)
    const h_max = (vY_impact * vY_impact) / (2 * g);

    // 2. Determine Spawn Height
    // Target 300m for visual effect, but clamp to physical limit
    let spawnHeight = 300;
    if (spawnHeight > h_max) {
        spawnHeight = h_max - 0.5; // Slightly below peak
    }

    // 3. Calculate Vertical Launch Velocity (at Spawn Height)
    // Energy: v_impact^2 = v_spawn^2 + 2gh
    // v_spawn^2 = v_impact^2 - 2gh
    let vY_spawn_sq = (vY_impact * vY_impact) - (2 * g * spawnHeight);
    if (vY_spawn_sq < 0) vY_spawn_sq = 0;
    const vY_spawn = -Math.sqrt(vY_spawn_sq); // Launching DOWNWARDS

    // 4. Calculate Time of Flight
    // t = (vY_impact + vY_spawn) / g  (Note: vY_spawn is negative)
    const time = (vY_impact + vY_spawn) / g;

    // 5. Calculate Horizontal Distance
    const dist = vX_impact * time;

    // 6. Set Launch Position
    const direction = new THREE.Vector3(1, 0, 0);
    const launchPos = new THREE.Vector3().copy(params.target).sub(direction.clone().multiplyScalar(dist));
    launchPos.y = spawnHeight;

    // 7. Set Launch Velocity Vector
    const velocityVec = direction.clone().multiplyScalar(vX_impact);
    velocityVec.y = vY_spawn;

    // Safety Check
    if (isNaN(launchPos.x) || isNaN(launchPos.y) || isNaN(time)) {
        console.error("Launch param NaN", { h_max, time, dist });
        return;
    }

    // Start Countdown
    timeToImpact = time;
    isProjectileInbound = true;
    if (uiCountdownBox) uiCountdownBox.style.display = 'block';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) {
        fireBtn.disabled = true;
        fireBtn.innerText = "INBOUND...";
    }

    // Single Initialization & Push
    const projectile = new Projectile(scene, world, params.mass, params.density);
    projectile.init(launchPos, velocityVec, params.mass);

    projectile.body.addEventListener('collide', (e) => {
        if (e.body.mass === 0) {
            handleImpact(projectile, e);
        }
    });
    projectiles.push(projectile);
}

function handleImpact(projectile, event) {
    // Determine impact velocity magnitude
    const velocity = projectile.body.velocity.length();
    const mass = projectile.body.mass;

    // 1. Calculate Kinetic Energy: E = 0.5 * m * v^2
    const energy = 0.5 * mass * velocity * velocity;

    // 2. Simple Scaling Law for Crater Diameter
    // Boosted scalar from 0.1 to 0.25 for better visibility of small impacts
    const diameter = 0.25 * Math.pow(energy, 0.33);

    // Visuals
    const impactPos = projectile.mesh.position.clone();

    moon.addCrater(impactPos, diameter / 2); // Radius

    // Explosion Effect
    explosionSystem.trigger(impactPos, 50 + Math.floor(energy / 1000));

    // Play Sound
    soundManager.playExplosion();

    // Reset UI
    isProjectileInbound = false;
    if (uiCountdownBox) uiCountdownBox.style.display = 'none';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) {
        fireBtn.disabled = false;
        fireBtn.innerText = "FIRE PROJECTILE";
    }

    // Update UI
    const depth = diameter * 0.2;
    updateStats(energy, diameter, depth);

    // Create HUD Label
    createLabel(impactPos, diameter, depth);

    // Mark for destruction
    projectile.shouldDestroy = true;
}

function createLabel(position, diameter, depth) {
    const div = document.createElement('div');
    div.className = 'label';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    div.style.color = '#00ff00';
    div.style.padding = '5px';
    div.style.border = '1px solid #00ff00';
    div.style.borderRadius = '4px';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '12px';
    div.innerHTML = `
        Dia: ${diameter.toFixed(2)} m<br>
        Dep: ${depth.toFixed(2)} m
    `;

    const label = new CSS2DObject(div);
    label.position.copy(position);
    label.position.y += 2; // Float above crater
    scene.add(label);

    // Ghosted Gauge
    // 1. Diameter Ring
    const ringGeo = new THREE.RingGeometry(diameter / 2 - 0.1, diameter / 2, 32);
    ringGeo.rotateX(-Math.PI / 2);
    ringGeo.translate(0, 0.05, 0);

    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(position);
    scene.add(ringMesh);

    // 2. Depth Line
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, -depth, 0));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.position.copy(position);
    scene.add(line);

    // 3. Crosshairs
    const crossPoints = [];
    crossPoints.push(new THREE.Vector3(-diameter / 2, 0.05, 0));
    crossPoints.push(new THREE.Vector3(diameter / 2, 0.05, 0));
    crossPoints.push(new THREE.Vector3(0, 0.05, -diameter / 2));
    crossPoints.push(new THREE.Vector3(0, 0.05, diameter / 2));
    const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
    const crossLines = new THREE.LineSegments(crossGeo, lineMat);
    crossLines.position.copy(position);
    scene.add(crossLines);
}

// --- GUI / Controls ---
function setupInput(id, paramKey, displayId, unit = '') {
    const input = document.getElementById(id);
    const display = document.getElementById(displayId);

    if (input) {
        input.addEventListener('input', (e) => {
            const val = Number(e.target.value);
            params[paramKey] = val;
            display.innerText = val + unit;
        });
    }
}

setupInput('inp-velocity', 'velocity', 'val-velocity', ' m/s');
setupInput('inp-angle', 'angle', 'val-angle', ' deg');
setupInput('inp-mass', 'mass', 'val-mass', ' kg');
setupInput('inp-density', 'density', 'val-density', ' kg/m³');

const fireBtn = document.getElementById('fire-btn');
if (fireBtn) {
    fireBtn.addEventListener('click', () => {
        fireProjectile();
    });
}

// --- Loop ---
const clock = new THREE.Clock();
const timeStep = 1 / 60;

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const delta = clock.getDelta();

    world.step(timeStep, delta, 3);

    // Update Countdown
    if (isProjectileInbound && timeToImpact > 0) {
        timeToImpact -= delta;
        if (timeToImpact < 0) timeToImpact = 0;
        if (uiTimeVal) uiTimeVal.innerText = timeToImpact.toFixed(2);
    }

    explosionSystem.update(delta);
    controls.update();

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];

        if (p.shouldDestroy) {
            p.destroy();
            projectiles.splice(i, 1);
        } else if (!p.mesh && !p.body) {
            projectiles.splice(i, 1);
        } else {
            p.update();
        }
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
