import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
scene.background = new THREE.Color(0x000000); // Stark black space

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 2000000); // Near/Far planes increased
camera.position.set(0, 50000, 100000); // 100km out
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Clamping pixel ratio to max 2 prevents the post-processing Bloom from tanking 4K/5K displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadow edges
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Photographic exposure handling
renderer.toneMappingExposure = 1.2; // Slightly boosted exposure
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
controls.maxPolarAngle = Math.PI / 2.0; // Lock perfectly to the horizon line
controls.minDistance = 2000;
controls.maxDistance = 1500000; // Allow zooming way out to see the massive new plane

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.02); // Pitch black shadows with tiny ambient
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5); // Stark white sunlight, very intense
dirLight.position.set(100000, 25000, 100000); // Very low sun angle (25km up) for long drastic shadows
dirLight.castShadow = true;
// Optimize shadow map bounds and resolution to save VRAM
const shadowSize = 150000;
dirLight.shadow.camera.top = shadowSize;
dirLight.shadow.camera.bottom = -shadowSize;
dirLight.shadow.camera.left = -shadowSize;
dirLight.shadow.camera.right = shadowSize;
dirLight.shadow.bias = -0.0001;
// Dropped from 4096 to safely save 75% shadow VRAM
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Impact Flash Light
const impactLight = new THREE.PointLight(0xffffff, 0, 50000);
scene.add(impactLight);

// --- Post Processing ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.8; // Only bloom very bright objects (ejecta and stars), prevent pure whiteouts
bloomPass.strength = 0.6; // Lowered from 1.2
bloomPass.radius = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- Starfield ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);
const maxDist = 1000000;
for (let i = 0; i < starsCount; i++) {
    // Generate stars extending slightly below the horizon (down to ~-11 degrees)
    const r = maxDist * (0.8 + Math.random() * 0.2); // Keep them far away
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * (Math.PI / 2 + 0.2); // 0 to ~101 degrees (extends below equator)

    posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);     // x
    posArray[i * 3 + 1] = r * Math.cos(phi);                   // y
    posArray[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta); // z
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: 500,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});
const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);

// --- Earth Background ---
// Create a massive procedural Earth in the deep background
const earthGroup = new THREE.Group();
const earthRadius = 25000; // Shrunk so it looks further away
const earthDist = 600000; // Pushed further into the background

// Earth Sphere
const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

// Procedural Shader Material for Earth (Oceans + Atmosphere + Continents)
// Replaced with actual NASA texture based on user feedback
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('./earth.jpg');

const earthMat = new THREE.MeshLambertMaterial({
    map: earthTexture,
    emissive: new THREE.Color(0x112233), // slight blue atmospheric glow in shadow
    emissiveIntensity: 0.2
});

const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthGroup.add(earthMesh);

// Position Earth: High up in the sky, far away
// Y is up, -Z is into the screen.
earthGroup.position.set(-earthDist * 0.3, earthDist * 0.4, -earthDist * 0.9);
// Rotate so it looks nice (North America / Pacific visible)
earthGroup.rotation.z = 0.4;
earthGroup.rotation.y = -1.0;
earthGroup.rotation.x = 0.2;
scene.add(earthGroup);

// --- Physics World ---
const world = new CANNON.World();
world.gravity.set(0, -1.62, 0);

// --- Game Objects ---
const moon = new Moon(scene, world);
const explosionSystem = new Explosion(scene);

let projectiles = [];

// --- Parameters ---
const params = {
    velocity: 10, // km/s
    angle: 90,
    mass: 1e8, // kg (Start at min)
    density: 3000, // kg/m^3 (rock)
    reset: () => fireProjectile(),
    target: new THREE.Vector3(0, 0, 0) // Default target center
};

// --- Targeting Reticule ---
// Scale up reticule (1km size)
const reticuleGeo = new THREE.RingGeometry(1000, 1500, 32);
reticuleGeo.rotateX(-Math.PI / 2);
const reticuleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
const reticule = new THREE.Mesh(reticuleGeo, reticuleMat);
reticule.position.copy(params.target);
reticule.position.y = 0.1; // Slightly above ground
scene.add(reticule);

// --- Persistent Target Marker ---
// --- Persistent Target Marker ---
const markerGeo = new THREE.RingGeometry(200, 600, 32);
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
        reticule.position.set(point.x, 100, point.z); // Lift reticule slightly
        reticule.visible = true;
        document.body.style.cursor = 'crosshair';
    } else {
        reticule.visible = false;
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
        targetMarker.position.set(intersects[0].point.x, 120, intersects[0].point.z);
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
let impactChart = null;
const impactHistory = []; // Store all impact data
let currentChartType = 'energy';

// Initialize Chart
function initChart() {
    if (impactChart) impactChart.destroy();

    const selector = document.getElementById('chart-selector');
    if (selector) currentChartType = selector.value;

    // Toggle Button Visibility
    const toggleBtn = document.getElementById('btn-toggle-curve');
    if (toggleBtn) {
        toggleBtn.style.display = (currentChartType === 'energy') ? 'none' : 'inline-block';
    }

    let config = {};

    // Unit: All distance/size in km for display
    if (currentChartType === 'energy') {
        const recentHistory = impactHistory.slice(-5);
        config = {
            type: 'bar',
            data: {
                labels: recentHistory.map(d => `Impact ${d.id}`),
                datasets: [{
                    label: 'Impact Energy (J)',
                    data: recentHistory.map(d => d.energy),
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    borderColor: 'rgba(0, 255, 136, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc' }, title: { display: true, text: 'Energy (J)', color: '#ccc' } },
                    x: { ticks: { color: '#ccc' } }
                },
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } }
            }
        };
    } else if (currentChartType === 'crater-dia') {
        const historyData = impactHistory.map(d => ({ x: d.mass, y: d.craterDiameter / 1000 })); // m -> km

        config = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Mass (kg) vs Crater Dia (km)',
                    data: historyData,
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear', // Use Linear scale for Mass to show Power Law curve shape
                        position: 'bottom',
                        title: { display: true, text: 'Mass (kg)', color: '#ccc' },
                        ticks: {
                            color: '#ccc',
                            callback: function (value, index, values) {
                                // Exponential notation for ticks
                                return Number(value).toExponential();
                            }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Crater Diameter (km)', color: '#ccc' },
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                },
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } }
            }
        };
    } else if (currentChartType === 'vel-dia') {
        const historyData = impactHistory.map(d => ({ x: d.velocity, y: d.craterDiameter / 1000 })); // m -> km, v is already km/s in history

        config = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Velocity (km/s) vs Crater Dia (km)',
                    data: historyData,
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Velocity (km/s)', color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Crater Diameter (km)', color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                },
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } }
            }
        };
    }

    impactChart = new Chart(ctx, config);

    // Auto-update Curve if applicable
    updateCurve();
}

function updateCurve() {
    if (!impactChart || currentChartType === 'energy') return;

    // Check toggle state
    if (!isCurveVisible) {
        // Remove if exists
        const existingIndex = impactChart.data.datasets.findIndex(d => d.label === 'Theoretical Curve');
        if (existingIndex !== -1) {
            impactChart.data.datasets.splice(existingIndex, 1);
            impactChart.update();
        }
        return;
    }

    // Theoretical Power Law Curve
    // Formula: D(m) = 0.158 * M^0.26 * V(m/s)^0.44 * AngleFactor
    // Result D must be converted to km for graph.

    const curvePoints = [];
    const angleRad = params.angle * (Math.PI / 180);
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);

    if (currentChartType === 'crater-dia') {
        // Plotting Mass (X) vs Diameter (Y, km)
        // Var: Mass 1e8 to 1e15
        // Const: Velocity (Current layout val in km/s)
        const v_ms = params.velocity * 1000;

        for (let exp = 8; exp <= 15; exp += 0.1) {
            const m = Math.pow(10, exp);
            const d_m = 0.158 * Math.pow(m, 0.26) * Math.pow(v_ms, 0.44) * angleFactor;
            curvePoints.push({ x: m, y: d_m / 1000 }); // Display in km
        }
    } else if (currentChartType === 'vel-dia') {
        // Plotting Velocity (X, km/s) vs Diameter (Y, km)
        // Var: Velocity 5 to 80 (km/s)
        // Const: Mass (Current slider)
        const m = params.mass;

        for (let v_km = 5; v_km <= 80; v_km += 1) {
            const v_ms = v_km * 1000;
            const d_m = 0.158 * Math.pow(m, 0.26) * Math.pow(v_ms, 0.44) * angleFactor;
            curvePoints.push({ x: v_km, y: d_m / 1000 }); // Display in km
        }
    }

    // Add Curve Dataset
    const existingIndex = impactChart.data.datasets.findIndex(d => d.label === 'Theoretical Curve');
    if (existingIndex !== -1) {
        impactChart.data.datasets.splice(existingIndex, 1);
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
        tension: 0.4
    });

    impactChart.update();
}

// Initial load
initChart();

// Listener for dropdown
const chartSelector = document.getElementById('chart-selector');
if (chartSelector) {
    chartSelector.addEventListener('change', () => initChart()); // Reset chart on change
}

// Toggle Curve Logic
let isCurveVisible = false;
const toggleBtn = document.getElementById('btn-toggle-curve');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        isCurveVisible = !isCurveVisible;

        // Update Button Text
        toggleBtn.innerText = isCurveVisible ? "HIDE CURVE" : "SHOW CURVE";

        // Update Graph
        updateCurve();
    });
}

let impactCount = 0;

function updateStats(energy, diameter, depth, mass, projectileDiameter) {
    uiEnergy.innerText = energy.toExponential(2);
    // UI Display: Convert from meters to km
    const dia_km = diameter / 1000;
    const dep_km = depth / 1000;

    uiDiameter.innerText = dia_km.toFixed(2);
    uiDepth.innerText = dep_km.toFixed(2);

    // Morphology Display
    const uiShape = document.getElementById('crater-shape');
    let isComplex = false;
    if (uiShape) {
        if (diameter <= 15000) {
            uiShape.innerText = "Simple (Bowl-Shaped)";
            uiShape.style.color = "#00ff88";
            isComplex = false;
        } else {
            uiShape.innerText = "Complex (Central Peak)";
            uiShape.style.color = "#ffb86c";
            isComplex = true;
        }
    }

    drawCraterProfile(isComplex);

    // Update History
    impactCount++;
    impactHistory.push({
        id: impactCount,
        energy: energy,
        mass: mass,
        velocity: params.velocity, // Storing km/s for easy graphing
        craterDiameter: diameter, // Store meters internally for consistency? No, lets store raw meters
        projectileDiameter: projectileDiameter
    });

    // Efficiency: If we just added a point, we can push to chart.
    // But since we support switching, re-rendering or updating is needed.
    // Let's just call initChart() to refresh the view with new data.
    initChart();
}

// --- Logic ---
function fireProjectile() {
    if (projectiles.length > 0) return;

    // Physics Constants
    const g = 1.62;
    const v = params.velocity * 1000; // Convert km/s to m/s for physics
    const angleRad = params.angle * (Math.PI / 180);

    // Impact Velocity Components (Desired at ground level)
    const vX_impact = v * Math.cos(angleRad);
    const vY_impact = v * Math.sin(angleRad); // Magnitude

    // 1. Calculate Max Height (Energy Constraint)
    const h_max = (vY_impact * vY_impact) / (2 * g);

    // 2. Determine Spawn Height
    // Target 50,000m (50km) for visuals
    let spawnHeight = 50000;
    if (spawnHeight > h_max) {
        spawnHeight = h_max - 500; // Slightly below peak
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
        console.warn("Launch param physics check failed, clamping.", { h_max, time, dist });
        // Fallback for visual:
        if (isNaN(time)) {
            time = 10;
        }
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

    // 2. Reference Scaling Law (From provided code)
    // Formula from 'java code.txt': D(km) = 1.58E-4 * M^0.26 * V(km/s * 1000)^0.44
    // Converted to Meters: D(m) = 0.158 * M^0.26 * V(m/s)^0.44

    // Physics Note: The exponent 0.26 (approx 1/3.8) is characteristic of the 
    // Holsapple-Schmidt Gravity Regime for non-porous targets.
    // This implicitly handles the "large crater" scaling.

    let diameter = 0.158 * Math.pow(mass, 0.26) * Math.pow(velocity, 0.44);

    // Apply Angle Correction (Standard Efficiency)
    // Reference likely assumes max efficiency or a specific angle. 
    // We apply standard sin(theta)^(1/3) scaling to make angle meaningful.
    const angleRad = params.angle * (Math.PI / 180);
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);

    diameter *= angleFactor;

    // Log for verification
    console.log("Physics Audit (Reference Formula):", {
        mass, velocity, angle: params.angle,
        baseDiameter: diameter / angleFactor,
        finalDiameter: diameter
    });

    // Visuals
    const impactPos = projectile.mesh.position.clone();
    moon.addCrater(impactPos, diameter / 2, params.angle); // Pass radius and impact angle

    // Impact Flash
    impactLight.position.copy(impactPos);
    impactLight.position.y += 1000; // slightly above
    let flashIntensity = Math.min(10, 2 + Math.floor(energy / 1e14));
    impactLight.intensity = flashIntensity;

    // Fade out light over time
    const fadeLight = () => {
        if (impactLight.intensity > 0.1) {
            impactLight.intensity -= flashIntensity * 0.05;
            requestAnimationFrame(fadeLight);
        } else {
            impactLight.intensity = 0;
        }
    };
    fadeLight();

    // Explosion Effect
    // Cap particles to prevent crash at high energy (e.g. 1e16 J)
    const particleCount = Math.min(500, 50 + Math.floor(energy / 1000));
    explosionSystem.trigger(impactPos, particleCount);

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
    // DEPTH CALCULATION (Pike 1977)
    // Simple Craters (< 15 km): d = 0.2 * D
    // Complex Craters (> 15 km): d = 1.04 * D^0.301 (Dimensions in km)

    let depth;
    if (diameter <= 15000) {
        depth = diameter * 0.2;
    } else {
        const D_km = diameter / 1000;
        const d_km = 1.04 * Math.pow(D_km, 0.301);
        depth = d_km * 1000;
    }

    // Calculate projectile real diameter (2 * radius)
    // Note: projectile.radius is the physical radius, projectile.visRadius is clamped visuals
    const projDia = projectile.radius * 2;

    // SCALING VISUAL FIX:
    // If the crater is huge (km size), the visual lines need to be huge too.

    updateStats(energy, diameter, depth, mass, projDia);

    // Create HUD Label
    createLabel(impactPos, diameter, depth);

    // Mark for destruction
    projectile.shouldDestroy = true;
}

function createLabel(position, diameter, depth) {
    const div = document.createElement('div');
    div.className = 'impact-marker';

    // Display in KM
    const dia_km = diameter / 1000;
    const dep_km = depth / 1000;

    div.innerHTML = `<span class="marker-id">IMPACT ${impactCount}</span><br>Ø ${dia_km.toFixed(1)} km<br>↓ ${dep_km.toFixed(1)} km`;

    // Click to Fly Camera
    div.onclick = () => {
        flyToCrater(position, diameter);
    };

    const label = new CSS2DObject(div);
    label.position.copy(position);
    label.position.y += Math.max(100, diameter * 0.1); // Float above crater smartly
    scene.add(label);

    // Ghosted Gauge
    // 1. Diameter Ring
    const ringGeo = new THREE.RingGeometry(diameter / 2 - (diameter * 0.05), diameter / 2, 64);
    ringGeo.rotateX(-Math.PI / 2);
    // Lift scaling with diameter
    const lift = Math.max(50, diameter * 0.05);
    ringGeo.translate(0, lift, 0);

    // 2. Depth Line
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, -depth, 0));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        linewidth: 2
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.position.copy(position);
    scene.add(line);

    // 3. Crosshairs
    const crossPoints = [];
    crossPoints.push(new THREE.Vector3(-diameter / 2, lift, 0));
    crossPoints.push(new THREE.Vector3(diameter / 2, lift, 0));
    crossPoints.push(new THREE.Vector3(0, lift, -diameter / 2));
    crossPoints.push(new THREE.Vector3(0, lift, diameter / 2));
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
            updateCurve(); // Real-time curve update
        });
    }
}

setupInput('inp-velocity', 'velocity', 'val-velocity', ' km/s');
setupInput('inp-angle', 'angle', 'val-angle', ' deg');

// Logarithmic Mass Input
const massInput = document.getElementById('inp-mass');
const massDisplay = document.getElementById('val-mass');
if (massInput && massDisplay) {
    massInput.addEventListener('input', (e) => {
        const exp = Number(e.target.value); // 3 to 10
        const val = Math.pow(10, exp);
        params.mass = val;
        massDisplay.innerText = val.toExponential(1) + ' kg';
        updateCurve(); // Real-time curve update
    });
}

const densitySelect = document.getElementById('inp-density');
if (densitySelect) {
    densitySelect.addEventListener('change', (e) => {
        params.density = Number(e.target.value);
    });
}

const fireBtn = document.getElementById('fire-btn');
if (fireBtn) {
    fireBtn.addEventListener('click', () => {
        fireProjectile();
    });
}

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        // Reset Logic
        // 1. Clear Projectiles
        for (let p of projectiles) {
            p.destroy();
        }
        projectiles.length = 0;

        // 2. Clear Craters (Reload Page or Clear Mesh?)
        // Reloading page is simplest but jarring.
        // Let's reload page for true reset as crater deformation is permanent on mesh.
        location.reload();
    });
}

// --- Morphology Canvas ---
function drawCraterProfile(isComplex) {
    const canvas = document.getElementById('craterProfile');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw ground line (faint)
    ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 4);
    ctx.lineTo(w, h / 4);
    ctx.stroke();

    // Draw Crater Profile Curve
    ctx.strokeStyle = isComplex ? "#ffb86c" : "#00ff88"; // Match text color
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const cw = w * 0.8; // Crater width
    const startX = (w - cw) / 2;
    const endX = startX + cw;
    const groundY = h / 4;
    const rimY = h / 4 - 10;
    const bottomY = h - 15;

    ctx.moveTo(0, groundY);
    ctx.lineTo(startX - 20, groundY); // Flat ground left
    // Rim up
    ctx.lineTo(startX, rimY);

    if (isComplex) {
        // Complex profile: terraced walls, central peak
        ctx.bezierCurveTo(startX + cw * 0.2, bottomY, startX + cw * 0.4, bottomY, w / 2, bottomY - 30); // Left wall to center peak
        ctx.bezierCurveTo(endX - cw * 0.4, bottomY, endX - cw * 0.2, bottomY, endX, rimY); // Center peak to right wall
    } else {
        // Simple profile: smooth bowl
        ctx.bezierCurveTo(startX + cw * 0.1, bottomY + 20, endX - cw * 0.1, bottomY + 20, endX, rimY);
    }

    // Rim down
    ctx.lineTo(endX + 20, groundY);
    ctx.lineTo(w, groundY); // Flat ground right

    ctx.stroke();

    // Draw Fill (Visual weight)
    ctx.lineTo(w, h); // Down
    ctx.lineTo(0, h); // Left
    ctx.closePath();
    ctx.fillStyle = isComplex ? "rgba(255, 184, 108, 0.15)" : "rgba(0, 255, 136, 0.15)";
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
}

// --- Cinematic Camera Flight ---
function flyToCrater(targetPos, diameter) {
    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();

    // Calculate a good viewing distance based on crater size (min 2km away)
    const viewDist = Math.max(2000, diameter * 2.0);
    // Position camera diagonally up and back from the crater
    const camOffset = new THREE.Vector3(targetPos.x, targetPos.y + viewDist * 0.6, targetPos.z + viewDist);

    let frame = 0;
    const duration = 60; // 1 second at 60fps

    function animateFlight() {
        frame++;
        const t = frame / duration;
        // Ease Out Cubic: fast start, slow finish
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startCamPos, camOffset, ease);
        controls.target.lerpVectors(startTarget, targetPos, ease);
        controls.update();

        if (frame < duration) {
            requestAnimationFrame(animateFlight);
        }
    }
    animateFlight();
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

    // Scale reticules dynamically based on camera distance 
    const distTarget = camera.position.distanceTo(reticule.position);
    // Base scale 1 at 50,000m. Allow it to shrink down to 0.1 when very close.
    const scaleFactor = Math.max(0.1, distTarget / 50000);
    reticule.scale.set(scaleFactor, 1, scaleFactor);
    targetMarker.scale.set(scaleFactor, 1, scaleFactor);

    composer.render();
    labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
