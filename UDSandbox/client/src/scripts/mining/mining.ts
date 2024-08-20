import { Notify, PlaySound, Delay, Progressbar } from '../../main/functions';
import { cube, cubeBody, world } from '../../dev/map';
import { scene, currentUserId } from '../../main';
import { inventory } from '../inventory/inventory';
import Sound from '../../assets/sounds/boom1.wav';

export function MineCopper() {
    if(currentUserId) {
        Progressbar('Mining', 'Mining Copper', 2000);
        inventory.addItem(4, 1, currentUserId);
        Delay(2000).then(() => {
            Notify('Job Center', "Copper Mined", 2000, 'success');
            console.log(currentUserId);
            PlaySound(Sound, 0.5, 2000);
            scene.remove(cube);
            world.removeBody(cubeBody);
            Delay(2000).then(() => {
                cube.position.set(2, 1, 0);
                cubeBody.position.set(2, 1, 0);
                scene.add(cube);
                world.addBody(cubeBody);
                inventory.refreshUI();
            });
        });
    }
}