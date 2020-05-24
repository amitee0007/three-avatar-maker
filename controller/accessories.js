let shirtscontrol = document.querySelector('#shirtscontrol');
 shirtscontrol.addEventListener('click',()=>{
    console.log('working');
     if(!scene.getObjectByName('Scene_shirts')){
    loader.load('./avatar/Shirt_1.gltf',onload,whileload,onerror);
 }else{
     let shrit = scene.getObjectByName('Scene_shirts');
     shrit.parent.remove(shrit);
 }
})