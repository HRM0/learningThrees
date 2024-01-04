import * as CANNON from 'cannon';

export const createPhysicsWorld = () => {
  const world = new CANNON.World();
  world.gravity.set(0, -9.81, 0); // No gravity in this example

  return world;
};

export const createSphereWithPhysics = (world, radius) => {
    const sphereShape = new CANNON.Sphere(radius);
    const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape });
  
    world.addBody(sphereBody);
  
    return sphereBody;
  };