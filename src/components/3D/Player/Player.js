import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/store";
import charactersConfig from "@/config/characters";
import { socket } from "@/socket";
import { Text3D } from "@react-three/drei";

const Player = ({ position, rotation, character, id, name }) => {
  const { models } = useGameStore();

  /* Character config */
  const charConfig = charactersConfig.find((el) => el.name === character);

  const bodyRef = useRef();
  const nameRef= useRef();
  const characterModel = useRef();
  const kartModel = useRef();

  const playerPosition = useRef();
  const playerRotation = useRef();

  /* Update position from socket */
  useEffect(() => {
    const handler = (players) => {
      // Get Character position
      let matchingPlayer = players.find((player) => player.id === id);
      playerPosition.current = matchingPlayer.position;
      playerRotation.current = matchingPlayer.rotation;
    };

    socket.on("updatePlayers", handler);

    return () => {
      socket.off("updatePlayers", handler);
    };
  }, []);

  /* Add models */
  useEffect(() => {
    if (models.length) {
      // Add kart
      const car = models.find((model) => model.name === "kart");
      if (car) {
        let newKart = car.scene.clone();
        kartModel.current.add(newKart);
      }

      // Add Character
      const char = models.find((model) => model.name === character);
      if (char) {
        let newCharacter = char.scene.clone();
        characterModel.current.add(newCharacter);
      }
    }

    if(nameRef.current){
      const box = new THREE.Box3().setFromObject(nameRef.current); 
      const width = box.max.z - box.min.z; 
      nameRef.current.position.z = width * 0.5; 
    }
  }, [models]);

  useFrame((state, delta) => {
    if (bodyRef.current) {
      const t = 1.0 - Math.pow(0.01, delta);

      if (playerPosition.current) {
        let currentPosition = bodyRef.current.translation();
        let targetPosition = new THREE.Vector3()
          .copy(currentPosition)
          .lerp(playerPosition.current, t);
        bodyRef.current.setTranslation(targetPosition, true);
      }
      if (playerRotation.current) {
        let { x, y, z, w } = bodyRef.current.rotation();
        let currentRot = new THREE.Quaternion(x, y, z, w);
        let targetRotation = currentRot
          .clone()
          .slerp(
            new THREE.Quaternion(
              playerRotation.current[0],
              playerRotation.current[1],
              playerRotation.current[2],
              playerRotation.current[3]
            ),
            t
          );
        bodyRef.current.setRotation(targetRotation, true);
      }
    }
  });

  return (
    <RigidBody
      position={position}
      rotation={rotation}
      canSleep={false}
      ref={bodyRef}
      colliders={false}
      mass={2000}
      type="dynamic"
      userData={{ isPlayer: true, id }}
    >
      <CuboidCollider args={[0.75, 0.1, 0.4]} position={[0, -0.1, 0]} />

      {/* Character */}
      <group
        scale={charConfig.scale}
        position={charConfig.position}
        rotation={charConfig.rotation}
      >
        <group ref={characterModel} rotation={[0, -Math.PI * 0.5, 0]} />
      </group>

      {/* Kart */}
      <group ref={kartModel} scale={0.8} rotation={[0, -Math.PI * 0.5, 0]} />

      {/* Players name */}
      <Text3D
        ref={nameRef}
        scale={0.15}
        position={[0.8, -0.15, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        font="/fonts/roboto.json"
      >
        {name}
      </Text3D>
    </RigidBody>
  );
};

export default Player;
