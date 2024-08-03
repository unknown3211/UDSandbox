import { Notify, PlaySound, Delay } from '../main/functions';
import { cube, cubeBody, world } from '../dev/map';
import { scene } from '../main';
import { inventory } from './inventory/inventory';
import Sound from '../assets/sounds/boom1.wav';

export function CubeClicked() {
    Notify('UnKnownJohn', 'Cube Removed', 2000, 'success');
    PlaySound(Sound, 0.5, 2000);
    inventory.addItem(4, 1);
    scene.remove(cube);
    world.removeBody(cubeBody);
    Delay(2000).then(() => {
        cube.position.set(2, 1, 0);
        cubeBody.position.set(2, 1, 0);
        scene.add(cube);
        world.addBody(cubeBody);
    });
}