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

function Init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  addGround();
  addLights();

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

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
  keysPressed[event.key] = true;
  if (event.key === ' ' && !isJumping && gltfModel) {
    verticalVelocity = 0.3;
    isJumping = true;
  }
}

function onKeyUp(event: KeyboardEvent) {
  keysPressed[event.key] = false;
}

function loadGLTFModel(position: { x: number, y: number, z: number }) {
  const loader = new GLTFLoader();
  loader.load(
    'src/assets/models/cube.glb',
    (gltf) => {
      console.log('Model loaded successfully', gltf);
      gltfModel = gltf.scene;
      gltfModel.position.set(position.x, position.y, position.z);
      const scale = 0.5;
      gltfModel.scale.set(scale, scale, scale);
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
    'src/assets/models/cube.glb',
    (gltf) => {
      const otherPlayerModel = gltf.scene.clone();
      otherPlayerModel.position.set(position.x, position.y, position.z);
      const scale = 0.5;
      otherPlayerModel.scale.set(scale, scale, scale);
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
    const movement = { x: 0, y: 0, z: 0 };

    if (keysPressed['w']) movement.z -= cubeSpeed;
    if (keysPressed['s']) movement.z += cubeSpeed;
    if (keysPressed['a']) movement.x -= cubeSpeed;
    if (keysPressed['d']) movement.x += cubeSpeed;

    gltfModel.position.x += movement.x;
    gltfModel.position.z += movement.z;

    if (isJumping) {
      verticalVelocity += gravity;
      gltfModel.position.y += verticalVelocity;

      if (gltfModel.position.y <= 0.5) {
        gltfModel.position.y = 0.5;
        isJumping = false;
        verticalVelocity = 0;
      }
    }

    socket.emit('move', movement);
  }
  stats.update();
  updateCameraPosition();
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  if (gltfModel) {
    camera.position.set(
      gltfModel.position.x,
      gltfModel.position.y + 5,
      gltfModel.position.z + 10
    );
    camera.lookAt(gltfModel.position);
  }
}

Init();
