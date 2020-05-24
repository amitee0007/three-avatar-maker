// Accessories enable disable Controller
let accessories = function(){
    this.shirts = false,
    this.jeans = false,
    this.boots = false
};
const gui = new dat.GUI(); 
let text = new accessories();

let scene_shirt =  gui.add(text,'shirts');
let scene_jeans =  gui.add(text,'jeans');
let scene_boot =  gui.add(text,'boots');

scene_shirt.onChange(()=>{
 if(text.shirts){
    loader.load('./avatar/Shirt_1.gltf',onload,whileload,onerror);
 }else{
     let shrit = scene.getObjectByName('Scene_shirts');
     shrit.parent.remove(shrit);
 }
})

scene_jeans.onChange(()=>{
 if(text.jeans){
    loader.load('./avatar/Jeans.gltf',onload,whileload,onerror);
 }else{
     let jeans = scene.getObjectByName('Scene_jeans');
     jeans.parent.remove(jeans);
 }
})
scene_boot.onChange(()=>{
 if(text.boots){
    loader.load('./avatar/Boots.gltf',onload,whileload,onerror);
 }else{
     let boot = scene.getObjectByName('Scene_boot');
     boot.parent.remove(boot);
 }
})
