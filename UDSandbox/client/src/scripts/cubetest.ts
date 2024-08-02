import { Notify, PlaySound } from '../functions';
import { cube, cubeBody, world } from '../dev/map';
import { scene } from '../main';
import Sound from '../assets/sounds/boom1.wav';

export function CubeClicked() {
    Notify('UnKnownJohn', 'Cube Removed', 2000, 'success');
    PlaySound(Sound, 0.5, 2000);
    scene.remove(cube);
    world.removeBody(cubeBody);
}