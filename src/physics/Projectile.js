import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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

        // Parameters
        mass = Number(mass) || 1000;
        this.density = Number(density) || 3000;

        this.radius = Math.pow((3 * mass) / (4 * Math.PI * this.density), 1 / 3);
        this.visRadius = Math.max(500, Math.min(this.radius * 2, 10000));
    }

    init(position, velocity, mass) {
        // Visuals — asteroid mesh
        const geometry = new THREE.SphereGeometry(this.visRadius, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/asteroid.png');

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.2,
            roughness: 0.9,
            metalness: 0.4,
            color: this.density === 8000 ? 0x888888 : (this.density === 1000 ? 0xcccccc : 0xa0a0a0),
            emissive: new THREE.Color(0xff4400), // Heated glow from solar radiation / friction
            emissiveIntensity: 0.3
        });

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

        // Trail line
        const maxTrailPoints = 40;
        const trailGeometry = new THREE.BufferGeometry();
        const trailVertices = new Float32Array(maxTrailPoints * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
        trailGeometry.setDrawRange(0, 0);

        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0xff6622,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
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

    update() {
        if (this.mesh && this.body) {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);

            // Update trail
            this.trailPositions.push(
                this.body.position.x,
                this.body.position.y,
                this.body.position.z
            );

            // Keep trail at max length
            if (this.trailPositions.length > this.maxTrailPoints * 3) {
                this.trailPositions.splice(0, 3);
            }

            const posAttr = this.trail.geometry.attributes.position;
            const arr = posAttr.array;
            const numPoints = this.trailPositions.length / 3;

            for (let i = 0; i < numPoints; i++) {
                arr[i * 3] = this.trailPositions[i * 3];
                arr[i * 3 + 1] = this.trailPositions[i * 3 + 1];
                arr[i * 3 + 2] = this.trailPositions[i * 3 + 2];
            }

            posAttr.needsUpdate = true;
            this.trail.geometry.setDrawRange(0, numPoints);
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
        if (this.body) {
            this.body.velocity.set(0, 0, 0);
            this.body.angularVelocity.set(0, 0, 0);
            this.body.mass = 0;
            this.world.removeBody(this.body);
            this.body = null;
        }
    }
}
