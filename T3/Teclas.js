import * as THREE from 'three';

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