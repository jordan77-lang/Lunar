import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Projectile {
    constructor(scene, world, mass, density) {
        this.scene = scene;
        this.world = world;
        this.mesh = null;
        this.body = null;
        this.hasExploded = false; // Prevent multiple impacts

        // Parameters
        // Ensure mass/density are numbers
        mass = Number(mass) || 1000;
        density = Number(density) || 3000;

        this.radius = Math.pow((3 * mass) / (4 * Math.PI * density), 1 / 3); // Calculate radius from mass & density
        // Clamp scale for visualization (Planetary scale: 500m min, 10km max)
        this.visRadius = Math.max(500, Math.min(this.radius * 2, 10000));
    }

    init(position, velocity, mass) {
        // Visuals
        const geometry = new THREE.SphereGeometry(this.visRadius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/asteroid.png');

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.1,
            roughness: 0.8,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // Physics
        const shape = new CANNON.Sphere(this.visRadius);
        this.body = new CANNON.Body({
            mass: mass,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            linearDamping: 0.0, // No air resistance on Moon
            angularDamping: 0.1
        });

        this.body.velocity.copy(velocity);
        this.world.addBody(this.body);
    }

    update() {
        if (this.mesh && this.body) {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);
        }
    }

    destroy() {
        if (this.hasExploded) return;
        this.hasExploded = true;

        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
        if (this.body) {
            this.body.velocity.set(0, 0, 0); // Stop movement immediately
            this.body.angularVelocity.set(0, 0, 0);
            this.body.mass = 0; // Make static just in case
            this.world.removeBody(this.body);
            this.body = null;
        }
    }
}
