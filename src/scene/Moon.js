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
        const geometry = new THREE.PlaneGeometry(1000, 1000, 256, 256); // Higher segments for displacement later
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

        // Physics
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

        // Performance: Optimization could be done here, but linear scan is ok for 65k points occasionally.
        for (let i = 0; i < positions.count; i++) {
            v.fromBufferAttribute(positions, i);

            const dist = Math.sqrt((v.x - localPos.x) ** 2 + (v.y - localPos.y) ** 2);

            if (dist < radius) {
                // Dig down (bowl shape)
                const t = dist / radius;
                const depth = Math.cos(t * Math.PI * 0.5) * (radius * 0.5);
                v.z -= depth;
            } else if (dist < radius * 1.3) {
                // Rim: Push up
                const t = (dist - radius) / (radius * 0.3); // 0 at edge, 1 at outer rim
                const height = (1 - t) * (radius * 0.15);
                v.z += height;
            }
            // Update
            positions.setZ(i, v.z);
        }

        positions.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        // No, if the hole is deep, the decal at y=0 will float in the middle of the air!
        // Best approach for visuals: Vertex Colors!
        // We can darken the vertices in the hole.

        // Let's update material to use vertex colors.
        // this.mesh.material.vertexColors = true; // Need to set this in init

        // For now, let's keep the particle explosion for aesthetics and rely on shadow for depth.
        // We can skip the 'fake' rim mesh since we made a real rim.
        // Maybe add some 'boulder' meshes scattered around?
    }
}
