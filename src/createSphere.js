import * as THREE from 'three';
import * as CANNON from 'cannon-es';// Import Cannon.js

export const createPhysicsWorld = () => {
  const world = new CANNON.World();
  world.gravity.set(0, 0, 0); // No gravity in this example

  return world;
};

export const createSphere = ({radius,world,location, scene}) => {
  //create sphere
  const geometry = new THREE.SphereGeometry(radius,32,32)
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
  sphereBody.velocity.copy(new CANNON.Vec3(-10, -10, 0));
  
  const update = () => {
    //sphereBody.velocity = new CANNON.Vec3(sphereBody.velocity.x, sphereBody.velocity.y, 0);
    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
  }

  scene.add(sphereMesh)
  return {
    mesh:sphereMesh,
    update:update,
    phyMat:spherePhysMat
  };
};

export const createBox = ({world,position, scene}) => {
  //create box
  const geometry = new THREE.BoxGeometry(2,2,5)
  const material = new THREE.MeshStandardMaterial({
      color:"#00ff83",
  })
  
  
  const boxMesh = new THREE.Mesh(geometry,material)

  const boxPhysMat = new CANNON.Material()
  const boxBody = new CANNON.Body({ 
    type: CANNON.Body.STATIC, 
    shape: new CANNON.Box(new CANNON.Vec3(1,1,2.5)),
    position: position,
    material: boxPhysMat
  });
  
  world.addBody(boxBody);

  const update = () => {
    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)
  }

  scene.add(boxMesh)
  return {
    mesh:boxMesh,
    update:update,
    phyMat:boxPhysMat
  };
};