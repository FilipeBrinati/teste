import * as THREE from 'three';

class Piso {
    constructor(planeSize, position, boxes, scene, minX, maxX, minZ, maxZ) {

        this.PlaneGeometry = new THREE.PlaneGeometry(planeSize, planeSize, minX, maxX, minZ, maxZ);
        this.planeMaterial = new THREE.MeshLambertMaterial({ color: "rgb(243,220,184)", side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(this.PlaneGeometry, this.planeMaterial);
        this.plane.receiveShadow = true;
        this.plane.position.set(position.x, position.y, position.z);
        this.plane.rotateX(THREE.MathUtils.degToRad(-90));
        scene.add(this.plane)

        var startGrid = new THREE.GridHelper(planeSize + 2, planeSize / 2 + 1, "black", "black");
        startGrid.rotateX(THREE.MathUtils.degToRad(90));
        startGrid.translateY(0.01);
        this.plane.add(startGrid);

        let perMaterial = new THREE.MeshLambertMaterial({ color: "rgb(75,40,0)", side: THREE.DoubleSide });
        let perimeterGeometry = new THREE.BoxGeometry(1.99, 1.99, 1.99);

        for (let i = minX; i <= maxX; i++) {
            for (let j = minZ; j <= maxZ; j++) {
                if ((i == minX || j == minZ) && (j != 0 && j != 1 && j != -1) && (i != 0 && i != 1 && i != -1)) {
                    let perimeterCube = new THREE.Mesh(perimeterGeometry, perMaterial);
                    perimeterCube.castShadow = true;
                    perimeterCube.position.set((i * 2), position.y + 1, (j * 2));
                    let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                    boxBB.setFromObject(perimeterCube);
                    perimeterCube.userData.bb = boxBB;
                    boxes.push(perimeterCube);
                    scene.add(perimeterCube);
                }
                if ((i == maxX || j == maxZ) && (j != 0 && j != 1 && j != -1) && (i != 0 && i != 1 && i != -1)) {
                    let perimeterCube = new THREE.Mesh(perimeterGeometry, perMaterial);
                    perimeterCube.castShadow = true;
                    perimeterCube.position.set((i * 2), position.y + 1, (j * 2));
                    let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                    boxBB.setFromObject(perimeterCube);
                    perimeterCube.userData.bb = boxBB;
                    boxes.push(perimeterCube);
                    scene.add(perimeterCube);
                }
            }

        }

    }

}

export default Piso;