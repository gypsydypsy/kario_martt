import { useGameStore } from "@/store/store";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { BallCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import vertex from "../../../../public/shaders/explosion/vertex.glsl";
import fragment from "../../../../public/shaders/explosion/fragment.glsl";
import { socket } from "@/socket";

const EXPLOSION_DURATION = 2500;
const EXPLOSION_RADIUS = 50;

const Bobomb = ({ position, direction, id }) => {
  const bombRef = useRef();
  const bodyRef = useRef();
  const explosionRef = useRef();
  const shaderRef = useRef();

  const [isExploded, setIsExploded] = useState(false);
  const [impactPosition, setImpactPosition] = useState(null);
  const [impactTime, setImpactTime] = useState(null);
  const { models } = useGameStore();

  const handleCollision = (data) => {
    if (!isExploded) {
      setIsExploded(true);
      const bombPosition = bodyRef.current.translation();
      setImpactPosition(
        new THREE.Vector3(bombPosition.x, bombPosition.y, bombPosition.z)
      );

      setTimeout(() => {
        socket.emit("removeTrap", id);
      }, EXPLOSION_DURATION);
    }
  };

  useEffect(() => {
    const model = models.find((model) => model.name === "bobomb");

    if (model) {
      const object = model.scene.clone();
      bombRef.current.add(object);
    }
  }, [models]);

  useEffect(() => {
    bodyRef.current.applyImpulse({
      x: direction.x * 10,
      y: 3 + direction.y * 10,
      z: direction.z * 10,
    });
  }, []);

  useFrame((state) => {
    if (isExploded && explosionRef.current && impactPosition) {
      explosionRef.current.setTranslation({
        x: impactPosition.x,
        y: impactPosition.y,
        z: impactPosition.z,
      });
    }

    if (shaderRef.current) {
      const time = state.clock.getElapsedTime();
      if (!impactTime) setImpactTime(time);
      shaderRef.current.uniforms.u_time.value = time - impactTime;
      shaderRef.current.uniforms.u_center.value = [
        impactPosition.x,
        impactPosition.y,
        impactPosition.z,
      ];
    }
  });

  return (
    <>
      {/* Bomb */}
      <RigidBody
        ref={bodyRef}
        colliders={false}
        position={position}
        onIntersectionEnter={(data) => handleCollision(data)}
      >
        {/* Bomb */}
        <BallCollider sensor args={[0.4, 0.4, 0.4]} />
        <group
          scale={0.1}
          ref={bombRef}
          position={[0, 0.1, -0.2]}
          visible={!isExploded}
        />
      </RigidBody>
      {/* Explosion */}
      {isExploded && (
        <RigidBody
          colliders={false}
          userData={{ isSwing: true, swingDelay: EXPLOSION_DURATION }}
          ref={explosionRef}
          type="fixed"
        >
          <mesh>
            <sphereGeometry args={[EXPLOSION_RADIUS, 32, 32]} />
            <shaderMaterial
              ref={shaderRef}
              vertexShader={vertex}
              fragmentShader={fragment}
              transparent={true}
              alphaTest={0.1}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide} // Rendu des deux côtés
              uniforms={{
                u_time: { value: 0 },
                u_center: { value: [0, 0, 0] },
                u_radius: { value: EXPLOSION_RADIUS },
                u_duration: { value: EXPLOSION_DURATION / 1000 },
              }}
            />
          </mesh>
          <CylinderCollider
            sensor={true}
            args={[0.05, EXPLOSION_RADIUS, EXPLOSION_RADIUS]}
            position={[0, -0.2, 0]}
          />
        </RigidBody>
      )}
    </>
  );
};

export default Bobomb;
