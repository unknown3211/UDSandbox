import { Notify, PlaySound, Delay, Progressbar } from '../../main/functions';
import { cube, cubeBody, world } from '../../dev/map';
import { scene, currentUserId } from '../../main';
import { inventory } from '../inventory/inventory';
import Sound from '../../assets/sounds/boom1.wav';
import { CopperConfig } from './miningconfig';

export function MineCopper() {
    if(currentUserId) {
        Progressbar(CopperConfig.progresstitle, CopperConfig.progressmessage, CopperConfig.progressduration);
        inventory.addItem(CopperConfig.item, CopperConfig.amount, currentUserId);
        Delay(CopperConfig.progressduration).then(() => {
            Notify(CopperConfig.notifyTitle, CopperConfig.notifyMessage, CopperConfig.notifyDuration, 'success');
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