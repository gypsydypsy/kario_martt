import { socket } from "@/socket";
import { useGameStore } from "@/store/store";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

const Banana = ({ position, id }) => {
  const bananaRef = useRef();
  const { models } = useGameStore();

  useEffect(() => {
    const model = models.find((model) => model.name === "banana");

    if (model) {
      const object = model.scene.clone();
      bananaRef.current.add(object);
    }
  }, [models]);

  const handleCollision = (data) => {
    if (data.collider["_parent"].userData?.isPlayer) {
      setTimeout(() => {
        socket.emit("removeTrap", id);
      }, 500);
    }
  };

  return (
    <RigidBody
      colliders={false}
      position={position}
      userData={{ isSwing: true, swingDelay: 500 }}
      // sensor={true}
      onCollisionEnter={(data) => handleCollision(data)}
    >
      <CuboidCollider args={[1, 0.01, 1]} position={[0, -0, 0]} />

      <group
        scale={0.0018}
        rotation={[0, -0.5 * Math.PI, 0]}
        position={[0, 0.4, 0]}
        ref={bananaRef}
      />
    </RigidBody>
  );
};

export default Banana;
