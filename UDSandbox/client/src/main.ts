import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addGround, addLights } from './dev/map';
import { stats } from './dev/dev';
import io from 'socket.io-client';

export var scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let gltfModel: THREE.Group | null = null;
const cubeSpeed = 0.03;
const keysPressed: { [key: string]: boolean } = {};
const gravity = -0.02;
let verticalVelocity = 0;
let isJumping = false;

const socket = io('http://localhost:3000');
const players: { [id: string]: THREE.Group } = {};

let isRightMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cameraDistance = 10;

let directionalLight: THREE.DirectionalLight;

function Init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  addGround();
  addLights();

  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  camera.position.set(0, 5, cameraDistance);
  camera.lookAt(0, 0, 0);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('contextmenu', (event) => event.preventDefault());

  animate();

  socket.on('currentPlayers', (currentPlayers) => {
    for (const id in currentPlayers) {
      if (id === socket.id) {
        loadGLTFModel(currentPlayers[id]);
      } else {
        addOtherPlayer(id, currentPlayers[id]);
      }
    }
  });

  socket.on('newPlayer', (player) => {
    addOtherPlayer(player.id, player.position);
  });

  socket.on('playerMoved', (player) => {
    if (players[player.id]) {
      players[player.id].position.set(player.position.x, player.position.y, player.position.z);
    }
  });

  socket.on('playerDisconnected', (id) => {
    if (players[id]) {
      scene.remove(players[id]);
      delete players[id];
    }
  });
}

function onKeyDown(event: KeyboardEvent) {
  keysPressed[event.key.toLowerCase()] = true;
  if (event.key === ' ' && !isJumping && gltfModel) {
    verticalVelocity = 0.4;
    isJumping = true;
    socket.emit('jump');
  }
}

function onKeyUp(event: KeyboardEvent) {
  keysPressed[event.key.toLowerCase()] = false;
}

function onMouseDown(event: MouseEvent) {
  if (event.button === 2) {
    isRightMouseDown = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  }
}

function onMouseUp(event: MouseEvent) {
  if (event.button === 2) {
    isRightMouseDown = false;
  }
}

function onMouseMove(event: MouseEvent) {
  if (isRightMouseDown && gltfModel) {
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    const rotationSpeed = 0.005;
    gltfModel.rotation.y += deltaX * rotationSpeed;
    camera.position.x = gltfModel.position.x + cameraDistance * Math.sin(gltfModel.rotation.y);
    camera.position.z = gltfModel.position.z + cameraDistance * Math.cos(gltfModel.rotation.y);

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;

    directionalLight.position.set(
      gltfModel.position.x + 10 * Math.sin(gltfModel.rotation.y + Math.PI / 4),
      gltfModel.position.y + 10,
      gltfModel.position.z + 10 * Math.cos(gltfModel.rotation.y + Math.PI / 4)
    );
    directionalLight.target.position.set(gltfModel.position.x, gltfModel.position.y, gltfModel.position.z);
  }
}

function loadGLTFModel(position: { x: number, y: number, z: number }) {
  const loader = new GLTFLoader();
  loader.load(
    'src/assets/models/ud_default_character.glb',
    (gltf) => {
      console.log('Model loaded successfully', gltf);
      gltfModel = gltf.scene;
      gltfModel.position.set(position.x, position.y, position.z);
      const scale = 0.5;
      gltfModel.scale.set(scale, scale, scale);
      gltfModel.castShadow = true;
      scene.add(gltfModel);
    },
    undefined,
    (error) => {
      console.error('An error happened while loading the model:', error);
    }
  );
}

function addOtherPlayer(id: string, position: { x: number, y: number, z: number }) {
  const loader = new GLTFLoader();
  loader.load(
    'src/assets/models/ud_default_character.glb',
    (gltf) => {
      const otherPlayerModel = gltf.scene.clone();
      otherPlayerModel.position.set(position.x, position.y, position.z);
      const scale = 0.5;
      otherPlayerModel.scale.set(scale, scale, scale);
      otherPlayerModel.castShadow = true;
      scene.add(otherPlayerModel);
      players[id] = otherPlayerModel;
    },
    undefined,
    (error) => {
      console.error('An error happened while loading the model:', error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);

  if (gltfModel) {
    const movement = new THREE.Vector3();

    if (keysPressed['s']) movement.z -= cubeSpeed;
    if (keysPressed['w']) movement.z += cubeSpeed;
    if (keysPressed['d']) movement.x -= cubeSpeed;
    if (keysPressed['a']) movement.x += cubeSpeed;

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const rightDirection = new THREE.Vector3();
    rightDirection.crossVectors(camera.up, cameraDirection);
    rightDirection.normalize();

    const forwardMovement = cameraDirection.multiplyScalar(movement.z);
    const rightMovement = rightDirection.multiplyScalar(movement.x);

    const finalMovement = forwardMovement.add(rightMovement);

    if (movement.length() > 0) {
      gltfModel.position.add(finalMovement);
    }

    if (isJumping) {
      verticalVelocity += gravity;
      gltfModel.position.y += verticalVelocity;

      if (gltfModel.position.y <= 0.5) {
        gltfModel.position.y = 0.5;
        isJumping = false;
        verticalVelocity = 0;
      }
    }

    socket.emit('move', { x: finalMovement.x, y: 0, z: finalMovement.z });
  }
  stats.update();
  updateCameraPosition();
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  if (gltfModel) {
    camera.position.set(
      gltfModel.position.x + cameraDistance * Math.sin(gltfModel.rotation.y),
      gltfModel.position.y + 5,
      gltfModel.position.z + cameraDistance * Math.cos(gltfModel.rotation.y)
    );
    camera.lookAt(gltfModel.position);

    directionalLight.position.set(
      gltfModel.position.x + 10 * Math.sin(gltfModel.rotation.y + Math.PI / 4),
      gltfModel.position.y + 10,
      gltfModel.position.z + 10 * Math.cos(gltfModel.rotation.y + Math.PI / 4)
    );
    directionalLight.target.position.set(gltfModel.position.x, gltfModel.position.y, gltfModel.position.z);
  }
}

Init();
