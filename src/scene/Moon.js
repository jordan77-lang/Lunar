import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Standard 3D noise generator
const noise3D = createNoise3D();
import * as CANNON from 'cannon-es';

export class Moon {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.mesh = null;
        this.body = null;
        this.craters = [];

        this.init();
    }

    init() {
        // Texture Loading
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/moon.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20); // Increase tiling to make the base texture look finer

        this.craterTexture = textureLoader.load('./textures/crater.png');

        // Visuals
        const R = 3500000; // Fake larger radius (real is 1737400)
        this.R = R; // Store for crater reference

        // --- 1. Horizon Mesh (Massive, Low-Res, Faded Edges) ---
        const horizonSize = 2000000;
        const horizonGeom = new THREE.PlaneGeometry(horizonSize, horizonSize, 128, 128);
        const hPosAttr = horizonGeom.attributes.position;
        for (let i = 0; i < hPosAttr.count; i++) {
            const x = hPosAttr.getX(i);
            const y = hPosAttr.getY(i);
            const dSq = Math.min(x * x + y * y, R * R);
            hPosAttr.setZ(i, -(R - Math.sqrt(R * R - dSq)));
        }
        horizonGeom.computeVertexNormals();

        const hColors = [];
        const R_plane = horizonSize / 2;
        const fadeStart = 700000;
        for (let i = 0; i < hPosAttr.count; i++) {
            const x = hPosAttr.getX(i);
            const y = hPosAttr.getY(i);
            const dist = Math.sqrt(x * x + y * y);
            let alpha = 1.0;
            if (dist > fadeStart) {
                alpha = Math.max(0, 1.0 - ((dist - fadeStart) / (R_plane - fadeStart)));
            }
            hColors.push(1.0, 1.0, 1.0, alpha);
        }
        horizonGeom.setAttribute('color', new THREE.Float32BufferAttribute(hColors, 4));

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1.0, // Maximum roughness for dry powdery dust
            metalness: 0.0,
            color: 0xcccccc, // Bright gray/white base color
            vertexColors: true,
            transparent: true,
            alphaTest: 0.01
        });

        this.horizonMesh = new THREE.Mesh(horizonGeom, material);
        this.horizonMesh.rotation.x = -Math.PI / 2;
        this.horizonMesh.position.y = -1; // Drop slightly to prevent Z-fighting
        this.horizonMesh.receiveShadow = true;
        this.scene.add(this.horizonMesh);

        // --- 2. Playable Area Mesh (300km, High-Res, Opaque Center) ---
        this.playSize = 300000; // 300km 
        this.playSegments = 1024;
        const geometry = new THREE.PlaneGeometry(this.playSize, this.playSize, this.playSegments, this.playSegments);
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const dSq = Math.min(x * x + y * y, R * R);
            let z = -(R - Math.sqrt(R * R - dSq));

            // Add subtle terrain noise — rolling hills and micro-craters
            const noiseScale = 0.00003;
            const n = noise3D(x * noiseScale, y * noiseScale, 0) * 400
                + noise3D(x * noiseScale * 4, y * noiseScale * 4, 0.5) * 100;
            z += n;

            posAttr.setZ(i, z);
        }
        geometry.computeVertexNormals();

        const colors = [];
        const playR = this.playSize / 2;
        const playFade = playR - 5000; // Fade out the last 5km perfectly into horizon
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const dist = Math.sqrt(x * x + y * y);
            let alpha = 1.0;
            if (dist > playFade) {
                alpha = Math.max(0, 1.0 - ((dist - playFade) / (playR - playFade)));
            }
            colors.push(1.0, 1.0, 1.0, alpha);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

        this.mesh = new THREE.Mesh(geometry, material); // Share transparent material
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        // Physics (Ground Plane is infinite in Cannon, but let's visually match)
        const shape = new CANNON.Plane();
        this.body = new CANNON.Body({
            mass: 0, // Static
            shape: shape,
            material: new CANNON.Material({ friction: 0.5, restitution: 0.3 })
        });
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.body);

        // Store configs for seamless dual-deformation
        this.meshConfigs = [
            { mesh: this.mesh, size: this.playSize, segments: this.playSegments },
            { mesh: this.horizonMesh, size: horizonSize, segments: 128 }
        ];
    }

    addCrater(position, radius, angle = 90) {
        // Apply the exact same deformation mathematically to both LOD meshes
        for (const config of this.meshConfigs) {
            this._applyDeformationToMesh(config, position, radius, angle);
        }
        this.craters.push({ position: position.clone(), radius, angle });
    }


    _applyDeformationToMesh(config, position, radius, angle = 90) {
        const localPos = config.mesh.worldToLocal(position.clone());
        const positions = config.mesh.geometry.attributes.position;
        const colors = config.mesh.geometry.attributes.color;
        const v = new THREE.Vector3();
        const c = new THREE.Color();
        const R = this.R; // Reference sphere radius

        // Limit for geometry search 
        const limit = radius * 4.0; // Reach much further for ejecta rays
        const limitSq = limit * limit;

        // Optimization: localized grid iteration instead of all vertices
        const s = config.size / config.segments;
        const s2 = config.size / 2;

        let colMin = Math.floor((localPos.x - limit + s2) / s);
        let colMax = Math.ceil((localPos.x + limit + s2) / s);
        let rowMin = Math.floor((s2 - (localPos.y + limit)) / s); // y decreases with row
        let rowMax = Math.ceil((s2 - (localPos.y - limit)) / s);

        colMin = Math.max(0, Math.min(config.segments, colMin));
        colMax = Math.max(0, Math.min(config.segments, colMax));
        rowMin = Math.max(0, Math.min(config.segments, rowMin));
        rowMax = Math.max(0, Math.min(config.segments, rowMax));

        for (let row = rowMin; row <= rowMax; row++) {
            for (let col = colMin; col <= colMax; col++) {
                const i = row * (config.segments + 1) + col;

                v.fromBufferAttribute(positions, i);
                const x = v.x;
                const y = v.y;

                const dx = x - localPos.x;
                const dy = y - localPos.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < limitSq) {
                    const dist = Math.sqrt(distSq);

                    // Deform geometry
                    if (dist < radius) {
                        const depthPerc = 1 - (dist / radius);

                        // We must ignore the current v.z (which includes noise or other craters)
                        // and dig relative to the mathematical reference sphere surface at this point.
                        const dSq = Math.min(x * x + y * y, R * R);
                        const baseZ = -(R - Math.sqrt(R * R - dSq));

                        // Calculate how deep this point is in the bowl
                        const bowlDepth = radius * 0.2 * depthPerc;

                        // Start with the base sphere and dig down
                        let newZ = baseZ - bowlDepth;

                        // Complex Craters (> 15km / 15000m diameter -> >7500m radius) have central peaks
                        if (radius > 7500 && dist < radius * 0.2) {
                            // Use smooth half-cosine to make a rounded peak instead of a sharp linear cone
                            const peakDistNorm = dist / (radius * 0.2); // 0 at center, 1 at edge of peak
                            const peakHeight = radius * 0.08; // Peak is 8% of radius high
                            newZ += Math.cos(peakDistNorm * Math.PI / 2) * peakHeight;
                        }

                        // If the current terrain is ALREADY lower than our new crater floor,
                        // leave it alone (e.g., overlapping a deeper, older crater).
                        // Otherwise, override the terrain with our smooth crater floor.
                        if (newZ < v.z) {
                            v.z = newZ;
                        }

                        // Brighten interior significantly so it's visible even on dark maria
                        c.setRGB(1.8, 1.8, 1.8);
                        colors.setXYZW(i, c.r, c.g, c.b, colors.getW(i));

                    } else if (dist < radius * 1.3) {
                        // Rim: Push up (Smooth Sine curve)
                        const t = (dist - radius) / (radius * 0.3); // 0 at inner rim edge, 1 at outer rim edge
                        const height = Math.cos(t * Math.PI / 2) * (radius * 0.15); // Rounded rim

                        // Only add height to the existing terrain (preserves noise on the rim)
                        v.z += height;

                        // Lighten Rim slightly
                        c.setRGB(1.2, 1.2, 1.2);
                        colors.setXYZW(i, c.r, c.g, c.b, colors.getW(i));
                        // Ejecta Blanket (Scientific Power-Law Decay)
                        // Thickness of ejecta t(r) roughly follows t_rim * (r/R_rim)^-3.0
                        const r_norm = dist / radius; // Distance normalized to crater radius (1.0 at rim)
                        // Calculate base ejecta thickness based on distance
                        let ejectaThickness = (radius * 0.05) * Math.pow(r_norm, -3.0);

                        // Procedural Ray / Texture Generation
                        const rayAngle = Math.atan2(y - localPos.y, x - localPos.x); // from -PI to +PI

                        // --- PHYSICS: ANGLE DEPENDENT EJECTA (Butterfly Lobes) ---
                        // Calculate angle bias (1.0 = normal, 0.0 = completely suppressed)
                        let angleBias = 1.0;
                        if (angle < 45) {
                            // Map rayAngle so 0 is uprange, PI is downrange
                            // (We assume the projectile travels along the local positive X axis for this math)
                            const normalizedAngle = Math.abs(rayAngle); // 0 to PI

                            // Creates a "forbidden zone" arc behind the crater where no ejecta falls
                            if (normalizedAngle > Math.PI * 0.75) {
                                // Uprange forbidden zone (Backwards)
                                angleBias = 0.1; // Greatly suppressed
                            } else if (normalizedAngle < Math.PI / 4) {
                                // Downrange (Forward)
                                angleBias = 0.5; // Slightly suppressed, most mass goes sideways
                            } else {
                                // Lateral lobes (The "butterfly wings" sticking out the sides)
                                angleBias = 1.8; // Much thicker
                            }
                        }

                        // --- PHYSICS: ORGANIC SIMPLEX NOISE RAYS ---
                        // Mix organic Simplex noise across 3D space rather than 2D sine waves
                        // The third dimension allows the noise to change organically based on distance

                        // Low frequency noise for large asymmetrical chunks
                        const noiseLow = noise3D(x * 0.0001, y * 0.0001, dist * 0.0001);
                        // High frequency noise for sharp streaks
                        const noiseHigh = noise3D(x * 0.0005, y * 0.0005, dist * 0.0005);

                        // Combine into a fractal ray pattern (normalized mostly 0 to 1)
                        // Absolute value creates sharp "ridges" suitable for ejecta streaks
                        const fractalRays = Math.abs(noiseLow) * 0.7 + Math.abs(noiseHigh) * 0.3;

                        // Modulate thickness by the fractal noise AND the impact angle bias
                        const rayMultiplier = Math.max(0.1, (1.0 + fractalRays * 2.0) * angleBias);
                        ejectaThickness *= rayMultiplier;

                        // Add high-frequency chaotic scatter (boulders/blocks) near the rim
                        if (r_norm < 2.0 && Math.random() > 0.85) {
                            const maxBoulderSize = Math.min(60, radius * 0.015); // Cap boulder size
                            // Boulders respect butterfly pattern
                            ejectaThickness += Math.random() * maxBoulderSize * Math.pow(r_norm, -4.0) * angleBias;
                        }

                        v.z += ejectaThickness;

                        // Ejecta Brightening (also power law)
                        // Fresh ejecta is bright due to unweathered subsurface material
                        const albedoBoost = Math.pow(r_norm, -2.0) * rayMultiplier;
                        const brightness = 1.0 + (albedoBoost * 0.5); // Lowered baseline boost

                        // Clamp brightness to prevent HDR blowout but keep rays visible
                        const finalBrightness = Math.min(2.0, brightness);

                        // Get existing color, lighten it
                        c.fromArray(colors.array, i * 4);
                        c.r = c.r * finalBrightness;
                        c.g = c.g * finalBrightness;
                        c.b = c.b * finalBrightness;
                        colors.setXYZW(i, c.r, c.g, c.b, colors.getW(i));
                    }

                    // Update Positions
                    positions.setXYZ(i, v.x, v.y, v.z);
                }
            }
        }

        positions.needsUpdate = true;
        colors.needsUpdate = true;
        config.mesh.geometry.computeVertexNormals(); // Recompute shading for hole
    }
}
