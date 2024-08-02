import { camera } from './main';
import { lerp } from './functions';

const keysPressed: { [key: string]: boolean } = {};

export function InitControls() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    updateCameraFOV();
}

function onKeyDown(event: KeyboardEvent) {
    keysPressed[event.key.toLowerCase()] = true;
}

function onKeyUp(event: KeyboardEvent) {
    keysPressed[event.key.toLowerCase()] = false;
}


// Third person camera - First person camera
let FP = false;
let targetFOV = 50;

function updateCameraFOV() {
    requestAnimationFrame(updateCameraFOV);

    if (keysPressed['v']) {
        if (!FP) {
            targetFOV = 20;
            FP = true;
        } else {
            targetFOV = 50;
            FP = false;
        }
    }

    camera.fov = lerp(camera.fov, targetFOV, 0.1);
    camera.updateProjectionMatrix();
}
