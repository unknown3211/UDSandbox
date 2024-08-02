import Stats from 'three/examples/jsm/libs/stats.module.js';
/*import { GUI } from 'dat.gui';
import { gltfModel } from '../main';*/

export var stats = new Stats();
document.body.appendChild(stats.dom);

/*export var gui = new GUI();

export function DevGUI() {
    if (gltfModel) {
        const rotationFolder = gui.addFolder('Rotation');
        rotationFolder.open();
        rotationFolder.add(gltfModel.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
        rotationFolder.add(gltfModel.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
        rotationFolder.add(gltfModel.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');

        const scaleFolder = gui.addFolder('Scale');
        scaleFolder.open();
        scaleFolder.add(gltfModel.scale, 'x', 0, 2).name('Scale X Axis');
        scaleFolder.add(gltfModel.scale, 'y', 0, 2).name('Scale Y Axis');
        scaleFolder.add(gltfModel.scale, 'z', 0, 2).name('Scale Z Axis');
    }
}*/