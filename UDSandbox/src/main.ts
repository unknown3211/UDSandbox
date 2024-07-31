import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addGround, addLights } from './dev/map';
import { stats } from './dev/dev';

export var scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let gltfModel: THREE.Group | null = null;
const cubeSpeed = 0.03;
const keysPressed: { [key: string]: boolean } = {};
const gravity = -0.02;
let verticalVelocity = 0;
let isJumping = false;

function Init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  addGround();
  loadGLTFModel();
  addLights();

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  animate();
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

function loadGLTFModel() { // Main Character Model -> Default Cube Model (Pink)
  const loader = new GLTFLoader();
  loader.load(
    'src/assets/models/cube.glb',
    (gltf) => {
      console.log('Model loaded successfully', gltf);
      gltfModel = gltf.scene;
      gltfModel.position.set(0, 0.5, 0);
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

function animate() {
  requestAnimationFrame(animate);

  if (gltfModel) {
    if (keysPressed['w']) gltfModel.position.z -= cubeSpeed;
    if (keysPressed['s']) gltfModel.position.z += cubeSpeed;
    if (keysPressed['a']) gltfModel.position.x -= cubeSpeed;
    if (keysPressed['d']) gltfModel.position.x += cubeSpeed;
    if (isJumping) {
      verticalVelocity += gravity;
      gltfModel.position.y += verticalVelocity;

      if (gltfModel.position.y <= 0.5) {
        gltfModel.position.y = 0.5;
        isJumping = false;
        verticalVelocity = 0;
      }
    }
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