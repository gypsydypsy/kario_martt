import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/store/store";

const Tremplin = ({ position, rotation }) => {
  const tremplinRef = useRef();
  const { models } = useGameStore();
  
   useEffect(() => {
      const model = models.find(model => model.name === 'tremplin')
    
      if(model){
        const object = model.scene.clone()
        tremplinRef.current.add(object)
      }
  }, [models]);
  
  return (
    <RigidBody
      position={position}
      rotation={rotation}
      colliders={false}
      type="fixed"
      userData={{ isSpeed: true, speedFactor: 1 }}
    >
      <CuboidCollider
        rotation={[0, -rotation[1], -0.41 * Math.PI]}
        args={[0.05, 1.15, 3.65]}
      />
      <CuboidCollider
        position={[-0.8, 0, 0.8]}
        rotation={[0, -rotation[1], 0]}
        args={[0.05, 0.2, 3.65]}
      />
      <group scale={0.06} ref={tremplinRef} />
    </RigidBody>
  );
};

export default Tremplin;
