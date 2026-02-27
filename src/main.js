import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as CANNON from 'cannon-es';

import { Moon } from './scene/Moon.js';
import { EarthTiles } from './scene/Earth.js';
import { Projectile } from './physics/Projectile.js';
import { SoundManager } from './utils/Sound.js';
import { Explosion } from './utils/Explosion.js';

import {
    BLOOM_THRESHOLD, BLOOM_STRENGTH, BLOOM_RADIUS,
    STAR_COUNT,
    HOLSAPPLE_COEFF, HOLSAPPLE_MASS_EXP, HOLSAPPLE_VEL_EXP,
    PIKE_SIMPLE_DEPTH_RATIO, PIKE_COMPLEX_COEFF, PIKE_COMPLEX_EXP,
    SIMPLE_COMPLEX_THRESHOLD_M,
    MOON_GRAVITY,
    EARTH_GRAVITY,
} from './constants.js';
import { state } from './state.js';
import { initCharts } from './ui/charts.js';
import { updateStats } from './ui/hud.js';
import { initEarthSearch, reverseGeocode } from './ui/search.js';
import { createImpactMarker } from './scene/markers.js';
import { flyToCrater, transitionToEarth, returnToMoon } from './scene/camera.js';
import { initPointerHandlers, initControlBindings } from './input.js';

// =============================================================
// Scene
// =============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x080808, 0.0000008);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 6000000);
camera.position.set(0, 50000, 100000);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Clamping pixel ratio to max 2 prevents Bloom from tanking 4K/5K displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.querySelector('#app').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// =============================================================
// Controls
// =============================================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.0;
controls.minDistance = 2000;
controls.maxDistance = 350000; // ~350 km — far enough to see full playable area, never exposes star sphere

// =============================================================
// Lights
// =============================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.005); // Near-zero — vacuum has no fill light
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3.2); // Intense sunlight, high-contrast lunar look
dirLight.position.set(100000, 25000, 100000);
dirLight.castShadow = true;
const shadowSize = 150000;
dirLight.shadow.camera.top = shadowSize;
dirLight.shadow.camera.bottom = -shadowSize;
dirLight.shadow.camera.left = -shadowSize;
dirLight.shadow.camera.right = shadowSize;
dirLight.shadow.bias = -0.0001;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Earthshine — faint blue-white fill light from Earth's direction (upper-left sky).
// Direction matches earthGroup.position vector so lit faces are consistent.
const earthshineLight = new THREE.DirectionalLight(0x6699cc, 0.08);
earthshineLight.position.set(-0.28, 0.38, -0.88).normalize().multiplyScalar(500000);
scene.add(earthshineLight);

// Impact flash — intensity set to 0 until an impact occurs
const impactLight = new THREE.PointLight(0xffffff, 0, 50000);
scene.add(impactLight);

// =============================================================
// Post-Processing (Bloom)
// =============================================================
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD  // Only bloom very bright objects (ejecta, stars); prevents whiteouts
);

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);

// =============================================================
// Starfield
// =============================================================
const starsGeo = new THREE.BufferGeometry();
const positions = new Float32Array(STAR_COUNT * 3);
const colors = new Float32Array(STAR_COUNT * 3);
// Place stars far enough that the camera can never reach them (maxDistance = 350km)
const maxDist = 4000000;

// Stellar type color palette (O/B → M sequence)
const starPalette = [
    { r: 0.7, g: 0.8, b: 1.0 }, // Blue-white (O/B)  15%
    { r: 1.0, g: 1.0, b: 1.0 }, // White (A/F)        55%
    { r: 1.0, g: 0.95, b: 0.85 }, // Warm white (G)     15%
    { r: 1.0, g: 0.85, b: 0.6 }, // Orange (K)         10%
    { r: 1.0, g: 0.7, b: 0.5 }, // Deep orange (M)     5%
];

for (let i = 0; i < STAR_COUNT; i++) {
    const r = maxDist * (0.8 + Math.random() * 0.2);
    const theta = Math.random() * Math.PI * 2;
    // Full sphere distribution — stars below the horizon are naturally occluded
    // by the opaque moon mesh via depth testing (depthTest: true on the material).
    const phi = Math.acos(1 - 2 * Math.random()); // uniform sphere sampling

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const roll = Math.random();
    const col = roll < 0.15 ? starPalette[0]
        : roll < 0.70 ? starPalette[1]
            : roll < 0.85 ? starPalette[2]
                : roll < 0.95 ? starPalette[3]
                    : starPalette[4];

    const brightness = 0.6 + Math.random() * 0.4;
    colors[i * 3] = col.r * brightness;
    colors[i * 3 + 1] = col.g * brightness;
    colors[i * 3 + 2] = col.b * brightness;
}

starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
    size: 1600, vertexColors: true, transparent: true,
    opacity: 0.9, sizeAttenuation: true, fog: false,
    depthTest: true,  // moon mesh occludes stars below the horizon naturally
    depthWrite: false,
})));

// =============================================================
// Earth Background
// =============================================================
// Earth in world space at 2 000 km — well beyond the camera's max
// orbit of 350 km, so the maximum angular drift while orbiting is
// atan(350/2000) ≈ 10°, imperceptible on a casual orbit.
// Stars sit at up to 4 000 km so Earth is well inside the star sphere
// and won't be clipped by the far plane (6 000 km).
//
// Artistic angular size ~8°: noticeably larger than "correct" (2°)
// so it reads as a dramatic presence without dominating the sky.
const earthDist = 2000000;           // 2 000 km world-space distance
const earthRadius = earthDist * 0.07;  // ~8° apparent half-angle

const earthGroup = new THREE.Group();

// Earth uses Layer 1 so a dedicated sun light (also on layer 1) illuminates
// it correctly without affecting the Moon terrain (layer 0).
const EARTH_LAYER = 1;

// Earth surface — PBR material, lit by earthSunLight on layer 1 only.
// Emissive lifts the night side to a deep ocean-blue rather than pure black.
const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
const earthMat = new THREE.MeshStandardMaterial({
    roughness: 0.6,
    metalness: 0.0,
    emissive: new THREE.Color(0x0a1e35),
    emissiveIntensity: 0.4,  // visible night-side city-light glow
});
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.layers.set(EARTH_LAYER);
earthMesh.renderOrder = -1;
earthGroup.add(earthMesh);

// Atmosphere limb — inner vivid Rayleigh band (electric blue terminator ring)
const atmInner = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius * 1.016, 64, 64),
    new THREE.MeshBasicMaterial({
        color: 0x66bbff,
        transparent: true,
        opacity: 0.55,
        side: THREE.BackSide,
        depthWrite: false,
    })
);
atmInner.layers.set(EARTH_LAYER);
atmInner.renderOrder = 0;
earthGroup.add(atmInner);

// Atmosphere limb — mid diffuse scatter band
const atmMid = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius * 1.045, 64, 64),
    new THREE.MeshBasicMaterial({
        color: 0x2277ee,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
        depthWrite: false,
    })
);
atmMid.layers.set(EARTH_LAYER);
atmMid.renderOrder = 0;
earthGroup.add(atmMid);

// Atmosphere limb — outer faint corona
const atmOuter = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius * 1.12, 64, 64),
    new THREE.MeshBasicMaterial({
        color: 0x1155cc,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false,
    })
);
atmOuter.layers.set(EARTH_LAYER);
atmOuter.renderOrder = 0;
earthGroup.add(atmOuter);

// Upper-left sky — classic Apollo composition (~17° left, ~23° above horizon)
earthGroup.position.set(
    -earthDist * 0.28,
    earthDist * 0.38,
    -earthDist * 0.88
);
// Axial tilt ~23.5°: North Pole tilted upper-right
earthGroup.rotation.set(0.18, -0.9, 0.41);
scene.add(earthGroup);

// Dedicated sun for Earth — on layer 1 so it ONLY lights Earth meshes.
// Sun direction matches the scene's main dirLight (front-right).
const earthSunLight = new THREE.DirectionalLight(0xfff8f0, 4.0);
earthSunLight.position.set(1.0, 0.4, 1.0).normalize().multiplyScalar(earthDist);
earthSunLight.layers.set(EARTH_LAYER);
scene.add(earthSunLight);

// Camera must also enable layer 1 to see Earth objects
camera.layers.enable(EARTH_LAYER);

// Load earth texture with error boundary — fallback to solid blue if unavailable
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    './earth.jpg',
    (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = tex;
        earthMat.needsUpdate = true;
    },
    undefined,
    () => {
        earthMat.color.set(0x2255aa); // vivid blue fallback if texture missing
        const el = document.getElementById('earth-loading');
        if (el) el.innerText = 'Earth texture unavailable — using colour fallback.';
        console.warn('main: failed to load earth.jpg — using fallback colour.');
    }
);

// =============================================================
// Physics World
// =============================================================
const world = new CANNON.World();
world.gravity.set(0, -MOON_GRAVITY, 0);

// =============================================================
// Game Objects
// =============================================================
const moon = new Moon(scene, world);
const explosionSystem = new Explosion(scene);
const soundManager = new SoundManager();

// Isolate impacts into mode-specific groups so they don't bleed visually
const moonImpactsGroup = new THREE.Group();
const earthImpactsGroup = new THREE.Group();
scene.add(moonImpactsGroup);
// Earth impacts are hidden by default, added when entering Earth mode
scene.add(earthImpactsGroup);
earthImpactsGroup.visible = false;

// Earth ground plane — added/removed from the physics world when
// switching modes so projectile collisions stay isolated.
const earthGroundShape = new CANNON.Plane();
const earthGroundBody = new CANNON.Body({
    mass: 0,
    shape: earthGroundShape,
    material: new CANNON.Material({ friction: 0.5, restitution: 0.3 }),
});
earthGroundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// =============================================================
// Earth Tiles (Google Photorealistic 3D)
// Replace YOUR_API_KEY with your Google Maps Platform key.
// Get one at: https://console.cloud.google.com/
// Enable: Map Tiles API + Places API + Geocoding API
// =============================================================
const GOOGLE_API_KEY = 'AIzaSyDGGUK5b09T90xyhqSaPfo5_5OCVMIGqso';
const earthTiles = new EarthTiles(scene, camera, renderer, GOOGLE_API_KEY);

// =============================================================
// Targeting Reticules
// =============================================================
const reticuleGeo = new THREE.RingGeometry(1000, 1500, 32);
reticuleGeo.rotateX(-Math.PI / 2);
const reticule = new THREE.Mesh(reticuleGeo, new THREE.MeshBasicMaterial({
    color: 0xff0000, transparent: true, opacity: 0.8,
    side: THREE.DoubleSide, depthTest: false,
}));
reticule.renderOrder = 999;
reticule.position.copy(state.params.target);
reticule.position.y = 0.1;
scene.add(reticule);

const markerGeo = new THREE.RingGeometry(200, 600, 32);
markerGeo.rotateX(-Math.PI / 2);
const targetMarker = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({
    color: 0x00ff00, transparent: true, opacity: 1.0,
    side: THREE.DoubleSide, depthTest: false,
}));
targetMarker.renderOrder = 999;
targetMarker.visible = false;
scene.add(targetMarker);

// =============================================================
// Earth Transition
// =============================================================
const earthContainer = document.getElementById('earth-container');
const btnReturnMoon = document.getElementById('btn-return-moon');

// Saved camera state for returning from Earth
let savedEarthCamPos = new THREE.Vector3();
let savedEarthCamTarget = new THREE.Vector3();

function onEarthClick() {
    state.currentMode = 'transitioning';

    // Immediately hide Moon impacts + terrain during the transition flight out
    moonImpactsGroup.visible = false;
    scene.remove(moon.mesh);
    scene.remove(moon.horizonMesh);

    const result = transitionToEarth(camera, controls, earthGroup, earthRadius, () => {
        earthContainer.classList.add('active');
        btnReturnMoon.style.display = 'block';
        document.querySelector('#ui-container h1').innerText = 'EARTH IMPACT';

        // Show Earth impacts only after we arrive
        earthImpactsGroup.visible = true;

        // --- Physics isolation: remove Moon entirely, enable Earth ground ---
        world.gravity.set(0, -EARTH_GRAVITY, 0);

        state.currentMode = 'earth';

        // Load tiles centred on the default/last target location
        const { lat, lng } = state.earth.impactLocation;
        earthTiles.flyToLocation(lat, lng);
        document.getElementById('earth-loading').classList.remove('hidden');

        // Position camera looking down from ~25 km altitude
        // Offset Z by 1 to prevent OrbitControls gimbal lock singularity (viewing exactly along Y axis)
        camera.position.set(0, 25000, 1);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.minDistance = 200;
        controls.maxDistance = 800000;
        controls.maxPolarAngle = Math.PI * 0.85;  // Allow tilting but prevent going underground
        controls.enableDamping = true;
        controls.enabled = true; // MUST RE-ENABLE AFTER FLIGHT
        controls.update();

        // Wire up the search box now that the Places API is loaded
        initEarthSearch({
            onPlaceSelected: ({ lat, lng, name }) => {
                earthTiles.flyToLocation(lat, lng);
                // Reset camera to top-down view over new location (offset Z to avoid lock)
                camera.position.set(0, 25000, 1);
                camera.lookAt(0, 0, 0);
                controls.target.set(0, 0, 0);
                // Reset reticule target to tile origin when new location loads
                state.params.target.set(0, 0, 0);
                controls.update();
                updateEarthTargetStrip(name, lat, lng);
            },
            onClear: () => {
                const strip = document.getElementById('earth-target-strip');
                if (strip) strip.classList.add('hidden');
            },
        });

        // Show the default target in the strip if one is already set
        const { name } = state.earth.impactLocation;
        if (name) updateEarthTargetStrip(name, lat, lng);
    });
    savedEarthCamPos.copy(result.savedPos);
    savedEarthCamTarget.copy(result.savedTarget);
}

function updateEarthTargetStrip(name, lat, lng) {
    const strip = document.getElementById('earth-target-strip');
    const nameEl = document.getElementById('earth-target-name');
    const coordEl = document.getElementById('earth-target-coords');
    if (!strip) return;
    strip.classList.remove('hidden');
    nameEl.innerText = name;
    coordEl.innerText = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}

btnReturnMoon.addEventListener('click', () => {
    state.currentMode = 'transitioning';
    earthContainer.classList.remove('active');
    btnReturnMoon.style.display = 'none';
    document.querySelector('#ui-container h1').innerText = 'LUNAR IMPACT';

    // Immediately hide Earth impacts during the transition flight back
    earthImpactsGroup.visible = false;
    // Hide Earth-specific UI overlays completely
    const strip = document.getElementById('earth-target-strip');
    if (strip) strip.classList.add('hidden');
    // Clear Search bar value to dismiss any open autocomplete dropdowns
    const searchInput = document.getElementById('pac-input');
    if (searchInput) searchInput.value = '';

    // Immediately destroy Tiles so they don't render in the background frame
    earthTiles.dispose();

    // Get the Earth sphere's world-space centre for the departure animation.
    const earthCenterWorld = new THREE.Vector3();
    earthGroup.getWorldPosition(earthCenterWorld);

    // The Earth-mode camera sits at (0, 15000, 20000) in world space (near the
    // Moon origin), NOT near the Earth sphere. Compute where the camera would
    // be if it were that same offset applied relative to the Earth globe:
    const earthCamWorldPos = earthCenterWorld.clone().add(camera.position);

    // Keep Earth constraints active during the flight so OrbitControls doesn't
    // clamp the camera while it travels the full Earth→Moon distance.
    // Restore Moon constraints only in onComplete, after the flight lands.
    returnToMoon(camera, controls, savedEarthCamPos, savedEarthCamTarget, earthCenterWorld, earthRadius, () => {
        // --- Visual isolation: restore Moon terrain/impacts ---
        // (Earth impacts and Tiles were already hidden when the flight began)
        scene.add(moon.mesh);
        scene.add(moon.horizonMesh);
        moonImpactsGroup.visible = true;

        world.addBody(moon.body);
        world.removeBody(earthGroundBody);
        world.gravity.set(0, -MOON_GRAVITY, 0);

        controls.minDistance = 2000;
        controls.maxDistance = 350000;
        controls.maxPolarAngle = Math.PI / 2; // Restore Moon constraint
        state.currentMode = 'moon';
    }, earthCamWorldPos);
});

// =============================================================
// Simulation — Fire & Impact
// =============================================================

// Flight time is fixed so every impact is cinematic regardless of
// velocity or mass settings. Crater physics still uses the configured
// values — the Cannon body is purely for visuals and collision detection.
const FLIGHT_TIME = 3;    // seconds
const SPAWN_HEIGHT = 50000; // 50 km above the surface

// Capture the intended surface target at fire time so handleImpact can
// use it regardless of where the physics body ends up (tunneling artifact).
let pendingImpactPos = new THREE.Vector3();

function fireProjectile() {
    if (state.projectiles.length > 0) return;

    const g = MOON_GRAVITY;
    const v = state.params.velocity * 1000; // km/s → m/s
    const angleRad = state.params.angle * (Math.PI / 180);
    const vH = v * Math.cos(angleRad); // horizontal speed magnitude

    // Random azimuth each fire — the slider controls elevation angle only.
    // This means the asteroid can arrive from any compass bearing.
    const azimuth = Math.random() * Math.PI * 2;
    const vX = vH * Math.cos(azimuth);
    const vZ = vH * Math.sin(azimuth);

    // Compute vY so the body falls from SPAWN_HEIGHT to y=0 in exactly FLIGHT_TIME seconds:
    // 0 = SPAWN_HEIGHT + vY * t - ½g * t²  →  vY = (-SPAWN_HEIGHT + ½g * t²) / t
    const vY = (-SPAWN_HEIGHT + 0.5 * g * FLIGHT_TIME * FLIGHT_TIME) / FLIGHT_TIME;

    // Save the surface-level target (set by raycaster hit on terrain) for use at impact
    pendingImpactPos.copy(state.params.target);

    // Spawn offset so the projectile arrives at the target from the chosen azimuth
    const launchPos = new THREE.Vector3(
        state.params.target.x - vX * FLIGHT_TIME,
        SPAWN_HEIGHT,
        state.params.target.z - vZ * FLIGHT_TIME
    );
    const velocityVec = new THREE.Vector3(vX, vY, vZ);

    state.timeToImpact = FLIGHT_TIME;
    state.isProjectileInbound = true;

    const countdownBox = document.getElementById('countdown-box');
    if (countdownBox) countdownBox.style.display = 'block';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) { fireBtn.disabled = true; fireBtn.innerText = 'INBOUND...'; fireBtn.classList.remove('pulsing'); }

    const projectile = new Projectile(scene, world, state.params.mass, state.params.density);
    projectile.init(launchPos, velocityVec, state.params.mass);

    // Primary trigger: physics collision event
    projectile.body.addEventListener('collide', (e) => {
        if (e.body.mass === 0 && !projectile.shouldDestroy) handleImpact(projectile);
    });

    // Fallback trigger: fire after FLIGHT_TIME if physics tunneling prevented the collision event
    setTimeout(() => {
        if (!projectile.shouldDestroy) handleImpact(projectile);
    }, FLIGHT_TIME * 1000 + 150);

    state.projectiles.push(projectile);
}

// =============================================================
// Earth-mode fire & impact
// =============================================================

function fireEarthProjectile() {
    if (state.projectiles.length > 0) return;

    // Use the reticule-placed target (state.params.target) as the impact point.
    // In Earth mode state.params.target is set by clicking on the ground plane,
    // defaulting to (0,0,0) = tile origin if the user hasn't clicked yet.
    const impactPos = state.params.target.clone();
    impactPos.y = 0; // snap to surface
    pendingImpactPos.copy(impactPos);

    const v = state.params.velocity * 1000;
    const angleRad = state.params.angle * (Math.PI / 180);
    const vH = v * Math.cos(angleRad);
    const azimuth = Math.random() * Math.PI * 2;
    const vX = vH * Math.cos(azimuth);
    const vZ = vH * Math.sin(azimuth);
    const vY = (-SPAWN_HEIGHT + 0.5 * EARTH_GRAVITY * FLIGHT_TIME * FLIGHT_TIME) / FLIGHT_TIME;

    const launchPos = new THREE.Vector3(impactPos.x - vX * FLIGHT_TIME, SPAWN_HEIGHT, impactPos.z - vZ * FLIGHT_TIME);
    const velocityVec = new THREE.Vector3(vX, vY, vZ);

    state.timeToImpact = FLIGHT_TIME;
    state.isProjectileInbound = true;

    const countdownBox = document.getElementById('countdown-box');
    if (countdownBox) countdownBox.style.display = 'block';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) { fireBtn.disabled = true; fireBtn.innerText = 'INBOUND...'; fireBtn.classList.remove('pulsing'); }

    const projectile = new Projectile(scene, world, state.params.mass, state.params.density);
    projectile.init(launchPos, velocityVec, state.params.mass);

    projectile.body.addEventListener('collide', (e) => {
        if (e.body.mass === 0 && !projectile.shouldDestroy) handleEarthImpact(projectile);
    });
    setTimeout(() => {
        if (!projectile.shouldDestroy) handleEarthImpact(projectile);
    }, FLIGHT_TIME * 1000 + 150);

    state.projectiles.push(projectile);
}

function handleEarthImpact(projectile) {
    if (projectile.shouldDestroy) return;
    projectile.shouldDestroy = true;

    const velocity = state.params.velocity * 1000;
    const mass = projectile.body.mass;
    const energy = 0.5 * mass * velocity * velocity;

    const angleRad = state.params.angle * (Math.PI / 180);
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);
    const diameter = HOLSAPPLE_COEFF
        * Math.pow(mass, HOLSAPPLE_MASS_EXP)
        * Math.pow(velocity, HOLSAPPLE_VEL_EXP)
        * angleFactor;

    let depth;
    if (diameter <= SIMPLE_COMPLEX_THRESHOLD_M) {
        depth = diameter * PIKE_SIMPLE_DEPTH_RATIO;
    } else {
        const D_km = diameter / 1000;
        depth = PIKE_COMPLEX_COEFF * Math.pow(D_km, PIKE_COMPLEX_EXP) * 1000;
    }

    const impactPos = pendingImpactPos.clone();

    // --- Earth crater overlay mesh ---
    // We can't deform the 3D tile geometry, so we overlay a crater mesh.
    const craterRadius = diameter / 2;
    const craterSegs = 48;
    const craterGeo = new THREE.CircleGeometry(craterRadius * 1.5, craterSegs);
    craterGeo.rotateX(-Math.PI / 2); // lay flat on Y=0 plane

    // Deform vertices to create a bowl + raised rim shape
    const cPos = craterGeo.attributes.position;
    const cColors = new Float32Array(cPos.count * 3);
    for (let i = 0; i < cPos.count; i++) {
        const x = cPos.getX(i);
        const z = cPos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const normDist = dist / craterRadius;

        let y = 0;
        if (normDist < 1.0) {
            // Bowl interior — parabolic depression
            y = -depth * (1 - normDist * normDist);
            // Dark scorched colour
            const brightness = 0.15 + 0.2 * normDist;
            cColors[i * 3] = brightness * 0.8;
            cColors[i * 3 + 1] = brightness * 0.7;
            cColors[i * 3 + 2] = brightness * 0.6;
        } else if (normDist < 1.3) {
            // Raised rim
            const rimT = (normDist - 1.0) / 0.3;
            y = depth * 0.15 * Math.cos(rimT * Math.PI / 2);
            // Lighter disturbed earth
            cColors[i * 3] = 0.6;
            cColors[i * 3 + 1] = 0.55;
            cColors[i * 3 + 2] = 0.45;
        } else {
            // Ejecta blanket — fade to transparent
            const ejectaT = (normDist - 1.3) / 0.2;
            cColors[i * 3] = 0.5;
            cColors[i * 3 + 1] = 0.45;
            cColors[i * 3 + 2] = 0.35;
        }
        cPos.setY(i, y);
    }
    craterGeo.setAttribute('color', new THREE.Float32BufferAttribute(cColors, 3));
    craterGeo.computeVertexNormals();

    const craterMesh = new THREE.Mesh(craterGeo, new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        depthTest: false, // Force it to draw over the earth tiles even with negative Y
    }));
    craterMesh.position.copy(impactPos);
    craterMesh.position.y += 5; // slight offset above ground to avoid z-fighting
    craterMesh.renderOrder = 10;
    earthImpactsGroup.add(craterMesh);

    // Flash + explosion (reuse existing systems)
    impactLight.position.copy(impactPos);
    impactLight.position.y += 1000;
    const flashIntensity = Math.min(15, 3 + Math.floor(energy / 1e14));
    impactLight.intensity = flashIntensity;

    const flashSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        color: 0xffffcc, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending,
    }));
    const flashSize = Math.min(diameter * 0.8, 50000);
    flashSprite.scale.set(flashSize, flashSize, 1);
    flashSprite.position.copy(impactPos).setY(impactPos.y + 200);
    scene.add(flashSprite);

    let flashLife = 1.0;
    const fadeFlash = () => {
        flashLife -= 0.04;
        if (flashLife > 0) {
            flashSprite.material.opacity = flashLife;
            flashSprite.scale.multiplyScalar(1.03);
            impactLight.intensity = flashIntensity * flashLife;
            requestAnimationFrame(fadeFlash);
        } else {
            scene.remove(flashSprite);
            flashSprite.material.dispose();
            impactLight.intensity = 0;
        }
    };
    fadeFlash();

    explosionSystem.trigger(impactPos, Math.min(500, 100 + Math.floor(energy / 1000)), diameter);

    const shakeIntensity = Math.min(800, 100 + energy / 1e14);
    const baseCamPos = camera.position.clone();
    let shakeTime = 0;
    const shakeCamera = () => {
        shakeTime += 0.05;
        if (shakeTime < 1.0) {
            const decay = 1.0 - shakeTime;
            camera.position.x = baseCamPos.x + (Math.random() - 0.5) * shakeIntensity * decay;
            camera.position.y = baseCamPos.y + (Math.random() - 0.5) * shakeIntensity * decay * 0.5;
            requestAnimationFrame(shakeCamera);
        } else {
            camera.position.copy(baseCamPos);
        }
    };
    shakeCamera();

    soundManager.playExplosion();

    state.isProjectileInbound = false;
    const countdownBox = document.getElementById('countdown-box');
    if (countdownBox) countdownBox.style.display = 'none';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) { fireBtn.disabled = false; fireBtn.innerText = 'FIRE PROJECTILE'; fireBtn.classList.add('pulsing'); }

    // Reverse-geocode the impact point for the HUD location name, then update stats
    const { lat, lng } = state.earth.impactLocation;
    reverseGeocode(lat, lng, GOOGLE_API_KEY).then(locationName => {
        state.earth.impactLocation.name = locationName;
        updateStats(energy, diameter, depth, mass, projectile.radius * 2, locationName);
        createImpactMarker(
            earthImpactsGroup, impactPos, diameter, depth, state.impactCount,
            (pos, dia) => flyToCrater(camera, controls, pos, dia)
        );
    });
}

function handleImpact(projectile) {
    // Guard against double-fire (collision event + setTimeout fallback)
    if (projectile.shouldDestroy) return;
    projectile.shouldDestroy = true; // claim it immediately

    // Use the configured velocity for all crater physics — the Cannon body
    // velocity reflects the cinematic trajectory, not the user's setting.
    const velocity = state.params.velocity * 1000; // km/s → m/s
    const mass = projectile.body.mass;

    // Kinetic energy: E = ½mv²
    const energy = 0.5 * mass * velocity * velocity;

    // Holsapple-Schmidt crater diameter (gravity regime)
    const angleRad = state.params.angle * (Math.PI / 180);
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);
    const diameter = HOLSAPPLE_COEFF
        * Math.pow(mass, HOLSAPPLE_MASS_EXP)
        * Math.pow(velocity, HOLSAPPLE_VEL_EXP)
        * angleFactor;

    // Pike (1977) crater depth
    let depth;
    if (diameter <= SIMPLE_COMPLEX_THRESHOLD_M) {
        depth = diameter * PIKE_SIMPLE_DEPTH_RATIO;
    } else {
        const D_km = diameter / 1000;
        depth = PIKE_COMPLEX_COEFF * Math.pow(D_km, PIKE_COMPLEX_EXP) * 1000; // back to meters
    }

    // Use the surface position captured at fire time, NOT the physics body position.
    const impactPos = pendingImpactPos.clone();

    // Snap Y to the actual terrain surface via a downward raycast so that visual
    // effects (flash, explosion, labels) appear at ground level even when the
    // default target (0,0,0) doesn't match the noise-displaced terrain height.
    const surfaceRay = new THREE.Raycaster(
        new THREE.Vector3(impactPos.x, 100000, impactPos.z),
        new THREE.Vector3(0, -1, 0)
    );
    const surfaceHits = surfaceRay.intersectObject(moon.mesh);
    if (surfaceHits.length > 0) impactPos.y = surfaceHits[0].point.y;

    // Terrain deformation
    moon.addCrater(impactPos, diameter / 2, state.params.angle);

    // Impact flash light
    impactLight.position.copy(impactPos);
    impactLight.position.y += 1000;
    const flashIntensity = Math.min(15, 3 + Math.floor(energy / 1e14));
    impactLight.intensity = flashIntensity;

    // Flash sprite
    const flashSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        color: 0xffffcc, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending,
    }));
    const flashSize = Math.min(diameter * 0.8, 50000);
    flashSprite.scale.set(flashSize, flashSize, 1);
    flashSprite.position.copy(impactPos);
    flashSprite.position.y += 200;
    scene.add(flashSprite);

    let flashLife = 1.0;
    const fadeFlash = () => {
        flashLife -= 0.04;
        if (flashLife > 0) {
            flashSprite.material.opacity = flashLife;
            flashSprite.scale.multiplyScalar(1.03);
            impactLight.intensity = flashIntensity * flashLife;
            requestAnimationFrame(fadeFlash);
        } else {
            scene.remove(flashSprite);
            flashSprite.material.dispose();
            impactLight.intensity = 0;
        }
    };
    fadeFlash();

    // Particle explosion
    explosionSystem.trigger(impactPos, Math.min(500, 100 + Math.floor(energy / 1000)), diameter);

    // Camera shake
    const shakeIntensity = Math.min(800, 100 + energy / 1e14);
    const baseCamPos = camera.position.clone();
    let shakeTime = 0;
    const shakeCamera = () => {
        shakeTime += 0.05;
        if (shakeTime < 1.0) {
            const decay = 1.0 - shakeTime;
            camera.position.x = baseCamPos.x + (Math.random() - 0.5) * shakeIntensity * decay;
            camera.position.y = baseCamPos.y + (Math.random() - 0.5) * shakeIntensity * decay * 0.5;
            requestAnimationFrame(shakeCamera);
        } else {
            camera.position.copy(baseCamPos);
        }
    };
    shakeCamera();

    soundManager.playExplosion();

    // Reset inbound state
    state.isProjectileInbound = false;
    const countdownBox = document.getElementById('countdown-box');
    if (countdownBox) countdownBox.style.display = 'none';

    const fireBtn = document.getElementById('fire-btn');
    if (fireBtn) { fireBtn.disabled = false; fireBtn.innerText = 'FIRE PROJECTILE'; }

    // Update HUD and charts (also increments impactCount)
    updateStats(energy, diameter, depth, mass, projectile.radius * 2);

    // Holographic crater gauge + label
    createImpactMarker(
        moonImpactsGroup, impactPos, diameter, depth, state.impactCount,
        (pos, dia) => flyToCrater(camera, controls, pos, dia)
    );
}

// =============================================================
// UI Init
// =============================================================
initCharts();

initPointerHandlers({
    camera,
    moonMesh: moon.mesh,
    earthMesh,
    reticule,
    targetMarker,
    onEarthClick,
});

initControlBindings({
    onFire: () => {
        if (state.currentMode === 'earth') fireEarthProjectile();
        else fireProjectile();
    },
    onReset: () => location.reload(),
});

// =============================================================
// Render Loop
// =============================================================
const timeStep = 1 / 60;
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - prevTime) / 1000; // ms → seconds
    prevTime = now;

    world.step(timeStep, delta, 3);

    // Slow Earth rotation
    earthMesh.rotation.y += 0.0001 * delta;

    // Countdown timer
    if (state.isProjectileInbound && state.timeToImpact > 0) {
        state.timeToImpact = Math.max(0, state.timeToImpact - delta);
        const el = document.getElementById('time-val');
        if (el) el.innerText = state.timeToImpact.toFixed(2);
    }

    explosionSystem.update(delta);
    moon.updateDeformations(delta);

    // Stream Earth tiles when in Earth mode
    if (state.currentMode === 'earth') {
        earthTiles.update();
        // Hide loading text once the first tiles have arrived
        if (state.earth.tileset?.stats?.inFrustum > 0) {
            document.getElementById('earth-loading')?.classList.add('hidden');
        }
    }

    controls.update();

    // Update / cull projectiles
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        if (p.shouldDestroy || (!p.mesh && !p.body)) {
            p.destroy?.();
            state.projectiles.splice(i, 1);
        } else {
            p.update(delta, pendingImpactPos);
        }
    }

    // Scale reticules by camera distance so they stay readable at any zoom
    const dist = camera.position.distanceTo(reticule.position);
    const scaleFactor = Math.max(0.1, dist / 50000);
    reticule.scale.set(scaleFactor, 1, scaleFactor);
    targetMarker.scale.set(scaleFactor, 1, scaleFactor);

    composer.render();
    labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
