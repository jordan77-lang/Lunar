import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Seeded pseudo-random for reproducible per-asteroid shapes
function hash(n) { return (Math.sin(n) * 43758.5453123) % 1; }

export class Projectile {
    constructor(scene, world, mass, density) {
        this.scene = scene;
        this.world = world;
        this.mesh = null;
        this.body = null;
        this.hasExploded = false;
        this.trail = null;
        this.trailPositions = [];
        this.glowSprite = null;
        this.ablationParticles = []; // active ablation spark systems
        this._ablationTimer = 0;     // seconds since last spark spawn
        this._seed = Math.random() * 1000; // unique shape seed per asteroid

        // Parameters
        mass = Number(mass) || 1000;
        this.density = Number(density) || 3000;

        this.radius = Math.pow((3 * mass) / (4 * Math.PI * this.density), 1 / 3);
        // Visual radius = 3× physical radius so even small impactors are perceptible
        // against the 300 km terrain plane. 200 m floor for the tiniest rocks.
        // No ceiling — large impactors scale naturally with their true size.
        this.visRadius = Math.max(200, this.radius * 3);
    }

    init(position, velocity, mass) {
        // Visuals — noise-displaced asteroid mesh (no natural impactor is a sphere)
        const geometry = new THREE.SphereGeometry(this.visRadius, 32, 32);
        const posAttrGeo = geometry.attributes.position;
        const seed = this._seed;
        for (let i = 0; i < posAttrGeo.count; i++) {
            const x = posAttrGeo.getX(i);
            const y = posAttrGeo.getY(i);
            const z = posAttrGeo.getZ(i);
            // Three octaves of hash noise along each axis — creates lumpy, cratered silhouette
            const n =  hash(x * 0.00003 + seed)      * 0.10
                     + hash(y * 0.00007 + seed + 1.7) * 0.07
                     + hash(z * 0.00005 + seed + 3.3) * 0.05;
            const scale = 1.0 + n;
            posAttrGeo.setXYZ(i, x * scale, y * scale, z * scale);
        }
        geometry.computeVertexNormals();

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/asteroid.png');

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.35,
            roughness: 0.92,
            metalness: 0.3,
            color: this.density === 8000 ? 0x888888 : (this.density === 1000 ? 0xcccccc : 0xa0a0a0),
            emissive: new THREE.Color(0xff4400),
            emissiveIntensity: 0.25
        });
        this._material = material; // keep ref for update()

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // Glow sprite (soft radial halo around the asteroid)
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 128;
        glowCanvas.height = 128;
        const ctx = glowCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 100, 34, 0.8)');
        gradient.addColorStop(0.3, 'rgba(255, 80, 20, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 60, 10, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        const glowTexture = new THREE.CanvasTexture(glowCanvas);

        const glowMat = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        this.glowSprite = new THREE.Sprite(glowMat);
        const glowSize = this.visRadius * 4;
        this.glowSprite.scale.set(glowSize, glowSize, 1);
        this.mesh.add(this.glowSprite); // Parent to mesh so it follows automatically

        // Trail line — ShaderMaterial with per-vertex alpha for opacity gradient
        const maxTrailPoints = 40;
        const trailGeometry = new THREE.BufferGeometry();
        const trailVertices = new Float32Array(maxTrailPoints * 3);
        const trailAlphas   = new Float32Array(maxTrailPoints);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
        trailGeometry.setAttribute('alpha',    new THREE.BufferAttribute(trailAlphas, 1));
        trailGeometry.setDrawRange(0, 0);

        const trailMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: { value: new THREE.Color(0xff6622) } },
            vertexShader: /* glsl */`
                attribute float alpha;
                varying float vAlpha;
                void main() {
                    vAlpha = alpha;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform vec3 uColor;
                varying float vAlpha;
                void main() {
                    gl_FragColor = vec4(uColor, vAlpha);
                }
            `
        });

        this.trail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(this.trail);
        this.maxTrailPoints = maxTrailPoints;
        this.trailPositions = [];

        // Physics
        const shape = new CANNON.Sphere(this.visRadius);
        this.body = new CANNON.Body({
            mass: mass,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            linearDamping: 0.0,
            angularDamping: 0.1
        });

        // Tumble — real asteroids rotate
        this.body.angularVelocity.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
        );

        this.body.velocity.copy(velocity);
        this.world.addBody(this.body);
    }

    update(delta = 0.016, impactTarget = null) {
        if (this.mesh && this.body) {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);

            // --- Approach proximity factor (0 = far, 1 = at impact) ---
            const distToTarget = impactTarget
                ? this.body.position.distanceTo(impactTarget)
                : 50000;
            // Normalize over spawn height (50 km) — clamp to [0,1]
            const proximity = Math.max(0, Math.min(1, 1 - distToTarget / 50000));

            // --- Emissive flicker: intensifies + flickers as it approaches ---
            // Base ramps from 0.25 → 1.8; noise flicker adds ±0.3
            const flicker = (Math.random() - 0.5) * 0.6 * (0.3 + proximity);
            this._material.emissiveIntensity = 0.25 + proximity * 1.55 + flicker;

            // Glow sprite grows from 3× → 7× and shifts toward white-hot
            const glowScale = this.visRadius * (3 + proximity * 4);
            this.glowSprite.scale.set(glowScale, glowScale, 1);
            // Color: orange (far) → yellow-white (close)
            const r = 1.0;
            const g = 0.4 + proximity * 0.5;
            const b = proximity * 0.35;
            this.glowSprite.material.color.setRGB(r, g, b);
            this.glowSprite.material.opacity = 0.5 + proximity * 0.4;

            // --- Trail update ---
            this.trailPositions.push(
                this.body.position.x,
                this.body.position.y,
                this.body.position.z
            );
            if (this.trailPositions.length > this.maxTrailPoints * 3) {
                this.trailPositions.splice(0, 3);
            }

            const posAttr   = this.trail.geometry.attributes.position;
            const alphaAttr = this.trail.geometry.attributes.alpha;
            const arr = posAttr.array;
            const numPoints = this.trailPositions.length / 3;

            for (let i = 0; i < numPoints; i++) {
                arr[i * 3]     = this.trailPositions[i * 3];
                arr[i * 3 + 1] = this.trailPositions[i * 3 + 1];
                arr[i * 3 + 2] = this.trailPositions[i * 3 + 2];
                alphaAttr.array[i] = (i / Math.max(1, numPoints - 1)) * (0.6 + proximity * 0.35);
            }
            posAttr.needsUpdate   = true;
            alphaAttr.needsUpdate = true;
            this.trail.geometry.setDrawRange(0, numPoints);

            // --- Ablation sparks: shed glowing fragments during flight ---
            // Frequency ramps up as asteroid approaches (0.08s → 0.025s interval)
            const sparkInterval = 0.08 - proximity * 0.055;
            this._ablationTimer += delta;
            if (this._ablationTimer >= sparkInterval) {
                this._ablationTimer = 0;
                this._spawnAblationSpark(proximity);
            }
        }

        // Age and cull ablation sparks
        for (let i = this.ablationParticles.length - 1; i >= 0; i--) {
            const s = this.ablationParticles[i];
            s.life -= delta;
            if (s.life <= 0) {
                this.scene.remove(s.mesh);
                s.mesh.geometry.dispose();
                s.mesh.material.dispose();
                this.ablationParticles.splice(i, 1);
            } else {
                const t = s.life / s.maxLife;
                // Drift along initial velocity
                s.mesh.position.addScaledVector(s.velocity, delta);
                // Fade and shrink
                s.mesh.material.opacity = t * t;
                const sc = s.startScale * t;
                s.mesh.scale.set(sc, sc, sc);
            }
        }
    }

    _spawnAblationSpark(proximity) {
        // 1-3 sparks per event, more near impact
        const count = 1 + Math.floor(proximity * 2.5);
        for (let k = 0; k < count; k++) {
            const sparkGeo = new THREE.SphereGeometry(1, 4, 4);
            const sparkMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(1.0, 0.6 + proximity * 0.4, 0.1 + proximity * 0.3),
                transparent: true,
                opacity: 1.0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const spark = new THREE.Mesh(sparkGeo, sparkMat);

            // Position: at asteroid center + small random offset
            spark.position.copy(this.mesh.position);
            spark.position.x += (Math.random() - 0.5) * this.visRadius * 0.8;
            spark.position.y += (Math.random() - 0.5) * this.visRadius * 0.8;
            spark.position.z += (Math.random() - 0.5) * this.visRadius * 0.8;

            // Velocity: perpendicular kick away from travel direction + slight upward bias
            const speed = (800 + Math.random() * 1200) * (1 + proximity);
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * speed,
                Math.random() * speed * 0.5,
                (Math.random() - 0.5) * speed
            );

            // Scale: visual size proportional to asteroid, small sparks
            const startScale = this.visRadius * (0.08 + Math.random() * 0.12);
            spark.scale.set(startScale, startScale, startScale);

            const maxLife = 0.25 + Math.random() * 0.45;
            this.scene.add(spark);
            this.ablationParticles.push({ mesh: spark, velocity: vel, life: maxLife, maxLife, startScale });
        }
    }

    destroy() {
        if (this.hasExploded) return;
        this.hasExploded = true;

        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            if (this.glowSprite) {
                this.glowSprite.material.dispose();
            }
            this.mesh = null;
        }
        if (this.trail) {
            this.scene.remove(this.trail);
            this.trail.geometry.dispose();
            this.trail.material.dispose();
            this.trail = null;
        }
        // Clean up any lingering ablation sparks
        for (const s of this.ablationParticles) {
            this.scene.remove(s.mesh);
            s.mesh.geometry.dispose();
            s.mesh.material.dispose();
        }
        this.ablationParticles = [];
        if (this.body) {
            this.body.velocity.set(0, 0, 0);
            this.body.angularVelocity.set(0, 0, 0);
            this.body.mass = 0;
            this.world.removeBody(this.body);
            this.body = null;
        }
    }
}
