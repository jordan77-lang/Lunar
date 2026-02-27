import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import * as CANNON from 'cannon-es';
import {
    COMPLEX_CRATER_RADIUS_M,
    CENTRAL_PEAK_RATIO,
    EJECTA_POWER_LAW_EXP,
    CRATER_BOWL_DEPTH_RATIO,
} from '../constants.js';

// Standard 3D noise generator
const noise3D = createNoise3D();

export class Moon {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.mesh = null;
        this.body = null;
        this.craters = [];
        this.pendingDeformations = []; // active crater formation animations

        this.init();
    }

    init() {
        // Texture Loading
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
            './textures/moon.png',
            undefined,
            undefined,
            (err) => console.error('Moon: failed to load moon.png — terrain will render grey.', err)
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);

        this.craterTexture = textureLoader.load(
            './textures/crater.png',
            undefined,
            undefined,
            (err) => console.error('Moon: failed to load crater.png — crater decals will be skipped.', err)
        );

        // Fake moon radius — large enough that the curvature horizon looks natural
        const R = 3500000;
        this.R = R;

        // ---------------------------------------------------------------
        // Single unified terrain mesh
        //
        // Previously two meshes (300 km high-res + 2000 km low-res horizon)
        // were overlaid, causing a visible seam and crater bowls exposing
        // the low-res floor. One mesh avoids both problems entirely.
        //
        // Size: 1200 km — far enough that the curvature hides the edges.
        // Segments: 512 — gives ~2.3 km vertex spacing across the full mesh,
        //   which is ~293 m inside the central 150 km (same as before) because
        //   we use the same segment count. Wait — 1200000/512 = 2344 m spacing.
        //   For craters we limit edits to the central 300 km playable zone, so
        //   the effective crater resolution is still determined by how many
        //   vertices fall within the crater radius at that spacing.
        //   A 1 km radius crater = ~0.85 vertex across — too few. So keep the
        //   playable zone at full 1024 segments on a 300 km sub-mesh, and use
        //   the large mesh only for the background horizon ring beyond 150 km.
        //
        // Architecture (revised, no seam):
        //  • playMesh  — 300 km, 1024 segs, opaque everywhere, no alpha fade
        //                rendered on top (renderOrder 1)
        //  • horizonMesh — 1200 km, 256 segs, only visible outside 140 km radius
        //                  (alpha fades IN from 140→150 km, opaque beyond)
        //                  rendered behind (renderOrder 0), sits at y = 0
        //
        // Because the playMesh is always fully opaque and rendered on top,
        // crater bowls never expose the horizon floor — the horizon mesh
        // is simply never visible through the playMesh.
        // ---------------------------------------------------------------

        // Opaque material for the playable mesh — fully writes the depth buffer
        // so the horizon mesh below can never bleed through crater bowls.
        const playMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1.0,
            metalness: 0.0,
            color: 0xcccccc,
            vertexColors: true,
            transparent: false, // opaque — correct depth writes, no sorting artifacts
        });

        // Horizon ring material — transparent for edge alpha fade, but depthWrite
        // stays ON so the mesh writes to the depth buffer and occludes stars behind it.
        const horizonMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1.0,
            metalness: 0.0,
            color: 0xcccccc,
            vertexColors: true,
            transparent: true,
            alphaTest: 0.01,
            depthWrite: true,  // write depth so stars are occluded behind the moon
        });

        // --- Horizon background mesh (3000 km, 256 segs) ---
        // Must be large enough that its curvature-dropped edges fall entirely
        // below the camera's sight line, so stars are never visible underneath.
        // R=3500000 means the mesh edge at 1500 km drops ≈ 314 m — far enough
        // below the horizon that the fade-out hides any visible boundary.
        const horizonSize = 3000000;
        const horizonSegs = 256;
        const horizonGeom = new THREE.PlaneGeometry(horizonSize, horizonSize, horizonSegs, horizonSegs);
        const hPos = horizonGeom.attributes.position;

        const hInnerR   = 130000; // transparent inside here (behind playMesh)
        const hOpaqR    = 150000; // fully opaque from here outward
        const hFadeStart = 900000; // start fading out at 900 km
        const hFadeOutR  = horizonSize / 2; // fully transparent at mesh edge
        const hColors = [];

        for (let i = 0; i < hPos.count; i++) {
            const x = hPos.getX(i);
            const y = hPos.getY(i);
            const dSq = Math.min(x * x + y * y, R * R);
            hPos.setZ(i, -(R - Math.sqrt(R * R - dSq)));

            const dist = Math.sqrt(x * x + y * y);
            let alpha;
            if (dist < hInnerR) {
                alpha = 0.0;
            } else if (dist < hOpaqR) {
                alpha = (dist - hInnerR) / (hOpaqR - hInnerR);
            } else if (dist > hFadeStart) {
                alpha = Math.max(0, 1.0 - (dist - hFadeStart) / (hFadeOutR - hFadeStart));
            } else {
                alpha = 1.0;
            }
            hColors.push(1.0, 1.0, 1.0, alpha);
        }
        horizonGeom.setAttribute('color', new THREE.Float32BufferAttribute(hColors, 4));
        horizonGeom.computeVertexNormals();

        this.horizonMesh = new THREE.Mesh(horizonGeom, horizonMat);
        this.horizonMesh.rotation.x = -Math.PI / 2;
        this.horizonMesh.receiveShadow = true;
        this.scene.add(this.horizonMesh);

        // --- Playable mesh (300 km, 1024 segs) ---
        // Opaque, no alpha fade — the depth buffer fully occludes the horizon mesh
        // everywhere the playable mesh exists, including inside crater bowls.
        this.playSize = 300000;
        this.playSegments = 1024;
        const geometry = new THREE.PlaneGeometry(this.playSize, this.playSize, this.playSegments, this.playSegments);
        const posAttr = geometry.attributes.position;
        const noiseScale = 0.00003;

        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const dSq = Math.min(x * x + y * y, R * R);
            let z = -(R - Math.sqrt(R * R - dSq));
            const n = noise3D(x * noiseScale, y * noiseScale, 0) * 400
                    + noise3D(x * noiseScale * 4, y * noiseScale * 4, 0.5) * 100;
            z += n;
            posAttr.setZ(i, z);
        }
        geometry.computeVertexNormals();

        // vertexColors RGB only — no alpha channel needed for an opaque mesh.
        const colors = new Float32Array(posAttr.count * 3);
        for (let i = 0; i < posAttr.count; i++) {
            colors[i * 3]     = 1.0;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 1.0;
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        this.mesh = new THREE.Mesh(geometry, playMat);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        // Physics ground plane
        const shape = new CANNON.Plane();
        this.body = new CANNON.Body({
            mass: 0,
            shape,
            material: new CANNON.Material({ friction: 0.5, restitution: 0.3 }),
        });
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.body);

        // Only the high-res playable mesh is deformed by craters.
        this.meshConfigs = [
            { mesh: this.mesh, size: this.playSize, segments: this.playSegments },
        ];
    }

    addCrater(position, radius, angle = 90) {
        for (const config of this.meshConfigs) {
            const anim = this._computeDeformation(config, position, radius, angle);
            if (anim) this.pendingDeformations.push(anim);
        }
        this.craters.push({ position: position.clone(), radius, angle });
    }

    // Compute target vertex positions/colors without writing to the buffer.
    // Returns an animation object for updateDeformations(), or null if nothing changed.
    _computeDeformation(config, position, radius, angle) {
        const positions = config.mesh.geometry.attributes.position;
        const colors    = config.mesh.geometry.attributes.color;
        const localPos  = config.mesh.worldToLocal(position.clone());
        const v = new THREE.Vector3();
        const c = new THREE.Color();

        const s  = config.size / config.segments;
        const s2 = config.size / 2;

        const centerCol = Math.round((localPos.x + s2) / s);
        const centerRow = Math.round((s2 - localPos.y) / s);
        const clampedCol = Math.max(0, Math.min(config.segments, centerCol));
        const clampedRow = Math.max(0, Math.min(config.segments, centerRow));
        const centerIdx  = clampedRow * (config.segments + 1) + clampedCol;
        const surfaceZ   = positions.getZ(centerIdx);

        const limit   = radius * 4.0;
        const limitSq = limit * limit;

        let colMin = Math.floor((localPos.x - limit + s2) / s);
        let colMax = Math.ceil( (localPos.x + limit + s2) / s);
        let rowMin = Math.floor((s2 - (localPos.y + limit)) / s);
        let rowMax = Math.ceil( (s2 - (localPos.y - limit)) / s);

        colMin = Math.max(0, Math.min(config.segments, colMin));
        colMax = Math.max(0, Math.min(config.segments, colMax));
        rowMin = Math.max(0, Math.min(config.segments, rowMin));
        rowMax = Math.max(0, Math.min(config.segments, rowMax));

        const deltas = []; // { index, startZ, targetZ, startC[3], targetC[3] }

        for (let row = rowMin; row <= rowMax; row++) {
            for (let col = colMin; col <= colMax; col++) {
                const i = row * (config.segments + 1) + col;

                v.fromBufferAttribute(positions, i);
                const dx = v.x - localPos.x;
                const dy = v.y - localPos.y;
                const distSq = dx * dx + dy * dy;

                if (distSq >= limitSq) continue;

                const dist = Math.sqrt(distSq);
                const startZ = v.z;
                let targetZ  = v.z;
                const startC = [colors.getX(i), colors.getY(i), colors.getZ(i)];
                let targetC  = [...startC];

                if (dist < radius) {
                    const distNorm = dist / radius;
                    const bowlDepth = CRATER_BOWL_DEPTH_RATIO * radius * (1 - distNorm * distNorm);
                    const carvedZ   = surfaceZ - bowlDepth;

                    let peakHeight = 0;
                    if (radius > COMPLEX_CRATER_RADIUS_M && dist < radius * 0.2) {
                        const peakDistNorm = dist / (radius * 0.2);
                        peakHeight = Math.cos(peakDistNorm * Math.PI / 2) * (radius * CENTRAL_PEAK_RATIO);
                    }

                    targetZ = Math.min(v.z, carvedZ + peakHeight);
                    targetC = [1.8, 1.8, 1.8];

                } else if (dist < radius * 1.3) {
                    const rimDistNorm = (dist - radius) / (radius * 0.3);
                    const height = Math.cos(rimDistNorm * Math.PI / 2) * (radius * 0.15);

                    const r_norm = dist / radius;
                    const rimThickness = radius * 0.04;
                    let ejectaThickness = Math.min(
                        rimThickness,
                        rimThickness * Math.pow(r_norm, EJECTA_POWER_LAW_EXP)
                    );

                    const rayAngle = Math.atan2(v.y - localPos.y, v.x - localPos.x);
                    let angleBias = 1.0;
                    if (angle < 45) {
                        const normalizedAngle = Math.abs(rayAngle);
                        if (normalizedAngle > Math.PI * 0.75) {
                            angleBias = 0.1;
                        } else if (normalizedAngle < Math.PI / 4) {
                            angleBias = 0.5;
                        } else {
                            angleBias = 1.8;
                        }
                    }

                    const noiseLow  = noise3D(v.x * 0.0001, v.y * 0.0001, dist * 0.0001);
                    const noiseHigh = noise3D(v.x * 0.0005, v.y * 0.0005, dist * 0.0005);
                    const fractalRays   = Math.abs(noiseLow) * 0.7 + Math.abs(noiseHigh) * 0.3;
                    const rayMultiplier = Math.max(0.1, (1.0 + fractalRays * 2.0) * angleBias);
                    ejectaThickness *= rayMultiplier;

                    targetZ = v.z + height + ejectaThickness;

                    const albedoBoost     = Math.pow(r_norm, -2.0) * rayMultiplier;
                    const brightness      = 1.0 + (albedoBoost * 0.5);
                    const finalBrightness = Math.min(2.0, brightness);
                    c.fromArray(colors.array, i * 3);
                    targetC = [c.r * finalBrightness, c.g * finalBrightness, c.b * finalBrightness];
                }

                if (targetZ !== startZ || targetC[0] !== startC[0]) {
                    deltas.push({ index: i, startZ, targetZ, startC, targetC });
                }
            }
        }

        if (deltas.length === 0) return null;

        return {
            config,
            deltas,
            progress: 0.0,
            duration: 0.75 // seconds for full crater formation
        };
    }

    // Per-frame animation tick — call from the main render loop
    updateDeformations(delta) {
        for (let i = this.pendingDeformations.length - 1; i >= 0; i--) {
            const d = this.pendingDeformations[i];
            d.progress = Math.min(1.0, d.progress + delta / d.duration);
            // Ease-out cubic: fast initial punch, smooth settle
            const t = 1.0 - Math.pow(1.0 - d.progress, 3);

            const positions = d.config.mesh.geometry.attributes.position;
            const colors    = d.config.mesh.geometry.attributes.color;

            for (const v of d.deltas) {
                positions.setZ(v.index, v.startZ + (v.targetZ - v.startZ) * t);
                colors.setXYZ(
                    v.index,
                    v.startC[0] + (v.targetC[0] - v.startC[0]) * t,
                    v.startC[1] + (v.targetC[1] - v.startC[1]) * t,
                    v.startC[2] + (v.targetC[2] - v.startC[2]) * t
                );
            }

            positions.needsUpdate = true;
            colors.needsUpdate    = true;
            d.config.mesh.geometry.computeVertexNormals();

            if (d.progress >= 1.0) {
                this.pendingDeformations.splice(i, 1);
            }
        }
    }


}
