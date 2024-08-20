import { Notify, PlaySound, Delay } from '../main/functions';
import { cube, cubeBody, world } from '../dev/map';
import { scene, currentUserId } from '../main';
import { inventory } from './inventory/inventory';
import Sound from '../assets/sounds/boom1.wav';

export function CubeClicked() {
    if (currentUserId) {
        Notify('Notify', 'Cube Removed', 2000, 'success');
        console.log(currentUserId);
        PlaySound(Sound, 0.5, 2000);
        inventory.addItem(2, 1, currentUserId);
        scene.remove(cube);
        world.removeBody(cubeBody);
        Delay(2000).then(() => {
            cube.position.set(2, 1, 0);
            cubeBody.position.set(2, 1, 0);
            scene.add(cube);
            world.addBody(cubeBody);
            inventory.refreshUI();
        });
    }
}
