import * as THREE from '../node_modules/three/build/three.module.js';
import { scene,lod,active_avatar,MODEL_DATA } from "./gltf.js"

let tops_TRAY = document.querySelector('.topstray');
let bottoms_TRAY = document.querySelector('.bottomstray');
let boots_TRAY = document.querySelector('.bootstray');
let top_CONTROL = document.querySelector('#top_CONTROL');
let bottom_CONTROL = document.querySelector('#bottom_CONTROL');
let boot_CONTROL = document.querySelector('#boot_CONTROL');

let group_tops = new THREE.Group();
group_tops.name = "wearable_tops";

let group_bottoms = new THREE.Group();
group_bottoms.name = "wearable_bottoms";

let group_boots = new THREE.Group();
group_boots = "wearable_boots";

const ICONS = {
    "avatar_M":{
        "tops":[
            '../images/top/top_m.png',
            '../images/top/top_a.png'
        ],
        "bottoms":[
            '../images/bottom/bottom_m.png',
            '../images/bottom/bottom_a.png'
        ],
        "boots":[
            '../images/boot/boot1.png',
            '../images/boot/boot2.png',
            '../images/boot/boot3.png'
        ]
    },
    "avatar_F":{
        "tops":[
            '../images/top/top_f.png'
        ],
        "bottoms":[
            '../images/bottom/longshocks.png',
            '../images/bottom/skirt.png'
        ],
        "boots":[
            '../images/boot/boot1.png',
            '../images/boot/boot2.png',
            '../images/boot/boot3.png'
        ]
    },
    "avatar_A":{
        "tops":[
            '../images/top/top_a.png',
            '../images/top/top_m.png'
        ],
        "bottoms":[
            '../images/bottom/bottom_a.png',
            '../images/bottom/bottom_m.png'
        ],
        "boots":[
            '../images/boot/boot1.png',
            '../images/boot/boot2.png',
            '../images/boot/boot3.png'
        ]
    }
}

// Icons selections and creation
let wearable= (active_avatar)=>{
    tops_TRAY.innerHTML = "";
    bottoms_TRAY.innerHTML = "";
    boots_TRAY.innerHTML = "";
        for(let i = 0 ; i < ICONS[active_avatar].tops.length ; i++){
            let shirts = document.createElement('img')
            shirts.classList.add('img-thumbnail')
            shirts.setAttribute('data-selected','tops')
            shirts.setAttribute('data-index',i)
            shirts.setAttribute('src',ICONS[active_avatar].tops[i])
            tops_TRAY.append(shirts);
        }

        for(let i = 0 ; i < ICONS[active_avatar].bottoms.length; i++){
            let bottoms = document.createElement('img')
            bottoms.classList.add('img-thumbnail')
            bottoms.setAttribute('data-selected','bottoms')
            bottoms.setAttribute('data-index',i)
            bottoms.setAttribute('src',ICONS[active_avatar].bottoms[i])
            bottoms_TRAY.append(bottoms);
        }


        for(let i = 0 ; i < ICONS[active_avatar].boots.length ; i++){
            let boots = document.createElement('img')
            boots.classList.add('img-thumbnail')
            boots.setAttribute('data-selected','boots')
            boots.setAttribute('data-index',i)
            boots.setAttribute('src',ICONS[active_avatar].boots[i])
            boots_TRAY.append(boots);
        }
}

// Wearable change control
 top_CONTROL.addEventListener('click',()=>{
    remove_active();
    top_CONTROL.classList.add('controlactive');
    let tops_list = document.querySelectorAll(".topstray img");
    for(let tops of tops_list){
        tops.addEventListener('click',(e)=>{
            let selected_wear = e.target.dataset.selected
            let selected_item = e.target.dataset.index
            if(!scene.getObjectByName(group_tops.name)){
                add_wearable(active_avatar,selected_wear,selected_item,group_tops)
                // console.log(lod)
            }else{
                let wearbles = scene.getObjectByName(group_tops.name);
                console.log(wearbles)
                console.log('CHANGE SOME CLOTHES')
            }
        })
    }
})

bottom_CONTROL.addEventListener('click',()=>{
    remove_active();
    bottom_CONTROL.classList.add('controlactive');
    if(!scene.getObjectByName(group_bottoms.name)){
        let tops_list = document.querySelectorAll(".bottomstray img")
        for(let tops of tops_list){
         tops.addEventListener('click',(e)=>{
             let selected_wear = e.target.dataset.selected
             let selected_item = e.target.dataset.index
             add_wearable(active_avatar,selected_wear,selected_item)
         })
        }      
       }else{
           let wearbles = scene.getObjectByName(group.name);
           console.log(wearbles)
           console.log('CHANGE SOME CLOTHES')
       }
})

boot_CONTROL.addEventListener('click',()=>{
    remove_active();
    boot_CONTROL.classList.add('controlactive');
    if(!scene.getObjectByName(group_boots.name)){
        let tops_list = document.querySelectorAll(".bootstray img")
        for(let tops of tops_list){
         tops.addEventListener('click',(e)=>{
             let selected_wear = e.target.dataset.selected
             let selected_item = e.target.dataset.index
             add_wearable(active_avatar,selected_wear,selected_item)
         })
        }       
       }else{
           let wearbles = scene.getObjectByName(group.name);
           console.log(wearbles)
           console.log('CHANGE SOME CLOTHES')
       }
})

let add_wearable = (active_avatar,selected_wear,selected_child,selected_group)=>{
    lod.children.forEach((element,index) => {
    //   let group_w = new THREE.Group();
    //   group_w.name = "wearbles";
      let group_w = selected_group;
      console.log(MODEL_DATA[active_avatar][selected_wear][selected_child*3 +index])
      group_w.add(MODEL_DATA[active_avatar][selected_wear][selected_child*3 +index])
      console.log(element.children)
      element.children.push(group_w);
    });
  }

let remove_active = ()=>{
    top_CONTROL.classList.remove('controlactive');
    bottom_CONTROL.classList.remove('controlactive');
    boot_CONTROL.classList.remove('controlactive');
}

export { wearable }