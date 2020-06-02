import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';
import { VRButton } from '../node_modules/three/examples/jsm/webxr/VRButton.js';
import { wearable } from './wearable.js';

let scene,renderer,camera;
scene = new THREE.Scene();  
let loader = new GLTFLoader();  // Loader
let lod = new THREE.LOD();  
let model = [];
let active_avatar;


// Character
const Body_Base = ["Body_A_Variant1_Base","Body_M_Variant1_Base","Body_F_Variant1_Base"];
const Body_A = ["Body_A_Variant1_LOD0","Body_A_Variant1_LOD1","Body_A_Variant1_LOD2"];
const Body_M = ["Body_M_Variant1_LOD0","Body_M_Variant1_LOD1","Body_M_Variant1_LOD2"];
const Body_F = ["Body_F_Variant1_LOD0","Body_F_Variant1_LOD1","Body_F_Variant1_LOD2"];

// Shareble
const Eye = ["Eyes_LOD0","Eyes_LOD1","Eyes_LOD2"];
const Tongue = ["Tongue_LOD0","Tongue_LOD1","Tongue_LOD2"];
const Teeth = ["Teeth_LOD0","Teeth_LOD1","Teeth_LOD2"];

// Wearables
const Hair_Jackson = ["Hair_Jackson_LOD0","Hair_Jackson_LOD1","Hair_Jackson_LOD2"]
const Hair_Pixi = ["Hair_Pixi_LOD0","Hair_Pixi_LOD1","Hair_Pixi_LOD2"]
const Hair_Maude = ["Hair_Maude_LOD0","Hair_Maude_LOD1","Hair_Maude_LOD2"]
const Feet_Boots1 = ["Feet_Boots1_LOD0","Feet_Boots1_LOD1","Feet_Boots1_LOD2"]
const Feet_Boots2 = ["Feet_Boots2_LOD0","Feet_Boots2_LOD1","Feet_Boots2_LOD2"]
const Feet_Boots3 = ["Feet_Boots3_LOD0","Feet_Boots3_LOD1","Feet_Boots3_LOD2"]
const TopInner_M_LongSleevePolo = ["TopInner_M_LongSleevePolo_LOD0","TopInner_M_LongSleevePolo_LOD1","TopInner_M_LongSleevePolo_LOD2"]
const BottomOuter_M_Slacks = ["BottomOuter'_M_Slacks_LOD0"]
const BottomInner_F_LongSocks = ["BottomInner_F_LongSocks_LOD0","BottomInner_F_LongSocks_LOD1","BottomInner_F_LongSocks_LOD2"]
const TopInner_F_ActiveShirt = ["TopInner_F_ActiveShirt_LOD0","TopInner_F_ActiveShirt_LOD1","TopInner_F_ActiveShirt_LOD2"]
const BottomOuter_F_MiniSkirt = ["BottomOuter_F_MiniSkirt_LOD0","BottomOuter_F_MiniSkirt_LOD1","BottomOuter_F_MiniSkirt_LOD2"]
const TopInner_A_TankTop = ["TopInner_A_TankTop_LOD0","TopInner_A_TankTop_LOD1","TopInner_A_TankTop_LOD2"]
const TopOuter_A_LeatherJacket = ["TopOuter_A_LeatherJacket_LOD0","TopOuter_A_LeatherJacket_LOD1","TopOuter_A_LeatherJacket_LOD2"]
const BottomOuter_A_LeatherPants = ["BottomOuter_A_LeatherPants_LOD0","BottomOuter_A_LeatherPants_LOD1","BottomOuter_A_LeatherPants_LOD2"];

let MODEL_DATA = {
  "boons":{
    "body":[],
    "shared":[],
    "wearable":[]
  },
  "shared":{
    "eye":[],
    "teeth":[],
    "tongue":[]
  }
  ,
  "avatar_M" : {
    "body":[],
    "hair":[],
    "tops" : [],
    "bottoms" : [],
    "boots" : []
  },
  "avatar_F" : {
    "body":[],
    "hair":[],
    "tops" : [],
    "bottoms" : [],
    "boots" : []
  },
  "avatar_A" : {
    "body":[],
    "hair":[],
    "tops" : [],
    "bottoms" : [],
    "boots" : []
  },
}

// let wearable_group_LD0 = new THREE.Gr

// Light Ambient
let light_AMB = new THREE.AmbientLight( 0x404040 , 5); // soft white light
scene.add( light_AMB );

// scene.background = new THREE.Color('rgb(255,255,255)')

// Camera setting
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );
camera.position.set(0,100,400)
camera.up.set(0,100,0);

// Renderer setting
renderer = new THREE.WebGLRenderer( { antialias: true, } );
// renderer.xr.enabled = true;
// document.body.appendChild(VRButton.createButton(renderer));  // For VR enabling
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );
let roughnessMipmapper = new RoughnessMipmapper( renderer );

// rotaion setting about model
var controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50000;
controls.maxPolarAngle = Math.PI / 2;

let whileload = (xhr)=>{
    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}

let onerror = (error)=>{
    console.log(error);
}

loader.load('../Characters_And_Wearables/Bodies.glb',
(gltf)=>{
  gltf.scene.traverse( function (child) {
    if(child.isBone && child.name == 'CC_Base_BoneRoot'){
       MODEL_DATA.boons.body = child;
    }
    if(Body_M.includes(child.name)){
      MODEL_DATA.avatar_M.body.push(child);
    }
    if(Body_F.includes(child.name)){
      MODEL_DATA.avatar_F.body.push(child);
    }
    if(Body_A.includes(child.name)){
      MODEL_DATA.avatar_A.body.push(child);
    }
  });
  active_avatar = 'avatar_M'; // selecting avatar for first load
  display(active_avatar);     // display avatar on first load default avatar_M
  wearable(active_avatar)     // show seleted avatar wearable icons on screen
},
whileload,
onerror
);

loader.load('../Characters_And_Wearables/Shared.glb',
(gltf)=>{
  gltf.scene.traverse( function (child) {
    if(child.isBone && child.name == 'CC_Base_BoneRoot'){
       MODEL_DATA.boons.shared = child;
    }
    if(Eye.includes(child.name)){
      MODEL_DATA.shared.eye.push(child);
    }
    if(Tongue.includes(child.name)){
      MODEL_DATA.shared.tongue.push(child);
    }
    if(Teeth.includes(child.name)){
      MODEL_DATA.shared.teeth.push(child);
    }
  });
},
whileload,
onerror
);

loader.load('../Characters_And_Wearables/Wearables.glb',
(gltf)=>{
  gltf.scene.traverse( function (child) {
    if(child.isBone && child.name == 'CC_Base_BoneRoot'){
      MODEL_DATA.boons.wearable = child;
    }
    if(Hair_Jackson.includes(child.name)){
      MODEL_DATA.avatar_M.hair.push(child);
      MODEL_DATA.avatar_F.hair.push(child);
      MODEL_DATA.avatar_A.hair.push(child);
    }
    if(Hair_Pixi.includes(child.name)){
      MODEL_DATA.avatar_M.hair.push(child);
      MODEL_DATA.avatar_F.hair.push(child);
      MODEL_DATA.avatar_A.hair.push(child);
    }
    if(Hair_Maude.includes(child.name)){
      MODEL_DATA.avatar_M.hair.push(child);
      MODEL_DATA.avatar_F.hair.push(child);
      MODEL_DATA.avatar_A.hair.push(child);
    }
    if(Feet_Boots1.includes(child.name)){
      MODEL_DATA.avatar_M.boots.push(child);
      MODEL_DATA.avatar_F.boots.push(child);
      MODEL_DATA.avatar_A.boots.push(child);
    }
    if(Feet_Boots2.includes(child.name)){
      MODEL_DATA.avatar_M.boots.push(child);
      MODEL_DATA.avatar_F.boots.push(child);
      MODEL_DATA.avatar_A.boots.push(child);
    }
    if(Feet_Boots3.includes(child.name)){
      MODEL_DATA.avatar_M.boots.push(child);
      MODEL_DATA.avatar_F.boots.push(child);
      MODEL_DATA.avatar_A.boots.push(child);
    }
    if(BottomOuter_M_Slacks.includes(child.name)){
      MODEL_DATA.avatar_M.bottoms.push(child);
      MODEL_DATA.avatar_A.bottoms.push(child);
    }
    if(TopInner_M_LongSleevePolo.includes(child.name)){
      MODEL_DATA.avatar_M.tops.push(child);
      MODEL_DATA.avatar_A.tops.push(child);
    }
    if(BottomInner_F_LongSocks.includes(child.name)){
      MODEL_DATA.avatar_F.bottoms.push(child);
    }
    if(TopInner_F_ActiveShirt.includes(child.name)){
      MODEL_DATA.avatar_F.tops.push(child);
    }
    if(BottomOuter_F_MiniSkirt.includes(child.name)){
      MODEL_DATA.avatar_F.bottoms.push(child);
    }
    if(TopInner_A_TankTop.includes(child.name)){
      MODEL_DATA.avatar_M.tops.push(child);
      MODEL_DATA.avatar_A.tops.push(child);
    }
    if(TopOuter_A_LeatherJacket.includes(child.name)){
      MODEL_DATA.avatar_M.tops.push(child);
      MODEL_DATA.avatar_A.tops.push(child);
    }
    if(BottomOuter_A_LeatherPants.includes(child.name)){
      MODEL_DATA.avatar_M.bottoms.push(child);
      MODEL_DATA.avatar_A.bottoms.push(child);
    }
  });
},
whileload,
onerror
);

function display(active){
  for (let i = 0; i < 3; i ++ ) {   
    let group = new THREE.Group()
    group.add(MODEL_DATA[active].body[i])
    group.add(MODEL_DATA.shared.eye[i])
    group.add(MODEL_DATA.shared.tongue[i])
    group.add(MODEL_DATA.shared.teeth[i])
    group.name = "LOD"+i;
    model.push(group)
  } 
  for (let i = 0; i < 3; i ++ ) {
    lod.addLevel( model[i], i*40 + 400);       
  }    
  scene.add(MODEL_DATA.boons.body)
  scene.add(MODEL_DATA.boons.shared)
  scene.add(MODEL_DATA.boons.wearable)
  scene.add(lod);
  roughnessMipmapper.dispose();
  render(); 
}

function changeCharacter(selected){
  active_avatar = selected;
  wearable(active_avatar)
  lod.children.forEach((element,index) => {
    element.children[0] = MODEL_DATA[selected].body[index];
  });
}

// Model Renderer
function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
    // console.log(lod._currentLevel)
}

// Ressponsive
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

export {scene,lod,active_avatar,MODEL_DATA,changeCharacter};
