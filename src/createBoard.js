import * as THREE from 'three';
import * as CANNON from 'cannon'; // Import Cannon.js

export const createWall = ({world, rotation, location}) => {
    const groundGEo = new THREE.PlaneGeometry(15,15)
    const groundMat = new THREE.MeshBasicMaterial({
        color:0xffffff,
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