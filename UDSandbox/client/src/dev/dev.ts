import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'dat.gui';
import { gltfModel, pistol } from '../main';
import { Notify } from '../main/functions';
import { MessageType } from '../ui/notifications';

export var stats = new Stats();
document.body.appendChild(stats.dom);
export const pistolParams = { visible: false };

export var gui = new GUI();

export function DevGUI() {
    if (gltfModel) {
        const rotationFolder = gui.addFolder('Rotation');
        rotationFolder.add(gltfModel.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
        rotationFolder.add(gltfModel.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
        rotationFolder.add(gltfModel.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');

        const scaleFolder = gui.addFolder('Scale');
        scaleFolder.add(gltfModel.scale, 'x', 0, 2).name('Scale X Axis');
        scaleFolder.add(gltfModel.scale, 'y', 0, 2).name('Scale Y Axis');
        scaleFolder.add(gltfModel.scale, 'z', 0, 2).name('Scale Z Axis');

        const devFolder = gui.addFolder('Misc');
        const notifyParams = {
            title: 'Test Notification',
            message: 'Test Notification',
            type: "success",
            duration: 3000,
            notify: function () {
                Notify(this.title, this.message, parseInt(this.duration.toString()), this.type as MessageType);
            }
        };
        devFolder.add(notifyParams, 'title').name('Title');
        devFolder.add(notifyParams, 'message').name('Message');
        devFolder.add(notifyParams, 'type', ['info', 'warning', 'error']).name('Type');
        devFolder.add(notifyParams, 'duration', 1000, 10000).name('Duration (ms)');
        devFolder.add(notifyParams, 'notify').name('Send Notification');
        devFolder.add(pistolParams, 'visible').name('Give Gun').onChange((value) => {
            if (pistol) {
                pistol.visible = value;
            }
        });
        devFolder.add({
            log: () => {
                if (gltfModel) {
                    console.log(`Player Position: x=${gltfModel.position.x.toFixed(1)}, y=${gltfModel.position.y.toFixed(1)}, z=${gltfModel.position.z.toFixed(1)}`);
                }
            }
        }, 'log').name('Get Coords [Vec3]');
    }
}