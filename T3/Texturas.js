import * as THREE from 'three';
import { manager } from './Trabalho_3.js' ;

let textureLoader = new THREE.TextureLoader(manager);

//PISO STARTAREA

const startAreaTextureDiff = textureLoader.load('./assets/textures/PisoArea1.jpg')
const startAreaTextureNor = textureLoader.load('./assets/textures/Area1Normal.png')

let auxArray = [startAreaTextureDiff, startAreaTextureNor]

for(let i = 0; i < 2; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(9.45,9.45)
}

export const StartAreaMaterial = new THREE.MeshStandardMaterial({
    map: startAreaTextureDiff,
    normalMap: startAreaTextureNor,
    normalScale: new THREE.Vector2(0.7,0.7),
})

//Paredes

const paredeTextureDiff = textureLoader.load('./assets/textures/stone_wall_diff_2k.png')
const paredeTextureNor = textureLoader.load('./assets/textures/stone_wall_nor_dx_2k.png')
const paredeTextureDisp = textureLoader.load('./assets/textures/stone_wall_disp_2k.png')
const paredeTextureAo = textureLoader.load('./assets/textures/stone_wall_ao_2k.png')
const paredeTextureRough = textureLoader.load('./assets/textures/stone_wall_rough_2k.png')

auxArray = [paredeTextureDiff, paredeTextureNor, paredeTextureRough , paredeTextureDisp, paredeTextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(0.5,0.5)
}

export const ParedeMaterial = new THREE.MeshStandardMaterial({

    map: paredeTextureDiff,
    normalMap: paredeTextureNor,
    normalScale: new THREE.Vector2(1,1),
    displacementMap: paredeTextureDisp,
    displacementScale: 0.01,
    roughnessMap: paredeTextureRough,
    roughness: 0,
    aoMap: paredeTextureAo,
})


//Area 1

const Area2TextureDiff = textureLoader.load('./assets/textures/PisoArea2.jpg')
const Area2TextureNor = textureLoader.load('./assets/textures/Area2Normal.png')

auxArray = [Area2TextureDiff, Area2TextureNor]

for(let i = 0; i < 2; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(21,21)
    auxArray[i].offset.set(38.5,38.5)
}

export const Area2Material = new THREE.MeshStandardMaterial({
    map: Area2TextureDiff,
    normalMap: Area2TextureNor,
    normalScale: new THREE.Vector2(1.2,1.2),
})

//Paredes

const underTextureDiff = textureLoader.load('./assets/textures/Ice003_2K_Color.png')
const underTextureNor = textureLoader.load('./assets/textures/Ice003_2K_NormalDX.png')
const underTextureDisp = textureLoader.load('./assets/textures/Ice003_2K_Displacement.png')
const underTextureRough = textureLoader.load('./assets/textures/Ice003_2K_Roughness.png')

auxArray = [underTextureDiff, underTextureNor, underTextureRough , underTextureDisp]

for(let i = 0; i < 4; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(50,50)
}

export const underMaterial = new THREE.MeshStandardMaterial({

    map: underTextureDiff,
    normalMap: underTextureNor,
    normalScale: new THREE.Vector2(1,1),
    displacementMap: underTextureDisp,
    displacementScale: 0.5,
    roughnessMap: underTextureRough,
    roughness: 0,
})

//Tabua

const tabuaTextureDiff = textureLoader.load('./assets/textures/Wood060_2K_Color.jpg')
const tabuaTextureNor = textureLoader.load('./assets/textures/Wood060_2K_NormalGL.jpg')
const tabuaTextureDisp = textureLoader.load('./assets/textures/Wood060_2K_Displacement.jpg')
const tabuaTextureAo = textureLoader.load('./assets/textures/Wood060_2K_AmbientOcclusion.jpg')
const tabuaTextureRough = textureLoader.load('./assets/textures/Wood060_2K_Roughness.jpg')

auxArray = [tabuaTextureDiff, tabuaTextureNor, tabuaTextureRough , tabuaTextureDisp, tabuaTextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(0.5,0.5)
    auxArray[i].rotation = THREE.MathUtils.degToRad(90);
}

export const tabuaMaterial = new THREE.MeshStandardMaterial({
    map: tabuaTextureDiff,
    roughnessMap: tabuaTextureRough,
    roughness: 0,
    aoMap: tabuaTextureAo,
})

//Portal

const portalTextureDiff = textureLoader.load('./assets/textures/Bricks075A_2K_Color.png')
const portalTextureNor = textureLoader.load('./assets/textures/Bricks075A_2K_NormalDX.png')
const portalTextureDisp = textureLoader.load('./assets/textures/Bricks075A_2K_Displacement.png')
const portalTextureAo = textureLoader.load('./assets/textures/Bricks075A_2K_AmbientOcclusion.png')
const portalTextureRough = textureLoader.load('./assets/textures/Bricks075A_2K_Roughness.png')

auxArray = [portalTextureDiff, portalTextureNor, portalTextureRough , portalTextureDisp, portalTextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(4,4)
    auxArray[i].rotation = THREE.MathUtils.degToRad(90);
}

export const portalMaterial = new THREE.MeshStandardMaterial({
    map: portalTextureDiff,
    normalMap: portalTextureNor,
    normalScale: new THREE.Vector2(1,1),
    roughnessMap: portalTextureRough,
    roughness: 0,
})

//Escada

const escadaTextureDiff = textureLoader.load('./assets/textures/Concrete032_1K_Color.jpg')
const escadaTextureNor = textureLoader.load('./assets/textures/Concrete032_1K_NormalDX.jpg')
const escadaTextureDisp = textureLoader.load('./assets/textures/Concrete032_1K_Displacement.jpg')
const escadaTextureAo = textureLoader.load('./assets/textures/Concrete032_1K_AmbientOcclusion.jpg')
const escadaTextureRough = textureLoader.load('./assets/textures/Concrete032_1K_Roughness.jpg')

auxArray = [escadaTextureDiff, escadaTextureNor, escadaTextureRough , escadaTextureDisp, escadaTextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(4,4)
    auxArray[i].rotation = THREE.MathUtils.degToRad(90);
}

export const escadaMaterial = new THREE.MeshStandardMaterial({
    map: escadaTextureDiff,
    normalMap: escadaTextureNor,
    normalScale: new THREE.Vector2(1,1),
    roughnessMap: escadaTextureRough,
    roughness: 0,
})


const Area3TextureDiff = textureLoader.load('./assets/textures/PisoArea3.jpg')
const Area3TextureNor = textureLoader.load('./assets/textures/NormalArea3.png')

auxArray = [Area3TextureDiff, Area3TextureNor]

for(let i = 0; i < 2; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(21,21)
    auxArray[i].offset.set(70.52,70.52)
}

export const Area3Material = new THREE.MeshStandardMaterial({
    map: Area3TextureDiff,
    normalMap: Area3TextureNor,
    normalScale: new THREE.Vector2(1,1),

})

//PISO Area3

const Area4TextureDiff = textureLoader.load('./assets/textures/PisoArea4.jpg')
const Area4TextureNor = textureLoader.load('./assets/textures/Area4Normal.png')

auxArray = [Area4TextureDiff, Area4TextureNor]

for(let i = 0; i < 2; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(10.48,10.48)
    auxArray[i].offset.set(1.5,1.5)
}

export const Area4Material = new THREE.MeshStandardMaterial({
    map: Area4TextureDiff,
    normalMap: Area4TextureNor,
    normalScale: new THREE.Vector2(0.7,0.7),
})


const parede1TextureDiff = textureLoader.load('./assets/textures/brick_4_diff_2k.jpg')
const parede1TextureNor = textureLoader.load('./assets/textures/brick_4_nor_gl_2k.jpg')
const parede1TextureDisp = textureLoader.load('./assets/textures/brick_4_disp_2k.jpg')
const parede1TextureAo = textureLoader.load('./assets/textures/brick_4_ao_2k.jpg')
const parede1TextureRough = textureLoader.load('./assets/textures/brick_4_rough_2k.jpg')

auxArray = [parede1TextureDiff, parede1TextureNor, parede1TextureRough , parede1TextureDisp, parede1TextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(0.5,0.5)
}

export const Parede1Material = new THREE.MeshStandardMaterial({

    map: parede1TextureDiff,
    normalMap: parede1TextureNor,
    normalScale: new THREE.Vector2(1,1),
    displacementMap: parede1TextureDisp,
    displacementScale: 0.01,
    roughnessMap: parede1TextureRough,
    roughness: 0,
    aoMap: parede1TextureAo,
})

const parede2TextureDiff = textureLoader.load('./assets/textures/random_bricks_thick_diff_2k.jpg')
const parede2TextureNor = textureLoader.load('./assets/textures/random_bricks_thick_nor_gl_2k.jpg')
const parede2TextureDisp = textureLoader.load('./assets/textures/random_bricks_thick_disp_2k.jpg')
const parede2TextureAo = textureLoader.load('./assets/textures/random_bricks_thick_ao_2k.jpg')
const parede2TextureRough = textureLoader.load('./assets/textures/random_bricks_thick_rough_2k.jpg')

auxArray = [parede2TextureDiff, parede2TextureNor, parede2TextureRough , parede2TextureDisp, parede2TextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(0.5,0.5)
}

export const Parede2Material = new THREE.MeshStandardMaterial({

    map: parede2TextureDiff,
    normalMap: parede2TextureNor,
    normalScale: new THREE.Vector2(1,1),
    displacementMap: parede2TextureDisp,
    displacementScale: 0.01,
    roughnessMap: parede2TextureRough,
    roughness: 0,
    aoMap: parede2TextureAo,
})

const parede3TextureDiff = textureLoader.load('./assets/textures/cracked_concrete_wall_diff_2k.jpg')
const parede3TextureNor = textureLoader.load('./assets/textures/cracked_concrete_wall_nor_gl_2k.jpg')
const parede3TextureDisp = textureLoader.load('./assets/textures/cracked_concrete_wall_disp_2k.jpg')
const parede3TextureAo = textureLoader.load('./assets/textures/cracked_concrete_wall_ao_2k.jpg')
const parede3TextureRough = textureLoader.load('./assets/textures/cracked_concrete_wall_rough_2k.jpg')

auxArray = [parede3TextureDiff, parede3TextureNor, parede3TextureRough , parede3TextureDisp, parede3TextureAo]

for(let i = 0; i < 5; i++){
    auxArray[i].wrapS = THREE.RepeatWrapping;
    auxArray[i].wrapT = THREE.RepeatWrapping;
    auxArray[i].minFilter = THREE.NearestFilter;
    auxArray[i].maxFilter = THREE.NearestFilter;
    auxArray[i].repeat.set(0.5,0.5)
}

export const Parede3Material = new THREE.MeshStandardMaterial({

    map: parede3TextureDiff,
    normalMap: parede3TextureNor,
    normalScale: new THREE.Vector2(1,1),
    displacementMap: parede3TextureDisp,
    displacementScale: 0.01,
    roughnessMap: parede3TextureRough,
    roughness: 0,
    aoMap: parede3TextureAo,
})