
import * as THREE from 'three';

export class Explosion {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.texture = new THREE.TextureLoader().load('./textures/smoke.png');
    }

    trigger(position, count = 100, color = 0xffaa00) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const sizes = [];
        const angles = [];

        for (let i = 0; i < count; i++) {
            positions.push(position.x, position.y, position.z);

            // Random velocity spray
            const speed = Math.random() * 15 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI / 2; // Upper hemisphere

            const vX = speed * Math.sin(phi) * Math.cos(theta);
            const vY = speed * Math.cos(phi);
            const vZ = speed * Math.sin(phi) * Math.sin(theta);

            velocities.push(vX, vY, vZ);
            sizes.push(Math.random() * 2 + 1);
            angles.push(Math.random() * 360);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // We can't per-particle size easily with standard PointsMaterial without shaders or attribute `size`.
        // Three.js PointsMaterial size is uniform.
        // To vary size, we just rely on perspective or use multiple systems?
        // Actually, let's keep it simple with uniform size but fade opacity.

        const material = new THREE.PointsMaterial({
            color: color,
            size: 2,
            map: this.texture,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);

        this.particles.push({
            mesh: points,
            velocities: velocities,
            life: 2.0 // Longer life
        });
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= delta;

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
                continue;
            }

            // Update positions
            const positions = p.mesh.geometry.attributes.position.array;
            for (let j = 0; j < p.velocities.length / 3; j++) {
                // Gravity
                p.velocities[j * 3 + 1] -= 1.62 * delta; // Moon gravity

                // Drag
                p.velocities[j * 3] *= 0.98;
                p.velocities[j * 3 + 1] *= 0.98;
                p.velocities[j * 3 + 2] *= 0.98;

                positions[j * 3] += p.velocities[j * 3] * delta;
                positions[j * 3 + 1] += p.velocities[j * 3 + 1] * delta;
                positions[j * 3 + 2] += p.velocities[j * 3 + 2] * delta;

                // Floor collision (simple)
                if (positions[j * 3 + 1] < 0) {
                    positions[j * 3 + 1] = 0;
                    p.velocities[j * 3 + 1] *= -0.3; // Low bounce
                    p.velocities[j * 3] *= 0.8; // Friction
                    p.velocities[j * 3 + 2] *= 0.8;
                }
            }
            p.mesh.geometry.attributes.position.needsUpdate = true;

            // Fade out
            p.mesh.material.opacity = Math.max(0, p.life / 2.0);

            // Color shift from Orange/White to Grey?
            // PointsMaterial has one global color. 
            // We can interact with .color property.
            // If life < 1.0, turn grey.
            if (p.life < 1.0) {
                p.mesh.material.color.setHex(0xaaaaaa);
            }
        }
    }
}
