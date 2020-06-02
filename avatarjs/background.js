import * as THREE from '../node_modules/three/build/three.module.js';
import { scene } from './gltf.js'

// Adding Panorama at background
let bg = new THREE.SphereGeometry(500, 500, 500);
let bgloader  = new THREE.TextureLoader(),
texture = bgloader.load( "../images/panorama/pano.jpg");
let material = new THREE.MeshPhongMaterial({map: texture,});
let env = new THREE.Mesh(bg, material);
env.material.side = THREE.BackSide;
scene.add(env);