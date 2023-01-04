import * as THREE from 'three';
import { OrbitControls } from './build/jsm/controls/OrbitControls.js';

export function moverJogador(bValue, tValue, lValue, rValue, camera, renderer, placeholder, rotateTo, checkColision, boxBB, placelooker, movimentoLateral, directionalLight, mat4) {

    let tempVector = new THREE.Vector3();
    // move the player
    console.log("T: " + tValue)
    console.log("B: " + bValue)
    console.log("R: " + rValue)
    console.log("L: " + lValue)

    if (tValue > 0) {
        boxBB.applyMatrix4(mat4.makeTranslation(-tValue/10, 0, -tValue/10))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x - tValue/10, camera.position.y + 3, directionalLight.position.z - tValue/10);
            placeholder.matrix.multiply(mat4.makeTranslation(-tValue/10, 0, -tValue/10));
            rotateTo(225, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(tValue/10, 0, tValue/10))
            movimentoLateral(-0.05, -0.05);
            rotateTo(225, placelooker);
        }
    }

    if (bValue/10 > 0) {
        boxBB.applyMatrix4(mat4.makeTranslation(bValue/10, 0, bValue/10))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x + bValue/10, camera.position.y + 3, directionalLight.position.z + bValue/10);
            placeholder.matrix.multiply(mat4.makeTranslation(bValue/10, 0, bValue/10));
            rotateTo(45, placelooker);

        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(-bValue/10, 0, -bValue/10))
            movimentoLateral(0.05, 0.05);
            rotateTo(45, placelooker);
        }
    }

    if (lValue/10 > 0) {
        boxBB.applyMatrix4(mat4.makeTranslation(-lValue/10, 0, lValue/10))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x - lValue/10, camera.position.y + 3, directionalLight.position.z + lValue/10);
            placeholder.matrix.multiply(mat4.makeTranslation(-lValue/10, 0, lValue/10));
            rotateTo(315, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(lValue/10, 0, -lValue/10))
            movimentoLateral(-0.05, 0.05);
            rotateTo(315, placelooker);
        }
    }

    if (rValue/10 > 0) {
        boxBB.applyMatrix4(mat4.makeTranslation(rValue/10, 0, -rValue/10))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x + rValue/10, camera.position.y + 3, directionalLight.position.z - rValue/10);
            placeholder.matrix.multiply(mat4.makeTranslation(rValue/10, 0, -rValue/10));
            rotateTo(135, placelooker);

        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(-rValue/10, 0, rValue/10))
            movimentoLateral(0.05, -0.05);
            rotateTo(135, placelooker);
        }
    }


    if (bValue > 0 || tValue > 0 || lValue > 0 || rValue > 0) {
        return true
    }
}

export function keyboardUpdate(keyboard, directionalLight, placeholder, boxBB, placelooker, playAction, mat4, checkColision, camera, rotateTo, movimentoLateral, projectionControle, scene) {
    keyboard.update()

    //adjust diagonals
    if ((keyboard.pressed("W") && keyboard.pressed("A")) || (keyboard.pressed("up") && keyboard.pressed("left"))) {
        rotateTo(270, placelooker);
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(0.03, 0, 0))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x + 0.03, camera.position.y + 3, directionalLight.position.z);
            placeholder.matrix.multiply(mat4.makeTranslation(0.03, 0, 0));
            rotateTo(270, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(-0.03, 0, 0))
            movimentoLateral(0.015, 0);
            rotateTo(270, placelooker);
        }
    }
    if ((keyboard.pressed("W") && keyboard.pressed("D")) || (keyboard.pressed("up") && keyboard.pressed("right"))) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(0, 0, 0.03))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x, camera.position.y + 3, directionalLight.position.z + 0.03);
            placeholder.matrix.multiply(mat4.makeTranslation(0, 0, 0.03));
            rotateTo(180, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(0, 0, -0.03))
            movimentoLateral(0, 0.015);
            rotateTo(180, placelooker);
        }
    }
    if ((keyboard.pressed("A") && keyboard.pressed("S")) || (keyboard.pressed("down") && keyboard.pressed("left"))) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(0, 0, -0.03))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x, camera.position.y + 3, directionalLight.position.z - 0.03);
            placeholder.matrix.multiply(mat4.makeTranslation(0, 0, -0.03));
            rotateTo(0, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(0, 0, 0.03))
            movimentoLateral(0, -0.015);
            rotateTo(0, placelooker);
        }
    }
    if ((keyboard.pressed("S") && keyboard.pressed("D")) || (keyboard.pressed("down") && keyboard.pressed("right"))) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(-0.03, 0, 0))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x - 0.03, camera.position.y + 3, directionalLight.position.z);
            placeholder.matrix.multiply(mat4.makeTranslation(-0.03, 0, 0));
            rotateTo(90, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(0.03, 0, 0))
            movimentoLateral(-0.015, 0);
            rotateTo(90, placelooker);
        }
    }

    //movement with adjusts
    if (keyboard.pressed("W") || keyboard.pressed("up")) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(-0.1, 0, -0.1))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x - 0.1, camera.position.y + 3, directionalLight.position.z - 0.1);
            placeholder.matrix.multiply(mat4.makeTranslation(-0.1, 0, -0.1));
            rotateTo(225, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(0.1, 0, 0.1))
            movimentoLateral(-0.05, -0.05);
            rotateTo(225, placelooker);
        }
    }
    if (keyboard.pressed("A") || keyboard.pressed("left")) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(-0.1, 0, 0.1))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x - 0.1, camera.position.y + 3, directionalLight.position.z + 0.1);
            placeholder.matrix.multiply(mat4.makeTranslation(-0.1, 0, 0.1));
            rotateTo(315, placelooker);
        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(0.1, 0, -0.1))
            movimentoLateral(-0.05, 0.05);
            rotateTo(315, placelooker);
        }

    }
    if (keyboard.pressed("S") || keyboard.pressed("down")) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(0.1, 0, 0.1))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x + 0.1, camera.position.y + 3, directionalLight.position.z + 0.1);
            placeholder.matrix.multiply(mat4.makeTranslation(0.1, 0, 0.1));
            rotateTo(45, placelooker);

        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(-0.1, 0, -0.1))
            movimentoLateral(0.05, 0.05);
            rotateTo(45, placelooker);
        }

    }
    if (keyboard.pressed("D") || keyboard.pressed("right")) {
        playAction = true;
        boxBB.applyMatrix4(mat4.makeTranslation(0.1, 0, -0.1))
        if (!checkColision()) {
            directionalLight.position.set(directionalLight.position.x + 0.1, camera.position.y + 3, directionalLight.position.z - 0.1);
            placeholder.matrix.multiply(mat4.makeTranslation(0.1, 0, -0.1));
            rotateTo(135, placelooker);

        } else {
            boxBB.applyMatrix4(mat4.makeTranslation(-0.1, 0, 0.1))
            movimentoLateral(0.05, -0.05);
            rotateTo(135, placelooker);
        }

    }



    return playAction
}