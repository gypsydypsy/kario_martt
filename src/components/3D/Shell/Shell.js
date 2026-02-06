import { useEffect, useRef, useState } from "react";
import { BallCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/store/store";
import { socket } from "@/socket";

const Shell = ({ position, direction, id }) => {
  const shellRef = useRef();
  const bodyRef = useRef();

  const { models } = useGameStore();

  useEffect(() => {
    const model = models.find((model) => model.name === "shell");

    if (model) {
      const object = model.scene.clone();
      shellRef.current.add(object);
    }
  }, [models]);

  const handleCollision = (data) => {
    if (data.collider["_parent"].userData?.isPlayer) {
      setTimeout(() => {
        socket.emit("removeTrap", id);
      }, 500);
    }
  };
  useEffect(() => {
    bodyRef.current.applyImpulse({
      x: direction.x * 5,
      y: direction.y * 5,
      z: direction.z * 5,
    });
  }, []);

  return (
    <RigidBody
      colliders={false}
      position={position}
      userData={{ isSwing: true, swingDelay: 500 }}
      onCollisionEnter={(data) => handleCollision(data)}
      lockRotations={true}
      ref={bodyRef}
    >
      <BallCollider args={[0.25, 0.25, 0.25]} sensor={false} />
      <CylinderCollider
        args={[0.01, 1, 1]}
        position={[0, -0.24, 0]}
        sensor={true}
      />
      <group ref={shellRef} />
    </RigidBody>
  );
};

export default Shell;
