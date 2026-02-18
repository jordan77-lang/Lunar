import * as THREE from 'three';
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
        texture.repeat.set(10, 10);

        this.craterTexture = textureLoader.load('./textures/crater.png');

        // Visuals
        // Planetary Scale: 400km x 400km
        // Increased resolution to 1024x1024 for better small crater definition
        const geometry = new THREE.PlaneGeometry(400000, 400000, 1024, 1024);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8,
            metalness: 0.1,
            // displacementMap: heightMap // Optional for later
        });

        this.mesh = new THREE.Mesh(geometry, material);
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
    }

    addCrater(position, radius) {
        // 1. Deform the Mesh (Real Depth)
        const localPos = this.mesh.worldToLocal(position.clone());
        const positions = this.mesh.geometry.attributes.position;
        const v = new THREE.Vector3();

        // Performance Optimization: 1024x1024 is 1M vertices.
        // Use bounding box check to skip distant vertices.
        const limit = radius * 1.4; // Slightly larger than rim (1.3)

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            // Fast Bounding Box Check relating to local crater center
            if (Math.abs(x - localPos.x) > limit || Math.abs(y - localPos.y) > limit) continue;

            v.fromBufferAttribute(positions, i);

            const dist = Math.sqrt((x - localPos.x) ** 2 + (y - localPos.y) ** 2);

            if (dist < radius) {
                // Dig down (bowl shape)
                // Enhanced visual depth for "crater" look (not just dent)
                const t = dist / radius;
                const depth = Math.cos(t * Math.PI * 0.5) * (radius * 0.8); // 0.8 depth ratio
                v.z -= depth;

                // Central Peak for Complex Craters (Diameter > 15km)
                // Threshold: Radius > 7500m
                if (radius > 7500) {
                    const peakRadius = radius * 0.25; // Broad peak
                    if (dist < peakRadius) {
                        // Uplift
                        const tp = dist / peakRadius;
                        // Boosted Uplift to ensure visibility: 0.4 * Radius
                        const uplift = (1 - tp) * (radius * 0.4);
                        v.z += uplift; // UP (Local +Z is World +Y)
                    }
                }

            } else if (dist < radius * 1.3) {
                // Rim: Push up
                // Sharper, higher rim
                const t = (dist - radius) / (radius * 0.3); // 0 at edge, 1 at outer rim
                const height = (1 - t) * (radius * 0.25); // Increased height to 0.25
                v.z += height;
            }
            // Update
            positions.setZ(i, v.z);
        }

        positions.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
    }
}
