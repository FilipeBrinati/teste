import * as THREE from 'three';
import { escadaMaterial } from './Texturas.js';

class Escada {
    constructor() {

        this.alturaMaxima = 2;
        this.alturaMinima = 1;

        this.mat4 = new THREE.Matrix4();

        let v = [
            0.0, 1.0, 3,
            0.0, 1.0, -3,
            -2, 1.0, 3,
            -2, 1.0, -3,
            0.0, 0.5, 3,
            0.0, 0.5, -3]

        let f = [0, 2, 3,
            0, 1, 3,
            0, 4, 1,
            1, 5, 4
        ];

        const n = v;

        var vertices = new Float32Array(v);
        var normals = new Float32Array(n);
        var indices = new Uint32Array(f);

        let geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        this.material = escadaMaterial
        this.material.side = THREE.DoubleSide;
        this.material.flatShading = true;
        this.mesh = new THREE.Mesh(geometry, this.material);

        this.degrau0 = this.mesh;

        this.degrau = new THREE.Mesh(geometry, this.material);
        this.degrau1 = new THREE.Mesh(geometry, this.material);
        this.degrau2 = new THREE.Mesh(geometry, this.material);

        this.degrau0BB = new THREE.Box3()
        this.degrau0BB.setFromObject(this.mesh)
        this.degrau0Help = new THREE.Box3Helper(this.degrau0BB);

        this.degrau1BB = new THREE.Box3()
        this.degrau1BB.setFromObject(this.degrau)
        this.degrau1Help = new THREE.Box3Helper(this.degrau1BB);

        this.degrau2BB = new THREE.Box3()
        this.degrau2BB.setFromObject(this.degrau1)
        this.degrau2Help = new THREE.Box3Helper(this.degrau2BB);

        this.degrau3BB = new THREE.Box3()
        this.degrau3BB.setFromObject(this.degrau2)
        this.degrau3Help = new THREE.Box3Helper(this.degrau3BB);

        this.degrau4BB = new THREE.Box3()
        this.degrau4BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 6, this.mesh.position.y - 1, this.mesh.position.z), new THREE.Vector3(0.2, 4, 6))
        this.degrau4Help = new THREE.Box3Helper(this.degrau4BB);

        this.mesh.add(this.degrau)
        this.mesh.add(this.degrau1)
        this.mesh.add(this.degrau2)

        this.mesh.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        this.degrau.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        this.degrau1.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        this.degrau2.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })

        this.degrau.position.set(2, -0.5, 0)
        this.degrau1.position.set(4, -1, 0)
        this.degrau2.position.set(6, -1.5, 0)

        this.parede1 = new THREE.Object3D();
        this.parede1.userData.bb = new THREE.Box3()
        this.parede1.userData.bb.setFromCenterAndSize(this.mesh.position, new THREE.Vector3(4, 6, 1))

        this.pHelp1 = new THREE.Box3Helper(this.parede1.userData.bb);

        this.parede2 = new THREE.Object3D();
        this.parede2.userData.bb = new THREE.Box3()
        this.parede2.userData.bb.setFromCenterAndSize(this.mesh.position, new THREE.Vector3(4, 6, 1))

        this.pHelp2 = new THREE.Box3Helper(this.parede2.userData.bb);

        this.escadaBB = new THREE.Box3();
        this.escadaBBSize = new THREE.Vector3(1, 6, 4)
        this.escadaBB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 2, this.mesh.position.y + 1, this.mesh.position.z), this.escadaBBSize)
        this.escadaBB.applyMatrix4(this.mat4.makeRotationZ(THREE.MathUtils.degToRad(80)))
        //Criando BoxHelper
        this.escadaHelper = new THREE.Box3Helper(this.escadaBB);
        this.escadaHelper.applyMatrix4(this.mat4.makeRotationZ(THREE.MathUtils.degToRad(80)))

        this.mesh.receiveShadow = true
        this.mesh.castShadow = true

        this.mesh.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true
              node.receiveShadow = true
            }
        })

    }
    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z)
        this.escadaBB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 2, this.mesh.position.y, this.mesh.position.z), this.escadaBBSize)
        this.parede1.userData.bb.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 2, this.mesh.position.y + 2, this.mesh.position.z + 4), new THREE.Vector3(10, 6, 1))
        this.parede2.userData.bb.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 2, this.mesh.position.y + 2, this.mesh.position.z - 4), new THREE.Vector3(10, 6, 1))
        this.degrau1BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x - 0.5, this.mesh.position.y + 1, this.mesh.position.z), new THREE.Vector3(0.2, 7, 6))
        this.degrau2BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 2, this.mesh.position.y + 0.5, this.mesh.position.z), new THREE.Vector3(0.2, 7, 6))
        this.degrau3BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 5, this.mesh.position.y, this.mesh.position.z), new THREE.Vector3(0.2, 7, 6))
        this.degrau4BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 7, this.mesh.position.y - 1, this.mesh.position.z), new THREE.Vector3(0.2, 7, 6))
    }
    virar() {
        this.mesh.rotateY(THREE.MathUtils.degToRad(-90))
        this.parede1.userData.bb.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x + 4, this.mesh.position.y + 2, this.mesh.position.z + 2), new THREE.Vector3(1, 6, 10))
        this.parede2.userData.bb.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x - 4, this.mesh.position.y + 2, this.mesh.position.z + 2), new THREE.Vector3(1, 6, 10))
        this.degrau1BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y + 1, this.mesh.position.z - 0.5), new THREE.Vector3(6, 7, 0.2))
        this.degrau2BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z + 2), new THREE.Vector3(6, 7, 0.2))
        this.degrau3BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z + 5), new THREE.Vector3(6, 7, 0.2))
        this.degrau4BB.setFromCenterAndSize(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y - 1, this.mesh.position.z + 7), new THREE.Vector3(6, 7, 0.2))
    }
    andarEscadas(coordenada, subida, max, min, velocidade = 0.25, placeholder, placelooker, boxBB, escada0to3, directionalLight, mat4) {
        let light = directionalLight.intensity;
        let y = placeholder.getWorldPosition(new THREE.Vector3()).y
        let dir = placelooker.getWorldDirection(new THREE.Vector3())
        let verificaSubida = coordenada == "x" && subida == "-" ? dir.x < 0 :
            coordenada == "x" && subida == "+" ? dir.x > 0 :
                coordenada == "z" && subida == "-" ? dir.z < 0 :
                    coordenada == "z" && subida == "+" ? dir.z > 0 : false;

        let verificaDescida = coordenada == "x" && subida == "-" ? dir.x > 0 :
            coordenada == "x" && subida == "+" ? dir.x < 0 :
                coordenada == "z" && subida == "-" ? dir.z > 0 :
                    coordenada == "z" && subida == "+" ? dir.z < 0 : false;

        const subir = () => {
            let y = placeholder.getWorldPosition(new THREE.Vector3()).y
            boxBB.applyMatrix4(mat4.makeTranslation(0, velocidade, 0))
            placeholder.matrix.multiply(mat4.makeTranslation(0, velocidade, 0));
            if (this == escada0to3) {
                if (directionalLight.intensity <= 1) {
                    directionalLight.intensity = THREE.MathUtils.damp(light, light + 0.4, 2, 1);
                    if (directionalLight.intensity > 1.0)
                        directionalLight.intensity = 1.0;
                }
                else
                    directionalLight.intensity = 1.0;
            }
        }

        const descer = () => {
            let y = placeholder.getWorldPosition(new THREE.Vector3()).y
            boxBB.applyMatrix4(mat4.makeTranslation(0, -velocidade, 0))
            placeholder.matrix.multiply(mat4.makeTranslation(0, -velocidade, 0));
            if (this == escada0to3) {
                if (directionalLight.intensity > 0.01) {
                    directionalLight.intensity = THREE.MathUtils.damp(light, light - 0.4, 2, 1);
                    if (directionalLight.intensity < 0.01)
                        directionalLight.intensity = 0.00;
                }
                else
                    directionalLight.intensity = 0.00;
            }
        }

        if (verificaSubida) {
            if (y < max) {
                if (boxBB.intersectsBox(this.degrau4BB) && y == min) {
                    subir()
                } else if (boxBB.intersectsBox(this.degrau3BB) && y <= min + velocidade) {
                    subir()
                } else if (boxBB.intersectsBox(this.degrau2BB) && y <= min + 2 * velocidade) {
                    subir()
                } else if (boxBB.intersectsBox(this.degrau1BB) && y <= min + 3 * velocidade) {
                    subir()
                } else if (boxBB.intersectsBox(this.degrau1BB) && y < max) {
                    subir()
                }
            }
        } else if (verificaDescida) {
            if (y > min) {
                if (boxBB.intersectsBox(this.degrau1BB) && y == max) {
                    descer()
                } else if (boxBB.intersectsBox(this.degrau2BB) && y >= max - velocidade) {
                    descer()
                } else if (boxBB.intersectsBox(this.degrau3BB) && y >= max - 2 * velocidade) {
                    descer()
                } else if (boxBB.intersectsBox(this.degrau4BB) && y >= max - 3 * velocidade) {
                    descer()
                } else if (boxBB.intersectsBox(this.degrau4BB) && y > min) {
                    descer()
                }
            }
        }


    }
}

export default Escada;