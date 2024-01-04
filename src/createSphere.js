import * as THREE from 'three';
import * as CANNON from 'cannon'; // Import Cannon.js

export const createSphere = (radius,world) => {
  //create sphere
  const geometry = new THREE.SphereGeometry(radius,64,64)
  const material = new THREE.MeshStandardMaterial({
      color:"#00ff83",
  })
  const sphereMesh = new THREE.Mesh(geometry,material)

  const spherePhysMat = new CANNON.Material()
  const sphereBody = new CANNON.Body({ 
    mass: 10, 
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(0,15,0),
    material: spherePhysMat
  });
  
  world.addBody(sphereBody);

  const update = () => {
    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
  }

  return {
    mesh:sphereMesh,
    update:update,
    phyMat:spherePhysMat
  };
};