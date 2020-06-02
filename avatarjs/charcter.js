import {changeCharacter} from './gltf.js';

let character = document.querySelector('#character')

character.addEventListener('change',(e)=>{
    if(e.target.value == 'M'){
        changeCharacter('avatar_M');
    }
    if(e.target.value == 'F'){
        changeCharacter('avatar_F')
    }
    if(e.target.value == 'A'){
        changeCharacter('avatar_A')
    }
})

