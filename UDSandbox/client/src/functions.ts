import { NotifyUI } from './dev/ui';
import { raycaster, mouse, camera, scene } from './main';

export function Notify(title: string, message: string, duration: number) {
    NotifyUI(title, message, duration);
}

export function Interact() {
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(mouse.x, mouse.y, 1).unproject(camera).sub(raycaster.ray.origin).normalize();

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name === 'interactiveCube') {
            CubeClicked();
        }
    }
}

function CubeClicked() {
    console.log('Clicked on interactive cube!');
}