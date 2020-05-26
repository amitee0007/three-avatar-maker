import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';
import { VRButton } from '../node_modules/three/examples/jsm/webxr/VRButton.js';

let scene,  
  renderer,
  camera,
  model,                    // Our character
  bodymesh,
  selectedoption;

const colors = [
    {color:'rgb(141,85,36)'  },
    {color:'rgb(198,134,66)' },
    {color:'rgb(224,172,105)'},
    {color:'rgb(241,194,125)'},
    {color:'rgb(255,219,172)'}
];

let colortray = document.querySelector('#colortray');

// model body 
const bodyMeshes = [
  {childID: "CC_Base_Body.001_0"},
  {childID: "CC_Base_Body.001_1"},
  {childID: "CC_Base_Body.001_2"},
  {childID: "CC_Base_Body.001_3"},
  {childID: "CC_Base_Body.001_4"},
];

const eyeMeshes = [
  {childID: "CC_Base_Eye.001_0"},
  {childID: "CC_Base_Eye.001_1"},
  {childID: "CC_Base_Eye.001_2"},
  {childID: "CC_Base_Eye.001_3"},
];

// Loader
let loader = new GLTFLoader();

scene = new THREE.Scene();

// Adding Panorama as background
var bg = new THREE.SphereGeometry(50, 50, 50);
var bgloader  = new THREE.TextureLoader(),
texture = bgloader.load( "./panorama/pano.jpg");
var material = new THREE.MeshPhongMaterial({ 
        map: texture,
});
let env = new THREE.Mesh(bg, material);
    env.material.side = THREE.BackSide;
    scene.add(env);

// Light Ambient
let light = new THREE.AmbientLight( 0x404040 , 5); // soft white light
scene.add( light );

// Camera setting
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,9);
// camera.up.set(0,4,-5);

// Renderer setting
renderer = new THREE.WebGLRenderer( { antialias: true, } );
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.setAnimationLoop( function () {
// renderer.render( scene, camera );
// } );
document.body.appendChild( renderer.domElement );

let roughnessMipmapper = new RoughnessMipmapper( renderer );


// rotaion about model
var controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render ); // use if there is no animation loop
controls.minDistance = 1;
controls.maxDistance = 10;
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.dampingFactor = 0.9;
controls.target.set( 0, 0, 0 );
controls.update();

// Hooks for model Loader
function onload(gltf){
    if(gltf.scene.name == 'Scene'){
        bodymesh = gltf.scene;
        bodymesh.traverse( function ( child ) {
            // console.log(child);
            if ( child.isMesh ) {
                roughnessMipmapper.generateMipmaps( child.material );
            }    
        });
        bodymesh.position.set(0,-2.5,0);
        bodymesh.scale.set(2.5,2.5,2.5);
        scene.add(bodymesh);
    }else{
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                roughnessMipmapper.generateMipmaps( child.material );
            }    
        });
        gltf.scene.position.set(0,-2.5,0);
        gltf.scene.scale.set(2.5,2.5,2.5);
        scene.add(gltf.scene);
    }
    roughnessMipmapper.dispose();
    render();
}

function whileload(xhr){
    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}

function onerror(error){
    console.log(error);
}

// Avatar Body loading
loader.load('./avatar/Body_Boy.gltf',onload,whileload,onerror);

// Model Renderer
function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}

// Wearables stuf Controller

let shirtscontrol = document.querySelector('#shirtscontrol');
 shirtscontrol.addEventListener('click',()=>{
     if(!scene.getObjectByName('Scene_shirts')){
    loader.load('./avatar/Shirt_1.gltf',onload,whileload,onerror);
    shirtscontrol.classList.add('controlactive');
 }else{
     let shrit = scene.getObjectByName('Scene_shirts');
     shrit.parent.remove(shrit);
     shirtscontrol.classList.remove('controlactive');
 }
})

let jeanscontrol = document.querySelector('#jeanscontrol');
jeanscontrol.addEventListener('click',()=>{
 if(!scene.getObjectByName('Scene_jeans')){
    loader.load('./avatar/Jeans.gltf',onload,whileload,onerror);
    jeanscontrol.classList.add('controlactive');
 }else{
     let jeans = scene.getObjectByName('Scene_jeans');
     jeans.parent.remove(jeans);
     jeanscontrol.classList.remove('controlactive');
 }
})

let bootscontrol = document.querySelector('#bootscontrol');
bootscontrol.addEventListener('click',()=>{
 if(!scene.getObjectByName('Scene_boot')){
    loader.load('./avatar/Boots.gltf',onload,whileload,onerror);
    bootscontrol.classList.add('controlactive');
 }else{
     let boot = scene.getObjectByName('Scene_boot');
     boot.parent.remove(boot);
     bootscontrol.classList.remove('controlactive');
 }
})

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray-component');
      swatch.style.background = color.color;
    swatch.setAttribute('data-key', i);
    colortray.append(swatch);
  }
}
buildColors(colors);

let selectList = document.querySelectorAll('#colorcontrol');
 for(let selected of selectList){
   selected.addEventListener('click',(e)=>{
     let option = e.target;
     selectedoption = e.target.dataset.selected;
     for(let item of selectList){
       item.classList.remove('controlactive');
       option.classList.add('controlactive');
     }
   })
 }

const swatches = document.querySelectorAll(".tray-component");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}



function selectSwatch(e) {
     let colory = colors[parseInt(e.target.dataset.key)];
     let color_new  = new THREE.Color(colory.color);
     if(selectedoption == 'bodyMeshes'){
      for (let object of bodyMeshes) {
        initColor(bodymesh, object.childID, color_new);
      }
     }
     else if(selectedoption == 'eyeMeshes'){
      for (let object of eyeMeshes) {
        initColor(bodymesh, object.childID, color_new);
      }
     }

}

// Function - Add the textures to the bodymesh
function initColor(parent, type, colr) {
    // console.log(bodymesh)
  parent.traverse((childmesh) => {
   if (childmesh.isMesh) {
     if (childmesh.name == type) {
         childmesh.material.color = colr;
        render();
       }
   }
 });
}

// Ressponsive

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // render();
}
