import * as THREE from 'three';
import * as CANNON from 'cannon'; // Import Cannon.js

export const createPhysicsWorld = () => {
  const world = new CANNON.World();
  world.gravity.set(0, 0, 0); // No gravity in this example

  return world;
};

export const createSphere = ({radius,world,location}) => {
  //create sphere
  const geometry = new THREE.SphereGeometry(radius,64,64)
  const material = new THREE.MeshStandardMaterial({
      color:"#00ff83",
  })
  const sphereMesh = new THREE.Mesh(geometry,material)

  const spherePhysMat = new CANNON.Material()
  const sphereBody = new CANNON.Body({ 
    mass: 1, 
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(location.x,location.y,location.z),
    material: spherePhysMat
  });
  
  world.addBody(sphereBody);

  // Set the initial velocity downward
  sphereBody.velocity.copy(new CANNON.Vec3(0, -10, 0));

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