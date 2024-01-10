import * as THREE from 'three';
import * as CANNON from 'cannon-es'; // Import Cannon.js

export const createWall = ({world, rotation, location, length, height}) => {
    const groundGEo = new THREE.PlaneGeometry(length,height)
    const groundMat = new THREE.MeshBasicMaterial({
        color:0x808080,
        side: THREE.DoubleSide,
        wireframe:true
    })
    const groundMesh =new THREE.Mesh(groundGEo, groundMat)
    
    const groundPhysMat = new CANNON.Material()
    
    const groundBody = new CANNON.Body({
        mass:0,
        shape: new CANNON.Plane(),
        type: CANNON.Body.STATIC,
        material:groundPhysMat,
        position:new CANNON.Vec3(location.x, location.y, location.z)
    })
    world.addBody(groundBody)
    groundBody.quaternion.setFromEuler(rotation.x,rotation.y,rotation.z)

  const update = () => {
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)
  }

  return {
    mesh:groundMesh,
    update:update,
    phyMat:groundPhysMat
  };
};

export const createBoard = (scene,world) => {
    //create wall
    const bottom = createWall({
        world:world,
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        location: { x: 0, y: -7.5, z: 0 },
        length:15,
        height:5
    })
    scene.add(bottom.mesh)

    //create wall
    const top = createWall({
        world:world,
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        location: { x: 0, y: 7.5, z: 0 },
        length:15,
        height:5
    })
    scene.add(top.mesh)

    //create wall
    const left = createWall({
        world:world,
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        location: { x: -7.5, y: 0, z: 0 },
        length:5,
        height:15
    })
    scene.add(left.mesh)

    //create wall
    const right = createWall({
        world:world,
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        location: { x: 7.5, y: 0, z: 0 },
        length:5,
        height:15
    })
    scene.add(right.mesh)

    const board ={
        top:top,
        bottom:bottom,
        left:left,
        right:right
    }
    return board
}