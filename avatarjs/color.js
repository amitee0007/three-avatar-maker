let colortray = document.querySelector('#colortray');

const colors = [
    {color:'rgb(141,85,36)'  },
    {color:'rgb(198,134,66)' },
    {color:'rgb(224,172,105)'},
    {color:'rgb(241,194,125)'},
    {color:'rgb(255,219,172)'}
];

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
