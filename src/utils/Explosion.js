
import * as THREE from 'three';

export class Explosion {
    constructor(scene) {
        this.scene = scene;
        this.systems = [];
        this.texture = new THREE.TextureLoader().load('./textures/smoke.png');
    }

    trigger(position, count = 150, craterDiameter = 5000) {
        // --- Phase 1: Ejecta Curtain (fast, incandescent → grey) ---
        this._spawnEjecta(position, count, craterDiameter);

        // --- Phase 2: Dust Plume (slow, expanding, volumetric) ---
        this._spawnDustPlume(position, Math.floor(count * 0.4), craterDiameter);

        // --- Phase 3: Radial Ray Burst (brief starburst lines) ---
        this._spawnRayBurst(position, craterDiameter);

        // --- Phase 4: Seismic Shockwave Ring (expands at ~3 km/s) ---
        this._spawnShockwave(position, craterDiameter);
    }

    _spawnEjecta(position, count, craterDiameter) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const colors = [];

        for (let i = 0; i < count; i++) {
            positions.push(position.x, position.y, position.z);

            // Conical spray — mostly vertical with lateral spread
            const speed = (Math.random() * 20 + 5) * (craterDiameter / 5000);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI / 3; // Narrower cone than hemisphere

            const vX = speed * Math.sin(phi) * Math.cos(theta);
            const vY = speed * Math.cos(phi) * 1.5; // Bias upward
            const vZ = speed * Math.sin(phi) * Math.sin(theta);

            velocities.push(vX, vY, vZ);

            // Start incandescent (hot yellow-white)
            const heat = 0.5 + Math.random() * 0.5;
            colors.push(1.0, 0.85 * heat, 0.3 * heat);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: Math.min(1500, craterDiameter * 0.15),
            map: this.texture,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        points.renderOrder = 9999;
        this.scene.add(points);

        this.systems.push({
            mesh: points,
            velocities: velocities,
            life: 2.5,
            maxLife: 2.5,
            type: 'ejecta'
        });
    }

    _spawnDustPlume(position, count, craterDiameter) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < count; i++) {
            // Start slightly offset from center
            const ox = (Math.random() - 0.5) * craterDiameter * 0.3;
            const oz = (Math.random() - 0.5) * craterDiameter * 0.3;
            positions.push(position.x + ox, position.y + 100, position.z + oz);

            // Slow expanding hemisphere
            const speed = (Math.random() * 3 + 1) * (craterDiameter / 5000);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI / 2;

            velocities.push(
                speed * Math.sin(phi) * Math.cos(theta),
                speed * Math.cos(phi) * 0.5, // Mostly horizontal spread
                speed * Math.sin(phi) * Math.sin(theta)
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x888888,
            size: Math.min(3000, craterDiameter * 0.3),
            map: this.texture,
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.NormalBlending
        });

        const points = new THREE.Points(geometry, material);
        points.renderOrder = 9999;
        this.scene.add(points);

        this.systems.push({
            mesh: points,
            velocities: velocities,
            life: 5.0,
            maxLife: 5.0,
            type: 'dust'
        });
    }

    _spawnRayBurst(position, craterDiameter) {
        const rayCount = 10;
        const points = [];
        const rayLength = craterDiameter * 0.6;

        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + Math.random() * 0.3;
            const len = rayLength * (0.5 + Math.random() * 0.5);

            points.push(
                new THREE.Vector3(position.x, position.y + 300, position.z),
                new THREE.Vector3(
                    position.x + Math.cos(angle) * len,
                    position.y + 300 + Math.random() * len * 0.3,
                    position.z + Math.sin(angle) * len
                )
            );
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xffcc44,
            transparent: true,
            opacity: 0.8,
            linewidth: 2,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        const lines = new THREE.LineSegments(geometry, material);
        lines.renderOrder = 9999;
        this.scene.add(lines);

        this.systems.push({
            mesh: lines,
            velocities: null,
            life: 0.5,
            maxLife: 0.5,
            type: 'rays'
        });
    }

    _spawnShockwave(position, craterDiameter) {
        // Ring built at unit radius (1 m) — scale drives expansion each frame.
        // Thickness is ~3% of starting diameter so it stays a crisp line.
        const startRadius = Math.max(500, craterDiameter * 0.5);
        const thickness = Math.max(50, craterDiameter * 0.015);
        const geometry = new THREE.RingGeometry(1 - thickness / startRadius, 1, 128);

        const material = new THREE.MeshBasicMaterial({
            color: 0xfff0cc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        const ring = new THREE.Mesh(geometry, material);
        // Lay flat on the lunar surface (ring geometry faces +Z by default)
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(position);
        ring.position.y += 80; // slight lift to avoid z-fighting with terrain
        ring.scale.setScalar(startRadius);
        ring.renderOrder = 9999;
        this.scene.add(ring);

        this.systems.push({
            mesh: ring,
            velocities: null,
            life: 3.0,
            maxLife: 3.0,
            type: 'shockwave',
            startRadius,
            speed: 3000 // m/s — seismic/ejecta curtain front speed
        });
    }

    update(delta) {
        for (let i = this.systems.length - 1; i >= 0; i--) {
            const s = this.systems[i];
            s.life -= delta;

            if (s.life <= 0) {
                this.scene.remove(s.mesh);
                s.mesh.geometry.dispose();
                s.mesh.material.dispose();
                this.systems.splice(i, 1);
                continue;
            }

            const lifeRatio = s.life / s.maxLife; // 1 → 0

            if (s.type === 'ejecta') {
                const positions = s.mesh.geometry.attributes.position.array;
                const colors = s.mesh.geometry.attributes.color.array;

                for (let j = 0; j < s.velocities.length / 3; j++) {
                    // Gravity only (no drag — Moon has no atmosphere)
                    s.velocities[j * 3 + 1] -= 1.62 * delta;

                    positions[j * 3] += s.velocities[j * 3] * delta;
                    positions[j * 3 + 1] += s.velocities[j * 3 + 1] * delta;
                    positions[j * 3 + 2] += s.velocities[j * 3 + 2] * delta;

                    // Floor collision
                    if (positions[j * 3 + 1] < 0) {
                        positions[j * 3 + 1] = 0;
                        s.velocities[j * 3 + 1] *= -0.2;
                        s.velocities[j * 3] *= 0.5;
                        s.velocities[j * 3 + 2] *= 0.5;
                    }

                    // Color shift: incandescent → grey regolith
                    const cooldown = Math.max(0, lifeRatio - 0.3);
                    colors[j * 3] = cooldown * 1.0 + (1 - cooldown) * 0.45;
                    colors[j * 3 + 1] = cooldown * 0.7 + (1 - cooldown) * 0.42;
                    colors[j * 3 + 2] = cooldown * 0.2 + (1 - cooldown) * 0.40;
                }

                s.mesh.geometry.attributes.position.needsUpdate = true;
                s.mesh.geometry.attributes.color.needsUpdate = true;
                s.mesh.material.opacity = Math.max(0, lifeRatio);

            } else if (s.type === 'dust') {
                const positions = s.mesh.geometry.attributes.position.array;

                for (let j = 0; j < s.velocities.length / 3; j++) {
                    // Very slow gravity
                    s.velocities[j * 3 + 1] -= 0.3 * delta;

                    positions[j * 3] += s.velocities[j * 3] * delta;
                    positions[j * 3 + 1] += s.velocities[j * 3 + 1] * delta;
                    positions[j * 3 + 2] += s.velocities[j * 3 + 2] * delta;

                    if (positions[j * 3 + 1] < 0) {
                        positions[j * 3 + 1] = 0;
                        s.velocities[j * 3 + 1] = 0;
                    }
                }

                s.mesh.geometry.attributes.position.needsUpdate = true;
                // Dust fades slowly
                s.mesh.material.opacity = Math.max(0, 0.3 * lifeRatio);

            } else if (s.type === 'rays') {
                // Just fade out
                s.mesh.material.opacity = Math.max(0, lifeRatio * 0.8);

            } else if (s.type === 'shockwave') {
                // Expand outward at s.speed m/s, fade as it grows
                const elapsed = 1.0 - lifeRatio; // 0 → 1
                const currentRadius = s.startRadius + s.speed * elapsed;
                s.mesh.scale.setScalar(currentRadius);
                // Ease-out fade: sharp initial pulse, gentle tail-off
                s.mesh.material.opacity = Math.max(0, lifeRatio * lifeRatio * 0.85);
            }
        }
    }
}
