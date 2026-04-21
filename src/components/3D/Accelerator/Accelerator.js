import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/store";

const Accelerator = ({ position, rotation }) => {
  const acceleratorRef = useRef();
  const { models } = useGameStore();

  useEffect(() => {
      const model = models.find(model => model.name === 'accelerator')
    
      if(model){
        const object = model.scene.clone()
        acceleratorRef.current.add(object)
      }

  }, [models]);

  return (
    <RigidBody
      position={position}
      rotation={rotation}
      colliders={false}
      type="fixed"
      userData={{ isSpeed: true, speedFactor: 1.5 }}
    >
      <CuboidCollider
        rotation={[0, 0 * Math.PI, 0.5 * Math.PI]}
        position={[0, -0.08, 0]}
        args={[0.01, 3, 2.75]}
      />
      <group
        scale={0.06}
        ref={acceleratorRef}
        rotation={[0.088 * Math.PI, 0.21 * Math.PI, 0.865 * Math.PI]}
      />
    </RigidBody>
  );
};

export default Accelerator;
