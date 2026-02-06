import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/store";

const Thwomp = ({ position, rotation }) => {
  
  const { models } = useGameStore()
  const thwompRef = useRef();
  const bodyRef = useRef();
  const offset = Math.random();

  useEffect(() => {
      const model = models.find(model => model.name === 'thwomp')
      if(model){
        const object = model.scene.clone()
        thwompRef.current.add(object)
      }
  }, [models]);

  useFrame((state) => {
    if(bodyRef.current){
      const time = state.clock.getElapsedTime()
      bodyRef.current.setNextKinematicTranslation({x: position[0], y: Math.sin(time + offset) + position[1], z: position[2]})
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      rotation={rotation}
      type="kinematicPosition"
    >
      <CuboidCollider args={[1.3, 1.6, 0.6]} />
      <group scale={0.003} ref={thwompRef} />
    </RigidBody>
  );
};

export default Thwomp;
