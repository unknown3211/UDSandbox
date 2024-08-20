import { NotifyUI, MessageType } from '../ui/notifications';
import { ProgressbarUI } from '../ui/progressbar';
import { raycaster, mouse, camera, scene } from '../main';
/*import { CubeClicked } from '../scripts/cubetest'*/
import { MineCopper } from '../scripts/mining/mining';

export function Notify(title: string, message: string, duration: number, type: MessageType) {
    NotifyUI(title, message, duration, type);
}

export function Progressbar(title: string, message: string, duration: number) {
    ProgressbarUI(title, message, duration);
}

export function PlaySound(source: string, volume: number, duration: number) {
    const sound = new Audio(source);
    sound.volume = volume;
    sound.play();
    Delay(duration).then(() => {
        sound.pause();
        sound.currentTime = 0;
    });
}

export function lerp(start: number, end: number, amount: number): number {
    return (1 - amount) * start + amount * end;
}

export function Delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function Interact() { /* ALWAYS MAKE THIS FUNCTION LAST BECAUSE IT WILL HAVE MULTIPLE INTERACTIONS */
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(mouse.x, mouse.y, 1).unproject(camera).sub(raycaster.ray.origin).normalize();

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name === 'interactiveCube') {
            MineCopper();
        }
    }
}