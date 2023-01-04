import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { keyboardUpdate } from './Teclas.js';
import { Area2Material, Area3Material, Area4Material, Parede1Material, Parede2Material, Parede3Material, ParedeMaterial, portalMaterial, StartAreaMaterial, tabuaMaterial, underMaterial } from './Texturas.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ,
  createGroundPlaneWired,
  createGroundPlane, radiansToDegrees
} from "../libs/util/util.js";
import { MathUtils, MeshLambertMaterial } from '../build/three.module.js';
import { Vector2 } from 'three';
import { Box3, Vector3 } from '../build/three.module.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../build/jsm/loaders/OBJLoader.js';
import Stats from '../build/jsm/libs/stats.module.js';
import Escada from './Escada.js';
import { CSG } from '../libs/other/CSGMesh.js'
import { FontLoader } from '../build/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../build/jsm/geometries/TextGeometry.js';
import GUI from '../libs/util/dat.gui.module.js';
var stats = new Stats();
var clock = new THREE.Clock();

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer

export var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  progressBar.style.width = (loaded / total * 100) + '%';
  progressBar.textContent = Math.floor((loaded / total * 100)) + '%';
};

manager.onLoad = () => {
  progress.remove();
  let btn = document.getElementById('start-button');
  btn.setAttribute('style', 'display: block;');
  btn.addEventListener('click', function () {
    document.getElementById('back-loading').remove();
  });
}

let loader = new GLTFLoader(manager);

for (let i = 0; i < 8; i++) {

  loader.load('./assets/hex_cube.glb', function (gltf) {
    var obj = gltf.scene;
    obj.castShadow = true;
    obj.scale.set(1, 1, 1)

    obj.castShadow = true;
    obj.position.set(0,0,0);
    scene.add(obj)
    obj.position.set(31 + Math.random() * 18, 2, 5 + -Math.random() * 10);
    obj.position.divideScalar(2).floor().multiplyScalar(2)
    if (planeSize % 2 !== 0) {
      obj.position.addScalar(1.5)
    }
    obj.position.y = -1
    obj.userData.area = 1
    obj.userData.name = "box";
    let BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    BB.setFromObject(obj);
    obj.userData.bb = BB;
    obj.userData.id = i;
    boxes.push(obj);

    obj.traverse((node) => {
      if (node.isMesh)
        node.castShadow = true
      node.userData.pai = obj;
      node.userData.name = "box";
    })

  }, onProgress, onError);

}

let chaves = [];
let doors = [];
let boxes = [];

// --------------- Sons do jogo ------------------------

var somChave = new Audio('SomChave.wav');
var somPorta = new Audio('SomPorta.wav');
var somPonte = new Audio('SomPonte.wav');
var somPlataforma = new Audio('SomPlataforma.wav');
var somFim = new Audio('SomFim.wav');
var bGM = new Audio('night-city-knight-127028.mp3');
bGM.volume = 0.05;

let canPlayP1 = true // variaveis de funções auxiliares
let canPlayP2 = true
let canPlayP3 = true
let canPlayP4 = true
let canPlayP5 = true

let canPlayD1 = true;
let canPlayD2 = true;
let canPlayD3 = true;

let canPlayEnd = true;


function playEndGame()
{
  if(doors[2].userData.open == 1 && canPlayEnd)
  {
    somFim.play();
    canPlayEnd = false
  }
}

function playBackground()
{
 bGM.play();
}

function soundAux()
{

  if(canPlayP1 && press1Down)
  {
    somPlataforma.play();
    canPlayP1 = false;
  }
  if(canPlayP2 && press2Down)
  {
    somPlataforma.play();
    canPlayP2 = false;
  }
  if(canPlayP3 && press3Down)
  {
    somPlataforma.play();
    canPlayP3 = false;
  }
  if(canPlayP4 && press4Down)
  {
    somPlataforma.play();
    canPlayP4 = false;
  }
  if(canPlayP5 && press5Down)
  {
    somPlataforma.play();
    canPlayP5 = false;
  }
  
  if(doors[0].userData.open == 1 && canPlayD1)
  {
    somPorta.play();
    canPlayD1 = false;
  }
  if(doors[1].userData.open == 1 && canPlayD2)
  {
    somPorta.play();
    canPlayD2 = false;
  }
  if(doors[2].userData.open == 1 && canPlayD3)
  {
    somPorta.play();
    canPlayD3 = false;
  }
}


// ------------------ Sons do jogo fim ---------------------


//criando as chaves - START --------------------------------------------------------------------------------------------
let keyId = 1;
let keyBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
let keyMaterial = new THREE.MeshLambertMaterial({
  color: "blue"
});

//making the key format
let circle = new THREE.Shape();
circle.absarc(0.0, 0.0, 0.3, 0, Math.PI * 2);

let hole = new THREE.Shape();
hole.absarc(0.0, 0.0, 0.29, 0, Math.PI * 2);
circle.holes.push(hole);

let geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
let cylinder = new THREE.Mesh(geometry, keyMaterial);
cylinder.rotation.z = Math.PI / 2;
let keyBoxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
let teeth = new THREE.Mesh(keyBoxGeometry, keyMaterial);

//adjust positions
teeth.translateX(-0.2);
teeth.translateY(-0.3);
cylinder.add(teeth);

cylinder.rotation.z = Math.PI / 2;
cylinder.translateY(-0.7);
cylinder.translateZ(0.05);

let extrudeSettings = { depth: 0.1 };
let geo = new THREE.ExtrudeGeometry(circle, extrudeSettings);
let key = new THREE.Mesh(geo, keyMaterial);
key.castShadow = true;
key.add(cylinder);

key.position.set(80, -1, 0); //att de acordo com a posição das chaves
key.userData.name = "key" + keyId;
key.userData.pick = 0;
keyBB.setFromObject(key);
key.userData.bb = keyBB;

chaves.push(key);
scene.add(key);
keyId++;

let keyBB2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
keyMaterial = new THREE.MeshLambertMaterial({
  color: "red"
});
geo = new THREE.ExtrudeGeometry(circle, extrudeSettings);
key = new THREE.Mesh(geo, keyMaterial);
key.castShadow = true;
teeth = new THREE.Mesh(keyBoxGeometry, keyMaterial);
cylinder = new THREE.Mesh(geometry, keyMaterial);

teeth.translateX(-0.2);
teeth.translateY(-0.3);
cylinder.add(teeth);

cylinder.rotation.z = Math.PI / 2;
cylinder.translateY(-0.7);
cylinder.translateZ(0.05);
key.add(cylinder);

key.position.set(-75, 3, 0); //att de acordo com a posição das chaves
key.userData.name = "key" + keyId;
key.userData.pick = 0;
keyBB2.setFromObject(key);
key.userData.bb = keyBB2;

chaves.push(key);
scene.add(key);
key++;

let keyBB3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
keyMaterial = new THREE.MeshLambertMaterial({
  color: "yellow"
});
geo = new THREE.ExtrudeGeometry(circle, extrudeSettings);
key = new THREE.Mesh(geo, keyMaterial);
key.castShadow = true;
teeth = new THREE.Mesh(keyBoxGeometry, keyMaterial);
cylinder = new THREE.Mesh(geometry, keyMaterial);
key.material.emissive.set("rgb(255,255,0)")

teeth.translateX(-0.2);
teeth.translateY(-0.3);
cylinder.add(teeth);

cylinder.rotation.z = Math.PI / 2;
cylinder.translateY(-0.7);
cylinder.translateZ(0.05);
key.add(cylinder);

key.position.set(0, -1, 75); //att de acordo com a posição das chaves
key.userData.name = "key" + keyId;
key.userData.pick = 0;
keyBB3.setFromObject(key);
key.userData.bb = keyBB3;

chaves.push(key);
scene.add(key);

//criando as chaves - END --------------------------------------------------------------------------------------------

//criando arcos - START ----------------------------------------------------------------------------------------------

let cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 10.1, 8)
);
let sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3.15, 20, 20)
);
let innerCubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(2.1, 8, 5.9)
);

sphereMesh.position.set(0, 1, 0);
sphereMesh.matrixAutoUpdate = false;
sphereMesh.updateMatrix();

innerCubeMesh.position.set(0, -3, 0);
innerCubeMesh.matrixAutoUpdate = false;
innerCubeMesh.updateMatrix();

let sphereCSG = CSG.fromMesh(sphereMesh);
let cubeCSG = CSG.fromMesh(cubeMesh);
let innerCubeCSG = CSG.fromMesh(innerCubeMesh);
let csgObject = cubeCSG.subtract(sphereCSG);
csgObject = csgObject.subtract(innerCubeCSG);

for (let i = 0, x = 20, y = 5, yy = y; i < 2; i++, x = x + 10, y = y - 2, yy = yy + 2) {
  let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4())
  csgFinal.material = portalMaterial
  csgFinal.position.set(-x, yy, 0);
  scene.add(csgFinal);

  csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4())
  csgFinal.material = portalMaterial
  csgFinal.position.set(x, y, 0);
  scene.add(csgFinal);

  csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4())
  csgFinal.material = portalMaterial
  csgFinal.position.set(0, y, x);
  csgFinal.rotateY(MathUtils.degToRad(-90));
  scene.add(csgFinal);

  csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4())
  csgFinal.material = portalMaterial
  csgFinal.position.set(0, yy, -x);
  csgFinal.rotateY(MathUtils.degToRad(-90));
  scene.add(csgFinal);
}

//criando arcos - END ------------------------------------------------------------------------------------------------

//criando portas - START ---------------------------------------------------------------------------------------------

let doorId = 1
let doorBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

let doorGeometry = new THREE.BoxGeometry(2, 10, 6);
let doorMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
let door = new THREE.Mesh(doorGeometry, doorMaterial);

door.position.set(-20, 5, 0); //att de acordo com a posição das portas
door.userData.name = "door" + doorId;
door.userData.open = 0;
doorBB.setFromObject(door);
door.userData.bb = doorBB;
doors.push(door);
scene.add(door);
doorId++;

let doorBB1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
doorGeometry = new THREE.BoxGeometry(6, 10, 2);
doorMaterial = new THREE.MeshLambertMaterial({ color: "red" });
door = new THREE.Mesh(doorGeometry, doorMaterial);

door.position.set(0, 5, 20); //att de acordo com a posição das portas
door.userData.name = "door" + doorId;
door.userData.open = 0;
doorBB1.setFromObject(door);
door.userData.bb = doorBB1;
doors.push(door);
scene.add(door);
doorId++;

let doorBB2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
doorGeometry = new THREE.BoxGeometry(6, 10, 2);
doorMaterial = new THREE.MeshLambertMaterial({ color: "yellow" });
door = new THREE.Mesh(doorGeometry, doorMaterial);

door.position.set(0, 5, -20); //att de acordo com a posição das portas
door.userData.name = "door" + doorId;
door.userData.open = 0;
doorBB2.setFromObject(door);
door.userData.bb = doorBB2;
doors.push(door);
scene.add(door);
doorId++;

let doorBB3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
doorGeometry = new THREE.BoxGeometry(6, 4, 2);
doorMaterial = new THREE.MeshLambertMaterial({ color: "red" });
let doorArea3 = new THREE.Mesh(doorGeometry, doorMaterial);

doorArea3.position.set(0, -2, 70); //att de acordo com a posição das portas
doorArea3.userData.name = "door" + doorId;
doorArea3.userData.open = 0;
doorBB3.setFromObject(doorArea3);
doorArea3.userData.bb = doorBB3;
boxes.push(doorArea3)
scene.add(doorArea3);
doorId++;

let doorBB4 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
doorGeometry = new THREE.BoxGeometry(2, 4, 6);
doorMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
let doorArea4 = new THREE.Mesh(doorGeometry, doorMaterial);

doorArea4.position.set(-70, 2, 0); //att de acordo com a posição das portas
doorArea4.userData.name = "door" + doorId;
doorArea4.userData.open = 0;
doorBB4.setFromObject(doorArea4);
doorArea4.userData.bb = doorBB4;
boxes.push(doorArea4)
scene.add(doorArea4);

//criando portas - END ---------------------------------------------------------------------------------------------
let loaderFont = new FontLoader();
let textMesh;
loaderFont.load('fonts/Star_Jedi_Regular.json', function (font) {
  let geometryText = new TextGeometry('Congrats', {
    font: font,
    size: 1,
    height: 0.5
  });
  textMesh = new THREE.Mesh(geometryText, [
    new THREE.MeshBasicMaterial({ color: 'blue' }),
    new THREE.MeshBasicMaterial({ color: 'red' })
  ]);

  scene.add(textMesh);
  textMesh.position.set(-4, 5, -40);
});

//end cenario

//Create camera ------------------------------------------------------------------------------------------------
let camPos = new THREE.Vector3(9, 12, 9);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0); //posicionar onde o jogador começar
let projectionControle = false;

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setFromSphericalCoords(
  18,
  Math.PI / 4,
  Math.PI / 4
);
camera.up.copy(camUp);
camera.lookAt(scene.position);



material = setDefaultMaterial(); // create a basic material
//light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

//animation

var mixer = new Array();
var playAction = true;

//Criar parecidos para mais animações,
//Deve ter uma forma mais eficiente para caso de diferentes animações.
loadGLTFFile('../assets/objects/walkingMan.glb');

function loadGLTFFile(modelName) {
  loader.load(modelName, function (gltf) {
    var obj = gltf.scene;
    obj.castShadow = true;

    placelooker.add(obj);

    obj.traverse((node) => {
      if (node.isMesh)
        node.castShadow = true
    })

    var mixerLocal = new THREE.AnimationMixer(obj);
    mixerLocal.clipAction(gltf.animations[0]).play();
    mixer.push(mixerLocal);
  }, onProgress, onError);
}

function onError() { };

function onProgress(xhr, model) {
  if (xhr.lengthComputable) {
    console.log(xhr.loaded / xhr.total * 100);
  }
}

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

let keyboard = new KeyboardState();


///////// START AREA END /////////////
let planeSize = 40;
let startPlaneGeometry = new THREE.PlaneGeometry(planeSize + 2, planeSize + 2);
let planeMaterial1 = new THREE.MeshLambertMaterial({ color: "rgba(243,220,184)", side: THREE.DoubleSide });
let startPlane = new THREE.Mesh(startPlaneGeometry, StartAreaMaterial);
startPlane.geometry.attributes.uv2 = startPlane.geometry.attributes.uv;
startPlane.receiveShadow = true;
startPlane.position.set(0, 0, 0);
startPlane.rotateX(MathUtils.degToRad(-90));
scene.add(startPlane);

//create underplane of different color
let underplaneGeometry = new THREE.BoxGeometry(planeSize + 200, 0.1, planeSize + 200); //planos ficam invisíveis por alguma rasão
let underplaneMaterial = new THREE.MeshLambertMaterial({ color: "rgba(243,220,184)", side: THREE.DoubleSide });;
let startUnderplane = new THREE.Mesh(underplaneGeometry, underMaterial);
startUnderplane.translateY(-4);
startUnderplane.receiveShadow = true;
scene.add(startUnderplane);

// create perimeter boxes
let minX = -(planeSize / 4);
let maxX = (planeSize / 4);
let minZ = -(planeSize / 4);
let maxZ = (planeSize / 4);

let perMaterial = ParedeMaterial;
let perimeterGeometry = new THREE.BoxGeometry(2, 2, 2, 30, 30, 30);

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (j != 0 && j != 1 && j != -1) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, ParedeMaterial);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (j != 0 && j != 1 && j != -1) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, ParedeMaterial);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

///////// START AREA END /////////////

///////// END AREA START ///////////

let endAreaPlaneGeometry = new THREE.PlaneGeometry(10, 10);
let startPlaneMaterial2 = StartAreaMaterial.clone()
startPlaneMaterial2.map = StartAreaMaterial.map.clone()
startPlaneMaterial2.map.repeat.set(2.5, 2.5)
startPlaneMaterial2.map.offset.set(0.5, 0.5)
let endAreaPlane = new THREE.Mesh(endAreaPlaneGeometry, startPlaneMaterial2);
endAreaPlane.receiveShadow = true;
endAreaPlane.position.set(0, 2, -34);
endAreaPlane.rotateX(MathUtils.degToRad(-90));
scene.add(endAreaPlane);

minX = -2;
maxX = 2;
minZ = -19;
maxZ = -15;

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, ParedeMaterial);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, ParedeMaterial);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}


///////// END AREA END /////////////

///////// AREA 1 START /////////////

let area1PlaneGeometry = new THREE.PlaneGeometry(planeSize + 2, planeSize + 2);
let planeMaterial2 = new THREE.MeshLambertMaterial({ color: "rgb(243,220,184)", side: THREE.DoubleSide });
let area1Plane = new THREE.Mesh(area1PlaneGeometry, Area2Material);
area1Plane.receiveShadow = true;
area1Plane.position.set(50, -2, 0);
area1Plane.rotateX(MathUtils.degToRad(-90));
scene.add(area1Plane);


// create perimeter boxes
minX = -(planeSize / 4) + 25;
maxX = (planeSize / 4) + 25;
minZ = -(planeSize / 4);
maxZ = (planeSize / 4);

let escada0to1 = new Escada();
boxes.push(escada0to1.parede1)
boxes.push(escada0to1.parede2)
escada0to1.setPosition(23, -1, 0)
scene.add(escada0to1.mesh)


//coordenda = "x"||"z" .//subida = "-" || "+

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede1Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede1Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

let box;
let posBox = new THREE.Vector3();
const objLoader = new OBJLoader();

let cont = 0
let cont2 = 0
let colisores = []

////////////////COLISAO PONTE

let colPonte = new THREE.Box3();
colPonte.setFromCenterAndSize(new THREE.Vector3(71, 0, 2), new THREE.Vector3(0.05, 4, 2))
let auxObj1 = new THREE.Object3D();
auxObj1.userData.bb = colPonte
boxes.push(auxObj1)
let colisaoPonteH = new THREE.Box3Helper(colPonte)


let colPonte2 = new THREE.Box3();
colPonte2.setFromCenterAndSize(new THREE.Vector3(77, 0, 2), new THREE.Vector3(0.05, 4, 2))
let auxObj2 = new THREE.Object3D();
auxObj2.userData.bb = colPonte2
boxes.push(auxObj2)
let colisaoPonte2H = new THREE.Box3Helper(colPonte2)

let colPonte3 = new THREE.Box3();
colPonte3.setFromCenterAndSize(new THREE.Vector3(77, 0, 0), new THREE.Vector3(0.05, 4, 2))
let auxObj3 = new THREE.Object3D();
auxObj3.userData.bb = colPonte3
boxes.push(auxObj3)
let colisaoPonte3H = new THREE.Box3Helper(colPonte3)

let colPonte4 = new THREE.Box3();
colPonte4.setFromCenterAndSize(new THREE.Vector3(77, 0, -2), new THREE.Vector3(0.05, 4, 2))
let auxObj4 = new THREE.Object3D();
auxObj4.userData.bb = colPonte4
boxes.push(auxObj4)
let colisaoPonte4H = new THREE.Box3Helper(colPonte4)


for (let i = 0; i < 6; i++) {

  let colisaoPonte = new THREE.Box3();
  let colisaoPonte2 = new THREE.Box3();
  if (i % 2 == 0) {
    cont2++
    cont = 0;
  }
  colisaoPonte.setFromCenterAndSize(new THREE.Vector3(69 + 2 * cont2, 0, -2 + cont * 2), new THREE.Vector3(0.05, 4, 2))
  colisaoPonte2.setFromCenterAndSize(new THREE.Vector3(70 + 2 * cont2, 0, -1 + cont * 2), new THREE.Vector3(2, 4, 0.05))
  let auxObj1 = new THREE.Object3D();
  let auxObj2 = new THREE.Object3D();
  auxObj1.userData.bb = colisaoPonte
  auxObj2.userData.bb = colisaoPonte2
  colisores.push(auxObj1)
  colisores.push(auxObj2)
  boxes.push(auxObj1)
  boxes.push(auxObj2)
  let colisaoPonteH = new THREE.Box3Helper(colisaoPonte)
  let colisaoPonte2H = new THREE.Box3Helper(colisaoPonte2)
  cont++;

}

let colocarPonte = new THREE.Box3()
colocarPonte.setFromCenterAndSize(new THREE.Vector3(70, -1, 0), new THREE.Vector3(9, 1, 9))
let colocar = new THREE.Box3Helper(colocarPonte)

//////////////

// BLUE KEY AREA START //

let bluePlaneGeometry = new THREE.PlaneGeometry(10, 10);
let bluePlaneMaterial2 = Area2Material.clone()
bluePlaneMaterial2.map = Area2Material.map.clone()
bluePlaneMaterial2.map.repeat.set(5, 5)
let blueKeyPlane = new THREE.Mesh(bluePlaneGeometry, bluePlaneMaterial2);
blueKeyPlane.receiveShadow = true;
blueKeyPlane.position.set(82, -2, 0);
blueKeyPlane.rotateX(MathUtils.degToRad(-90));
scene.add(blueKeyPlane);


minX = -(planeSize / 4) + 46;
maxX = minX + 6;
minZ = -2;
maxZ = 2;

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede1Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede1Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

// BLUE KEY AREA END //

///////// AREA 1 END /////////////

///////// AREA 2 START /////////////

let area2PlaneGeometry = new THREE.PlaneGeometry(planeSize + 2, planeSize + 2);
let planeMaterial3 = new THREE.MeshLambertMaterial({ color: "rgb(243,220,184)", side: THREE.DoubleSide });
let area2Plane = new THREE.Mesh(area2PlaneGeometry, Area3Material);
area2Plane.receiveShadow = true;
area2Plane.position.set(-50, 2, 0);
area2Plane.rotateX(MathUtils.degToRad(-90));
scene.add(area2Plane);

// create perimeter boxes
minX = -(planeSize / 4) - 25;
maxX = (planeSize / 4) - 25;
minZ = -(planeSize / 4);
maxZ = (planeSize / 4);

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede2Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede2Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

for (let i = 0; i < 8; i++) {

  loader.load('./assets/wooden_box_low_poly.glb', function (gltf) {
    var obj = gltf.scene;
    obj.castShadow = true;
    obj.scale.set(3.5, 3.5, 3.5)

    obj.castShadow = true;
    obj.position.set(0,0,0);
    scene.add(obj)
    obj.position.set(-31 - Math.random() * 18, -1, 5 + Math.random() * 10);
    obj.position.divideScalar(2).floor().multiplyScalar(2)
    if (planeSize % 2 !== 0) {
      obj.position.addScalar(1.5)
    }
    obj.position.y = 3
    obj.userData.area = 2
    obj.userData.name = "box";
    let BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    BB.setFromObject(obj);
    obj.userData.bb = BB;
    obj.userData.id = i;
    boxes.push(obj);

    obj.traverse((node) => {
      if (node.isMesh)
        node.castShadow = true
      node.userData.pai = obj;
      node.userData.name = "box";
    })

  }, onProgress, onError);


}

let pressureMaterial = setDefaultMaterial("green");
let pressureplate1 = new THREE.Mesh(perimeterGeometry, pressureMaterial);
pressureplate1.position.set(-60, 1.4, 0);
let plate1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
plate1BB.setFromObject(pressureplate1);
pressureplate1.userData.bb = plate1BB;
scene.add(pressureplate1);
let pressureplate2 = new THREE.Mesh(perimeterGeometry, pressureMaterial);
pressureplate2.position.set(-60, 1.4, 6);
let plate2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
plate2BB.setFromObject(pressureplate2);
pressureplate2.userData.bb = plate2BB;
scene.add(pressureplate2);
let pressureplate3 = new THREE.Mesh(perimeterGeometry, pressureMaterial);
pressureplate3.position.set(-60, 1.4, -6);
let plate3BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
plate3BB.setFromObject(pressureplate3);
pressureplate3.userData.bb = plate3BB;
scene.add(pressureplate3);

let press1Down = false;
let press2Down = false;
let press3Down = false;


let escada0to2 = new Escada();
boxes.push(escada0to2.parede1)
boxes.push(escada0to2.parede2)
escada0to2.setPosition(-27, 1, 0)
scene.add(escada0to2.mesh)

// RED AREA START //

let redPlaneGeometry = new THREE.PlaneGeometry(10, 10);
let redPlaneMaterial2 = Area3Material.clone()
redPlaneMaterial2.map = Area3Material.map.clone()
redPlaneMaterial2.map.repeat.set(5, 5)
let redKeyPlane = new THREE.Mesh(redPlaneGeometry, redPlaneMaterial2);
redKeyPlane.receiveShadow = true;
redKeyPlane.position.set(-76, 2, 0);
redKeyPlane.rotateX(MathUtils.degToRad(-90));
scene.add(redKeyPlane);

minX = -(planeSize / 4) - 30;
maxX = minX + 4;
minZ = -2;
maxZ = 2;

// LAMPADAS

for (let i = 0; i < 2; i++) {

  loader.load('./assets/oxidised_marble_cube.glb', function (gltf) {
    var obj = gltf.scene;
    obj.castShadow = true;
    obj.scale.set(0.0018, 0.0018, 0.0018)

    obj.castShadow = true;
    obj.position.set(0,0,0);
    scene.add(obj)
    if (i == 0){
      obj.position.set(-16, -1, 45);
    }else
      obj.position.set(16, -1, 65);
    obj.position.divideScalar(2).floor().multiplyScalar(2)
    if (planeSize % 2 !== 0) {
      obj.position.addScalar(1.5)
    }
    obj.position.y = -1
    obj.userData.area = 3
    obj.userData.name = "box";
    let BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    BB.setFromObject(obj);
    obj.userData.bb = BB;
    obj.userData.id = i;
    boxes.push(obj);

    obj.traverse((node) => {
      if (node.isMesh)
        node.castShadow = true
      node.userData.pai = obj;
      node.userData.name = "box";
    })

  }, onProgress, onError);


}

let pressureMateria4 = setDefaultMaterial("green");
let pressureplate4 = new THREE.Mesh(perimeterGeometry, pressureMateria4);
pressureplate4.position.set(16, -2.8, 44);
pressureplate4.y = -1
let plate4BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
plate4BB.setFromObject(pressureplate4);
pressureplate4.userData.bb = plate4BB;
scene.add(pressureplate4);
console.log(pressureplate4.position)

let pressureMateria5 = setDefaultMaterial("green");
let pressureplate5 = new THREE.Mesh(perimeterGeometry, pressureMaterial);
pressureplate5.position.set(-16, -2.8, 54);
console.log(pressureplate5.position)
let plate5BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
plate5BB.setFromObject(pressureplate5);
pressureplate5.userData.bb = plate5BB;
scene.add(pressureplate5);

let press4Down = false;
let press5Down = false;

let interruptor;
let spotLight;
let interruptores = [];
let spotLights = [];

let contZ = 0;
for (let i = 0; i < 8; i++) {
  let posI = -18.8;
  let posTL = -16
  if (i > 3) {
    posI = 18.8
    posTL = 16
  }
  if (i == 4)
    contZ = 0
  let interruptorGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.6);
  let interruptorMaterial = new THREE.MeshLambertMaterial({ color: "rgb(255,255,0)", side: THREE.DoubleSide });
  interruptor = new THREE.Mesh(interruptorGeometry, interruptorMaterial);
  interruptor.material.emissive.set("rgb(255,255,0)");
  interruptor.position.set(posI, -1, 35 + contZ * 10)
  scene.add(interruptor)

  console.log(interruptor.position)

  interruptores.push(interruptor)

  let boxTargetGeometry = new THREE.BoxGeometry(1, 1, 1);
  let boxTargetMaterial = new THREE.MeshLambertMaterial({ color: "rgb(75,40,0)", side: THREE.DoubleSide });
  let boxTarget = new THREE.Mesh(boxTargetGeometry, boxTargetMaterial);
  boxTarget.position.set(posTL, -3, 35 + contZ * 10)

  let lightPosition = new THREE.Vector3(posTL, 4, 35 + contZ * 10);

  spotLight = new THREE.SpotLight("rgb(255,255,255)");
  spotLight.position.copy(lightPosition);
  spotLight.distance = 0;
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  // Shadow Parameters
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = THREE.MathUtils.degToRad(40);
  spotLight.shadow.camera.fov = radiansToDegrees(spotLight.angle);
  spotLight.shadow.camera.near = .2;
  spotLight.shadow.camera.far = 20.0;

  spotLight.intensity = 0;

  scene.add(spotLight);

  spotLight.target = boxTarget

  spotLight.target.updateMatrixWorld();
  spotLight.shadow.camera.updateProjectionMatrix();

  spotLights.push(spotLight)
  contZ++;
}



for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede2Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (j != 0 && j != 1 && j != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede2Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), 3, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

// RED AREA END //

///////// AREA 2 END /////////////

///////// AREA 3 START /////////////

let area3PlaneGeometry = new THREE.PlaneGeometry(planeSize + 2, planeSize + 2);
let planeMaterial4 = new THREE.MeshLambertMaterial({ color: "rgb(243,220,184)", side: THREE.DoubleSide });
let area3Plane = new THREE.Mesh(area3PlaneGeometry, Area4Material);
area3Plane.receiveShadow = true;
area3Plane.position.set(0, -2, 50);
area3Plane.rotateX(MathUtils.degToRad(-90));
scene.add(area3Plane);

// create perimeter boxes
minX = -(planeSize / 4);
maxX = (planeSize / 4);
minZ = -(planeSize / 4) + 25;
maxZ = (planeSize / 4) + 25;

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede3Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede3Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

let escada0to3 = new Escada(-90);
boxes.push(escada0to3.parede1)
boxes.push(escada0to3.parede2)
escada0to3.setPosition(0, -1, 23, THREE.MathUtils.degToRad(-90))
scene.add(escada0to3.mesh)
escada0to3.virar()


// GREEN AREA START //

let greenPlaneGeometry = new THREE.PlaneGeometry(10, 10);
let greenPlaneMaterial2 = new THREE.MeshLambertMaterial({ color: "rgb(243,220,184)", side: THREE.DoubleSide });
let greenKeyPlane = new THREE.Mesh(greenPlaneGeometry, greenPlaneMaterial2);
greenKeyPlane.receiveShadow = true;
greenKeyPlane.position.set(0, -2, 74);
greenKeyPlane.rotateX(MathUtils.degToRad(-90));
scene.add(greenKeyPlane);

minX = -2;
maxX = 2;
minZ = (planeSize / 4) + 26;
maxZ = minZ + 4;

for (let i = minX; i <= maxX; i++) {
  for (let j = minZ; j <= maxZ; j++) {
    if ((i == minX || j == minZ) && (i != 0 && i != 1 && i != -1)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede3Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
    if ((i == maxX || j == maxZ)) {
      let perimeterCube = new THREE.Mesh(perimeterGeometry, Parede3Material);
      perimeterCube.castShadow = true;
      perimeterCube.position.set((i * 2), -1, (j * 2));
      let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      boxBB.setFromObject(perimeterCube);
      perimeterCube.userData.bb = boxBB;
      boxes.push(perimeterCube);
      scene.add(perimeterCube);
    }
  }

}

// GREEN AREA END //

///////// AREA 3 END/////////////

let escada0to4 = new Escada(-90);
boxes.push(escada0to4.parede1)
boxes.push(escada0to4.parede2)
escada0to4.setPosition(0, 1, -27, THREE.MathUtils.degToRad(-90))
scene.add(escada0to4.mesh)
escada0to4.virar()

// create a cube
let placeholderGeometry = new THREE.BoxGeometry(0, 0, 0);

let placeholder = new THREE.Mesh(placeholderGeometry, material);
// position the cube
placeholder.position.set(0.0, 0, 0.0);
// add the cube to the scene
scene.add(placeholder);

let placelookerGeometry = new THREE.BoxGeometry(0, 0, 0)

let placelooker = new THREE.Mesh(placelookerGeometry, material);

placelooker.position.set(0, 0.25, 0);
placeholder.add(placelooker);
placeholder.add(camera);

placelooker.matrixAutoUpdate = false;
placeholder.matrixAutoUpdate = false;
var mat4 = new THREE.Matrix4();
placeholder.matrix.identity();
let angle = 0;

function rotateTo(targetAngle, object) {
  if (angle >= 360) {
    angle = angle - 360;
  }
  if (angle <= 0) {
    angle = 360 + angle;
  }
  if (angle == targetAngle) {
    // Do nothing
  }
  else if (Math.abs(targetAngle - angle) <= Math.abs(angle + (360 - targetAngle)) && Math.abs(targetAngle - angle) <= Math.abs(targetAngle + (360 - angle))) {
    if (targetAngle - angle > 0) {
      object.matrix.multiply(mat4.makeRotationY(THREE.MathUtils.degToRad(Math.abs(angle - targetAngle) * 0.1)));
      angle += Math.abs(angle - targetAngle) * 0.1;
    }
    if (targetAngle - angle < 0) {
      object.matrix.multiply(mat4.makeRotationY(THREE.MathUtils.degToRad(-Math.abs(angle - targetAngle) * 0.1)));
      angle -= Math.abs(angle - targetAngle) * 0.1;
    }
  }
  else {
    if (Math.abs(angle + (360 - targetAngle)) <= Math.abs(targetAngle + (360 - angle))) {
      object.matrix.multiply(mat4.makeRotationY(THREE.MathUtils.degToRad(-Math.abs(angle + (360 - targetAngle))) * 0.1));
      angle -= Math.abs((angle + (360 - targetAngle))) * 0.1;
    }
    if (targetAngle - angle < 0) {
      object.matrix.multiply(mat4.makeRotationY(THREE.MathUtils.degToRad(Math.abs(targetAngle + (360 - angle)) * 0.1)));
      angle += Math.abs(targetAngle + (360 - angle)) * 0.1;
    }
  }

}

function movimentoLateral(x, z) {
  boxBB.applyMatrix4(mat4.makeTranslation(x, 0, 0))
  if (!checkColision()) { placeholder.matrix.multiply(mat4.makeTranslation(x, 0, 0)); directionalLight.position.set(directionalLight.position.x + x, camera.position.y + 3, directionalLight.position.z); } else { boxBB.applyMatrix4(mat4.makeTranslation(-x, 0, 0)) }
  boxBB.applyMatrix4(mat4.makeTranslation(0, 0, z))
  if (!checkColision()) { placeholder.matrix.multiply(mat4.makeTranslation(0, 0, z)); directionalLight.position.set(directionalLight.position.x, camera.position.y + 3, directionalLight.position.z + z) } else { boxBB.applyMatrix4(mat4.makeTranslation(0, 0, -z)) }

}

//Constante para armazenar posição do mouse na tela
const mouse = new THREE.Vector2();
let colidiu = false;

let selectedBox = null
let notSelected = null
//Criando objeto raycaster
const raycaster = new THREE.Raycaster();

function seguraBloco() {

  if (selectedBox) {
    if (selectedBox == notSelected)
      notSelected = null
    placelooker.add(selectedBox)
    selectedBox.position.set(placeholder.position.x, placeholder.position.y + 2, placeholder.position.z + 3)
    selectedBox.userData.bb.makeEmpty()
  }

}

//Muda a caixa de cor ao clicar
//Muda a caixa de cor ao clicar
window.addEventListener('click', (event) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0 && intersects[0].object.userData.name === "selectedBox" &&
    placeholder.getWorldPosition(new THREE.Vector3()).distanceTo(intersects[0].object.getWorldPosition(new THREE.Vector3())) < 6) {

    intersects[0].object.userData.pai.traverse((node) => {
      if (node.isMesh) {
        node.material.emissive.set(0x000);
      }
    })
    intersects[0].object.userData.pai.userData.name = "box"
    intersects[0].object.userData.name = "box"

    console.log(selectedBox.getWorldPosition(posBox))
    let matrix = new THREE.Matrix4().copy(selectedBox.matrixWorld);
    selectedBox.removeFromParent()
    scene.add(selectedBox)
    selectedBox.position.set(posBox.x, posBox.y, posBox.z)
    posBox = new THREE.Vector3(posBox.x, 0, posBox.z)
    console.log(selectedBox.position)

    notSelected = selectedBox

    add = 0

    posBox.divideScalar(2).floor().multiplyScalar(2)
    if (planeSize % 2 !== 0) {
      posBox.addScalar(1.5)
    }

    console.log(pressureplate1.position.distanceTo(posBox))

    if (pressureplate1.position.distanceTo(posBox) < 4 && !press1Down)
      posBox.set(pressureplate1.position.x, pressureplate1.position.y + 2, pressureplate1.position.z)
    else if (pressureplate2.position.distanceTo(posBox) < 4 && !press2Down)
      posBox.set(pressureplate2.position.x, pressureplate2.position.y + 2, pressureplate2.position.z)
    else if (pressureplate3.position.distanceTo(posBox) < 4 && !press3Down)
      posBox.set(pressureplate3.position.x, pressureplate3.position.y + 2, pressureplate3.position.z)
    else if (pressureplate4.position.distanceTo(posBox) < 4 && !press4Down)
      posBox.set(pressureplate4.position.x, pressureplate4.position.y + 2, pressureplate4.position.z)
    else if (pressureplate5.position.distanceTo(posBox) < 4 && !press5Down)
      posBox.set(pressureplate5.position.x, pressureplate5.position.y + 2, pressureplate5.position.z)

    selectedBox = null

  }
  else if (intersects.length > 0 && !selectedBox && intersects[0].object.userData.name === "box" &&
    placeholder.getWorldPosition(new THREE.Vector3()).distanceTo(intersects[0].object.getWorldPosition(new THREE.Vector3())) < 6) {
    intersects[0].object.userData.pai.traverse((node) => {
      if (node.isMesh) {
        node.material.emissive.set(0xff0);
      }
    })
    intersects[0].object.userData.name = "selectedBox"
    intersects[0].object.userData.pai.userData.name = "selectedBox"
    selectedBox = intersects[0].object.userData.pai;
  }
});


console.log(colisores)
let posicoesPonte = [{ x: 72, z: -2 },
{ x: 72, z: 0 },
{ x: 74, z: -2 },
{ x: 74, z: 0 },
{ x: 76, z: -2 },
{ x: 76, z: 0 }]

function soltaBloco() {
  if (notSelected) {

    let centro = null
    if (notSelected.userData.area == 1)
      centro = new THREE.Vector3(50, -2, 0)
    else if (notSelected.userData.area == 2)
      centro = new THREE.Vector3(-50, -2, 0)
    else if (notSelected.userData.area == 3)
      centro = new THREE.Vector3(0, -2, 50)

    let maxz = centro.z + 20;
    let minz = centro.z - 20;
    let maxx = centro.x + 20;
    let minx = centro.x - 20;

    if (colocarPonte.intersectsBox(boxBB) && posicoesPonte.find((element) => { return element.x == posBox.x && element.z == posBox.z })) {
      posicoesPonte = posicoesPonte.filter((element) => { return element.x != posBox.x || element.z != posBox.z })
      posBox.y = -3;
      notSelected.userData.name = "closeBox"

      if (!posicoesPonte.find((element) => { return element.x == 72 && element.z == 0 }) && boxes.indexOf(colisores[2]) != -1) {
        console.log(1)
        boxes.splice(boxes.indexOf(colisores[2]), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 72 && element.z == -2 }) && boxes.indexOf(colisores[0]) != -1) {
        console.log(2)
        boxes.splice(boxes.indexOf(colisores[0]), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 72 }) && boxes.indexOf(colisores[1]) != -1) {
        boxes.splice(boxes.indexOf(colisores[1]), 1)
        somPonte.play();
      }

      if (!posicoesPonte.find((element) => { return element.x == 74 && element.z == 0 }) && boxes.indexOf(colisores[6]) != -1) {
        boxes.splice(boxes.indexOf(colisores[6]), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 74 && element.z == -2 }) && boxes.indexOf(colisores[4]) != -1) {
        boxes.splice(boxes.indexOf(colisores[4]), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 74 }) && boxes.indexOf(colisores[5]) != -1) {
        boxes.splice(boxes.indexOf(colisores[5]), 1)
        somPonte.play();
      }

      if (!posicoesPonte.find((element) => { return element.x == 76 && element.z == 0 }) && boxes.indexOf(colisores[10]) != -1) {
        boxes.splice(boxes.indexOf(colisores[10]), 1)
        boxes.splice(boxes.indexOf(auxObj3), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 76 && element.z == -2 }) && boxes.indexOf(colisores[8]) != -1) {
        boxes.splice(boxes.indexOf(colisores[8]), 1)
        boxes.splice(boxes.indexOf(auxObj4), 1)
        somPonte.play();
      }
      if (!posicoesPonte.find((element) => { return element.x == 76 }) && boxes.indexOf(colisores[9]) != -1) {
        boxes.splice(boxes.indexOf(colisores[9]), 1)
        somPonte.play();
      }

    } else if (notSelected.userData.name != "closeBox") {

      if (notSelected.userData.area == 1)
        posBox.y = -1;
      else if (notSelected.userData.area == 2)
        posBox.y = 3
      else if (notSelected.userData.area == 3)
        posBox.y = -1

      if (posBox.z >= maxz) {
        posBox.z = maxz - 2;

      } else
        if (posBox.z <= minz) {
          posBox.z = minz + 2;
        }
      if (posBox.x >= maxx) {
        posBox.x = maxx - 2;
      } else
        if (posBox.x <= minx) {
          posBox.x = minx + 2;
        }
    }


    notSelected.position.lerp(new THREE.Vector3(posBox.x, posBox.y, posBox.z), 0.05)
    let rad = THREE.MathUtils.degToRad(90)
    let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad)
    notSelected.quaternion.slerp(quat, 0.05)
    if (notSelected.position.distanceTo(posBox) < 1.00000000000005) {
      notSelected.userData.bb.setFromObject(notSelected)
      if (notSelected.userData.bb.intersectsBox(boxBB) && add === 0) {
        boxes.splice(boxes.indexOf(notSelected), 1);
        add++;
      } else if (add === 1 && !notSelected.userData.bb.intersectsBox(boxBB)) {
        boxes.push(notSelected)
        add++;
      }
    }

  }
}


//Calcula posição do mouse
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

//Criando Bounding Box
placeholder.geometry.computeBoundingBox();
let boxBB = placeholder.geometry.boundingBox;
//Criando BoxHelper
let boxHelper = new THREE.Box3Helper(boxBB);
//scene.add(boxHelper);
//Estabelecendo o centro e o tamanho do bounding box
boxBB.setFromCenterAndSize(new THREE.Vector3(placeholder.position.x, placeholder.position.y + 1.5, placeholder.position.z), new Vector3(1.2, 2.5, 1.2));

//Checando a colisao - retorna true se ocorreu uma colisao
function checkColision() {

  let colidiu = false;

  for (let i = 0; i < boxes.length; i++) {
    if (boxBB.intersectsBox(boxes[i].userData.bb)) {
      colidiu = true;
      break;
    } else {
      colidiu = false;
    }
  }
  //Pegar Chaves
  for (let i = 0; i < chaves.length; i++) {
    if (boxBB.intersectsBox(chaves[i].userData.bb) && chaves[i].userData.pick != 1) {
      colidiu = true;
      if(i == 0){
        document.getElementById("chave-azul").setAttribute("style", "display: block")
      }
      if(i == 1){
        document.getElementById("chave-vermelha").setAttribute("style", "display: block")
      }
      if(i == 2){
        document.getElementById("chave-amarela").setAttribute("style", "display: block")
      }
      chaves[i].userData.pick = 1;
      scene.remove(chaves[i]);
      somChave.play();
      break;
    }
  }
  //Controle das portas
  for (let i = 0; i < doors.length; i++) {
    if (boxBB.intersectsBox(doors[i].userData.bb)) {
      if (chaves[i].userData.pick != 0) {
        doors[i].userData.open = 1;
        //scene.remove(doors[i]);
        //doors.splice(i, 1);
      }
      colidiu = true;
      break;
    }
  }
  //Posso adicionar o teste da chave aqui

  return colidiu;
}

function doorAdjust() {
  for (let i = 0; i < doors.length; i++) {
    if (doors[i].userData.open == 1)
      doors[i].position.lerp(new THREE.Vector3(doors[i].position.x, -6, doors[i].position.z), 0.025);
    doors[i].userData.bb.setFromObject(doors[i]);
  }
}


//ajusta a rotação do boxHelper de acordo com a rotação do player 
function adjust() {

  //
  let rotate = boxHelper.rotation.clone();
  boxHelper.rotation.set(0, 0, 0);

  placelooker.updateMatrixWorld();
  boxHelper.applyMatrix4(new THREE.Matrix4().copy(placelooker.matrixWorld).invert());

}

//Direct Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.target = placeholder;
directionalLight.position.set(camera.position.x, camera.position.y + 3, camera.position.z);
directionalLight.castShadow = true;
directionalLight.angle = THREE.MathUtils.degToRad(100);
directionalLight.shadow.mapSize.width = 5012; // default
directionalLight.shadow.mapSize.height = 5012; // default
directionalLight.shadow.camera.near = 0.1; // default
directionalLight.shadow.camera.far = 100; // default
directionalLight.shadow.camera.left = 70;
directionalLight.shadow.camera.right = -70;
directionalLight.shadow.camera.top = 70;
directionalLight.shadow.camera.bottom = -70;

scene.add(directionalLight);





// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Trabalho 3");
controls.addParagraph();
controls.add("Utilize o botão esquerdo do mouse para selecionar as caixas");
controls.add("Utilize WASD para mover o personagem");
controls.add("Utilize C para mudar para câmera ortogonal ou perspectiva");
controls.show();

let arrowHelper;
let add = 0;

let H = 0;

var progress = document.getElementById('back-progress');
var progressBar = document.getElementById('progress-bar');

render();
function render() {
  stats.update();
  adjust()
  requestAnimationFrame(render);
  playAction = keyboardUpdate(keyboard, directionalLight, placeholder, boxBB, placelooker, playAction, mat4, checkColision, camera, rotateTo, movimentoLateral, projectionControle, scene);
  renderer.render(scene, camera) // Render scene
  doorAdjust();
  
  soundAux();
  playEndGame();
  playBackground();

  escada0to1.andarEscadas("x", "-", 0, -2, 0.5, placeholder, placelooker, boxBB, escada0to3, directionalLight, mat4)
  escada0to2.andarEscadas("x", "-", 2, 0, 0.5, placeholder, placelooker, boxBB, escada0to3, directionalLight, mat4)
  escada0to3.andarEscadas("z", "-", 0, -2, 0.5, placeholder, placelooker, boxBB, escada0to3, directionalLight, mat4)
  escada0to4.andarEscadas("z", "-", 2, 0, 0.5, placeholder, placelooker, boxBB, escada0to3, directionalLight, mat4)

  seguraBloco();

  soltaBloco()

  //character animation

  var delta = clock.getDelta() * 1.50;  //velocidade da animação
  //Com mais animações vale apena revisar o delta

  if (playAction)
  //talvez precise mudar alguma coisa em outras etapas,
  //so atende a movimentação do boneco.
  {
    for (var i = 0; i < mixer.length; i++)
      mixer[i].update(delta);
  }
  playAction = false


  for (let i = 0; i < boxes.length; i++) {
    if (plate1BB.intersectsBox(boxes[i].userData.bb)) {
      boxes[i].userData.name = "closeBox"
      pressureplate1.position.lerp(new THREE.Vector3(-60, 1.1, 0), 0.05);
      press1Down = true;
    }
    if (plate2BB.intersectsBox(boxes[i].userData.bb)) {
      boxes[i].userData.name = "closeBox"
      pressureplate2.position.lerp(new THREE.Vector3(-60, 1.1, 6), 0.05);
      press2Down = true;
    }
    if (plate3BB.intersectsBox(boxes[i].userData.bb)) {
      boxes[i].userData.name = "closeBox"
      pressureplate3.position.lerp(new THREE.Vector3(-60, 1.1, -6), 0.05);
      press3Down = true;
    }
    if (plate4BB.intersectsBox(boxes[i].userData.bb)) {
      boxes[i].userData.name = "closeBox"
      pressureplate4.position.lerp(new THREE.Vector3(16, -3, 44), 0.05);
      press4Down = true;
    }
    if (plate5BB.intersectsBox(boxes[i].userData.bb)) {
      boxes[i].userData.name = "closeBox"
      pressureplate5.position.lerp(new THREE.Vector3(-16, -3, 54), 0.05);
      press5Down = true;
    }
  }


  interruptores.map((el, index) => {
    spotLights[index].target.updateMatrixWorld();
    spotLights[index].shadow.camera.updateProjectionMatrix();
    if (el.getWorldPosition(new THREE.Vector3()).distanceTo(placeholder.getWorldPosition(new Vector3())) > 5) {
      spotLights[index].intensity = 0;
    } else {
      spotLights[index].intensity = 1;
    }
    if (press5Down && press4Down) {
      spotLights[index].intensity = 1;
    }
  })

  if (press5Down && press4Down) {
    doorArea3.position.lerp(new THREE.Vector3(0, -5, 70), 0.05)
    doorBB3.setFromObject(doorArea3);
  }
  if (press1Down && press2Down && press3Down) {
    doorArea4.position.lerp(new THREE.Vector3(-70, -2, 0), 0.05)
    doorBB4.setFromObject(doorArea4);
  }

  directionalLight.target.updateMatrixWorld();
  directionalLight.shadow.camera.updateProjectionMatrix();

  //Changing type of camera
  if (keyboard.down("C")) {
    // Store the previous position of the camera
    var pos = new THREE.Vector3().copy(camera.position);

    if (!projectionControle) {
      var s = 96;
      camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
        window.innerHeight / s, window.innerHeight / -s, -s, s);
      projectionControle = true;
    }
    else {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      projectionControle = false;
    }

    camera.position.copy(pos);
    camera.lookAt(scene.position);
    placeholder.add(camera);

  }

  if (keyboard.down("T")) {
    for (let i = 0; i < doors.length; i++) {
      doors[i].userData.open = 1
      document.getElementById("chave-azul").setAttribute("style", "display: block")
      document.getElementById("chave-vermelha").setAttribute("style", "display: block")
      document.getElementById("chave-amarela").setAttribute("style", "display: block")
    }
  }
}