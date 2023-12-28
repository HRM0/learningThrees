 import { render } from "react-dom"
import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// Set up animation parameters
let speedX = 0.05;
let speedY = 0.03;

//create scene
 const scene = new THREE.Scene()

//create sphere
 const geometry = new THREE.SphereGeometry(3,64,64)
 const material = new THREE.MeshStandardMaterial({
    color:"#00ff83",
 })
 const mesh = new THREE.Mesh(geometry,material)
 scene.add(mesh)

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

const loop = () => {
    //controls.update()

    // Update sphere position
    mesh.position.x += speedX;
    mesh.position.y += speedY;

    // Bounce off the walls
    if (mesh.position.x > 4 || mesh.position.x < -4) {
        speedX *= -1;
    }

    if (mesh.position.y > 4 || mesh.position.y < -4) {
        speedY *= -1;
    }
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

loop()