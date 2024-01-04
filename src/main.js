 import { render } from "react-dom"
import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { createSphere } from "./createSphere";
import { createPhysicsWorld } from "./physics";
import * as CANNON from 'cannon';

// Set up animation parameters
let speedX = 0.05;
let speedY = 0.03;

//create scene
 const scene = new THREE.Scene()

//create Physics world
const world = createPhysicsWorld()

//create sphere
 const sphere = createSphere(1,world)
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
 camera.position.z = 20
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


const groundGEo = new THREE.PlaneGeometry(15,15)
const groundMat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    side: THREE.DoubleSide,
    wireframe:true
})
const groundMesh =new THREE.Mesh(groundGEo, groundMat)
scene.add(groundMesh)

const groundPhysMat = new CANNON.Material()

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    material:groundPhysMat,
    position:new CANNON.Vec3(0, -5, 0)
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2,0,0)

const groundSphereContactMat = new CANNON.ContactMaterial(
    sphere.phyMat,
    groundPhysMat,
    {restitution: 0.9}
)

world.addContactMaterial(groundSphereContactMat)

const timestep = 1/60

const loop = () => {
    //controls.update()

    world.step(timestep)
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)

    sphere.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

loop()