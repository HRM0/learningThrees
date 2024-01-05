 import { render } from "react-dom"
import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { createSphere, createPhysicsWorld } from "./createSphere";
import { createWall } from "./createBoard";
import * as CANNON from 'cannon';

// Set up animation parameters
let speedX = 0.05;
let speedY = 0.03;

//create scene
 const scene = new THREE.Scene()

//create Physics world
const world = createPhysicsWorld()

//create sphere
 const sphere = createSphere({
    radius:1,
    world:world,
    location: { x: 0, y: -4, z: 0 }
})
 scene.add(sphere.mesh)

//size
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

//light
const light = new THREE.PointLight(0xFFFFFF,100,100)
light.position.set(0,10,10)
scene.add(light)

 //camera
 const camera = new THREE.PerspectiveCamera(
    45,
    size.width/size.height
)
 camera.position.z = 50
 camera.position.y = 10
 scene.add(camera)

 //renderer
 const canvas = document.querySelector('.webgl')
 const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(size.width,size.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//resize
window.addEventListener('resize', () => {
    //update sizes
    size.width = window.innerWidth
    size.height = window.innerHeight
    //update camera
    camera.aspect = size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
})

//create wall
const bottom = createWall({
    world:world,
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    location: { x: 0, y: -10, z: 0 }
})
scene.add(bottom.mesh)

//create wall
const top = createWall({
    world:world,
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    location: { x: 0, y: 10, z: 0 }
})
scene.add(top.mesh)

const groundSphereContactMat = new CANNON.ContactMaterial(
    sphere.phyMat,
    bottom.phyMat,
    {restitution: 1}
)

const roofSphereContactMat = new CANNON.ContactMaterial(
    sphere.phyMat,
    top.phyMat,
    {restitution: 1}
)

world.addContactMaterial(groundSphereContactMat)
world.addContactMaterial(roofSphereContactMat)

const timestep = 1/60

const loop = () => {
    //controls.update()

    world.step(timestep)
    sphere.update()
    bottom.update()
    top.update()
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

loop()