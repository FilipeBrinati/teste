import * as THREE from 'three';

class Interruptor {
    constructor(posLuz, posInt, posTarget, scene) {

        this.interruptorGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.6);
        this.interruptorMaterial = new THREE.MeshLambertMaterial({ color: "rgb(255,255,0)", side: THREE.DoubleSide });
        this.interruptor = new THREE.Mesh(this.interruptorGeometry, this.interruptorMaterial);
        this.interruptor.material.emissive.set("rgb(255,255,0)");
        this.interruptor.position.set(posInt)
        scene.add(this.interruptor)

        this.spotLight = new THREE.SpotLight("rgb(255,255,255)");
        this.spotLight.position.copy(posLuz);
        this.spotLight.distance = 0;
        this.spotLight.castShadow = true;
        this.spotLight.decay = 2;
        this.spotLight.penumbra = 0.5;
        // Shadow Parameters
        this.spotLight.shadow.mapSize.width = 512;
        this.spotLight.shadow.mapSize.height = 512;
        this.spotLight.angle = THREE.MathUtils.degToRad(40);
        this.spotLight.shadow.camera.fov = 40;
        this.spotLight.shadow.camera.near = .2;
        this.spotLight.shadow.camera.far = 20.0;

        this.spotLight.castShadow = true

        this.spotLight.intensity = 5;

        console.log(this.spotLight.intensity)

        this.auxTarget = new THREE.Object3D()
        this.auxTarget.position.set(posTarget)
        this.spotLight.target = this.auxTarget;

        this.spotLight.target = this.auxTarget

        this.spotLight.target.updateMatrixWorld();
        this.spotLight.shadow.camera.updateProjectionMatrix();    


    }

}

export default Interruptor