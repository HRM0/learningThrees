 import { render } from "react-dom"
import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { createSphere, createPhysicsWorld } from "./createSphere";
import { createBoard, createWall } from "./createBoard";
import * as CANNON from 'cannon';

// Set up animation parameters
let speedX = 0.05;
let speedY = 0.03;

//create scene
 const scene = new THREE.Scene()

//create Physics world
const world = createPhysicsWorld()

//create sphere
const spheres = [createSphere({
    radius:.5,
    world:world,
    scene:scene,
    location: { x: 0, y: -4, z: 0 }
})]
 

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

//creating the board and adding physics
const addContact = (obj1, obj2, restitution ) => {
    world.addContactMaterial(new CANNON.ContactMaterial(
        obj1,
        obj2,
        {restitution: restitution}
    ))
}

const board = createBoard(scene,world)
addContact(spheres[0].phyMat,spheres[0].phyMat,1)
spheres.forEach((sphere) => {
    Object.entries(board).forEach( ([key,value]) => {
        addContact(sphere.phyMat, board[key].phyMat, 1)
    })
})

const mouse =new THREE.Vector2()
const intersectionPoint = new THREE.Vector3()
const planeNormal = new THREE.Vector3()
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()

window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX/window.innerWidth) * 2 -1,
    mouse.y = (e.clientY/window.innerHeight) * 2 + 1
    planeNormal.copy(camera.position).normalize()
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(plane, intersectionPoint)
})

window.addEventListener('click', function(e) {
    console.log("click")
    const newSphere = createSphere({
        radius:.5,
        world:world,
        scene:scene,
        location: { x: 0, y: -4, z: 0 }
    })
    Object.entries(board).forEach( ([key,value]) => {
        addContact(newSphere.phyMat, board[key].phyMat, 1)
    })
    spheres.push(newSphere)
})

const timestep = 1/60

const loop = () => {
    //controls.update()

    world.step(timestep)
    spheres.forEach((sphere) => {
        sphere.update()
    })
    board.bottom.update()
    board.top.update()
    board.left.update()
    board.right.update()
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

loop()