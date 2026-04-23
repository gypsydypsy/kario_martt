import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVehicle } from "@/hooks/useVehicle";
import * as rapier from "@dimforge/rapier3d-compat";
import { useGameStore } from "@/store/store";
import uniqid from "uniqid";
import charactersConfig from "@/config/characters";
import { socket } from "@/socket";
import {
  FIRST_PERSON_CAMERA_POSITION,
  FIRST_PERSON_CAMERA_ROTATION,
  TOP_VIEW_CAMERA_POSITION,
  TOP_VIEW_CAMERA_ROTATION,
} from "@/config/camera";

const ACCELERATION_FORCE = 0.5;
const STEER_ANGLE = Math.PI / 84;
const BRAKE_FORCE = 0.05;
const SUSPENSION_REST_LENGTH = 0.08;
const SUSPENSION_STIFFNESS = 24;
const SUSPENSION_MAX_TRAVEl = 1;

const IDLENESS_THRESHOLD = 60 * 5;


const wheelsConfig = [
  {
    name: "RIGHT_FRONT",
    isFront: true,
    position: new THREE.Vector3(-0.26, -0.1, -0.4),
    axleCs: new THREE.Vector3(0, 0, -1),
    suspensionRestLength: SUSPENSION_REST_LENGTH,
    suspensionStiffness: SUSPENSION_STIFFNESS,
    maxSuspensionTravel: SUSPENSION_MAX_TRAVEl,
    radius: 0.13,
  },
  {
    name: "LEFT_FRONT",
    isFront: true,
    position: new THREE.Vector3(-0.26, -0.1, 0.4),
    axleCs: new THREE.Vector3(0, 0, -1),
    suspensionRestLength: SUSPENSION_REST_LENGTH,
    suspensionStiffness: SUSPENSION_STIFFNESS,
    maxSuspensionTravel: SUSPENSION_MAX_TRAVEl,
    radius: 0.13,
  },
  {
    name: "RIGHT_BACK",
    isFront: false,
    position: new THREE.Vector3(0.37, -0.1, -0.4),
    axleCs: new THREE.Vector3(0, 0, -1),
    suspensionRestLength: SUSPENSION_REST_LENGTH,
    suspensionStiffness: SUSPENSION_STIFFNESS,
    maxSuspensionTravel: SUSPENSION_MAX_TRAVEl,
    radius: 0.13,
  },
  {
    name: "LEFT_BACK",
    isFront: false,
    position: new THREE.Vector3(0.37, -0.1, 0.4),
    axleCs: new THREE.Vector3(0, 0, -1),
    suspensionRestLength: SUSPENSION_REST_LENGTH,
    suspensionStiffness: SUSPENSION_STIFFNESS,
    maxSuspensionTravel: SUSPENSION_MAX_TRAVEl,
    radius: 0.13,
  },
];

const LocalPlayer = ({
  position,
  rotation,
  id,
  character,
  cameraDebug,
  debug,
}) => {
  const { models, gift, updateGift, circuit, idleness, updateIdleness } = useGameStore();

  /* Character config */
  const charConfig = charactersConfig.find((el) => el.name === character);

  /* State */
  const [isFirstPersonView, setIsFirstPersonView] = useState(false);
  const [canSwing, setCanSwing] = useState(true);

  /* Meshes and Bodies */
  const bodyRef = useRef();
  const wheelsRef = useRef([]);

  /* Models */
  const chassisModel = useRef();
  const wheelModels = useRef([]);
  const characterModel = useRef();
  const steeringWheelModel = useRef();

  /* Controls */
  const [_, getKeys] = useKeyboardControls();
  const { vehicleController } = useVehicle(bodyRef, wheelsRef, wheelsConfig);
  const { world } = useRapier();

  /* Idleness */
  const idlenessCount = useRef(0);

  /* Add models */
  useEffect(() => {
    if (models.length) {
      // Add kart
      const car = models.find((model) => model.name === "kart");

      if (car) {
        let back_left_wheel,
          back_right_wheel,
          front_right_wheel,
          front_left_wheel,
          chassis,
          steering_wheel;

        car.scene.traverse((child) => {
          if (child.name) {
            switch (child.name) {
              case "BR_tire":
                back_right_wheel = child.clone();
                break;
              case "BL_tire":
                back_left_wheel = child.clone();
                break;
              case "FL_tire":
                front_left_wheel = child.clone();
                break;
              case "FR_tire":
                front_right_wheel = child.clone();
                break;
              case "chassis":
                chassis = child.clone();
                break;
              case "steering_wheel":
                steering_wheel = child.clone();
                break;
              default:
                break;
            }
          }
        });

        const wheels = [
          front_right_wheel,
          front_left_wheel,
          back_right_wheel,
          back_left_wheel,
        ];

        wheels.forEach((wheel, index) => {
          const box = new THREE.Box3().setFromObject(wheel);
          const center = new THREE.Vector3();
          box.getCenter(center);
          wheel.position.sub(center);
          wheelModels.current[index].add(wheel);
        });

        chassisModel.current.add(chassis);

        const box = new THREE.Box3().setFromObject(steering_wheel);
        const center = new THREE.Vector3();
        box.getCenter(center);
        steering_wheel.position.sub(center);
        steeringWheelModel.current.add(steering_wheel);
      }

      const char = models.find((model) => model.name === character);
      if (char) {
        let newCharacter = char.scene.clone();
        characterModel.current.add(newCharacter);
      }
    }
  }, [models]);

  /* Events */
  useEffect(() => {
    /* Init events */
    const handleChangeView = (e) => {
      if (e.key === "m") {
        setIsFirstPersonView((prevState) => !prevState);
      }

      /* Debug */
      if (debug) {
        if (e.key === "o") {
          updateGift("bomb");
        }
        if (e.key === "s") {
          updateGift("shell");
        }
        if (e.key === "b") {
          updateGift("banana");
        }
      }
    };

    document.addEventListener("keydown", handleChangeView);

    return () => document.removeEventListener("keydown", handleChangeView);
  }, []);

  useFrame(() => {
    if (!bodyRef.current || !vehicleController.current) return;

    const chassis = vehicleController.current.chassis();
    const { x, y, z, w } = chassis.rotation();
    const quaternion = new THREE.Quaternion(x, y, z, w);

    const forwardDir = new THREE.Vector3(-1, 0, 0);
    forwardDir.applyQuaternion(quaternion);

    const translation = chassis.translation();

    /* Object collisions */

    const ray = new rapier.Ray(translation, { x: 0, y: -1, z: 0 });
    const raycast = world.castRay(
      ray,
      1,
      false,
      undefined,
      undefined,
      undefined,
      chassis
    );

    if (raycast) {
      const userData = raycast.collider["_parent"].userData;

      if (userData?.isSwing && canSwing) {
        setCanSwing(false);
        bodyRef.current.applyTorqueImpulse({ x: 0, y: 2, z: 0 }, true);
        setTimeout(() => setCanSwing(true), userData.swingDelay);
      }

      if (userData?.isSpeed) {
        bodyRef.current.applyImpulse(
          {
            x: forwardDir.x * userData.speedFactor,
            y: forwardDir.y * userData.speedFactor,
            z: forwardDir.z * userData.speedFactor,
          },
          true
        );
      }
    }

    /* Car controls */

    const { forward, backward, leftward, rightward, brake, reset, useGift } =
      getKeys();

    // Speed
    const engineForce = Number(forward) * ACCELERATION_FORCE - Number(backward);

    vehicleController.current.setWheelEngineForce(0, engineForce);
    vehicleController.current.setWheelEngineForce(1, engineForce);

    // Brake
    const wheelBrake = Number(brake) * BRAKE_FORCE;

    vehicleController.current.setWheelBrake(0, wheelBrake);
    vehicleController.current.setWheelBrake(1, wheelBrake);
    vehicleController.current.setWheelBrake(2, wheelBrake);
    vehicleController.current.setWheelBrake(3, wheelBrake);

    // Steer
    const currentSteering = vehicleController.current.wheelSteering(0) || 0;
    const steerDirection = Number(leftward) - Number(rightward);
    const steering = THREE.MathUtils.lerp(
      currentSteering,
      STEER_ANGLE * steerDirection,
      0.5
    );

    vehicleController.current.setWheelSteering(0, steering);
    vehicleController.current.setWheelSteering(1, steering);

    steeringWheelModel.current.rotation.x = steering * 200;

    /* Reset */
    if (reset) {
      const { x, y, z } = translation;

      const points = circuit.curve.getSpacedPoints(200);
      let closestDist = Infinity;
      let closestIndex = 0;
      let pos = new THREE.Vector3(x, y, z);

      points.forEach((p, i) => {
        const dist = pos.distanceTo(p);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      let resetPosition = points[closestIndex];
      const nextPosition = points[(closestIndex + 1) % points.length];
      const direction = new THREE.Vector3()
        .subVectors(nextPosition, resetPosition)
        .normalize();
      resetPosition.y += 1;
      const angle = 0.5 * Math.PI + Math.atan2(direction.x, direction.z);
      const resetRotation = new THREE.Quaternion();
      resetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

      chassis.setTranslation(new rapier.Vector3(...resetPosition), true);
      chassis.setRotation(resetRotation, true);
      chassis.setLinvel(new rapier.Vector3(0, 0, 0), true);
      chassis.setAngvel(new rapier.Vector3(0, 0, 0), true);
    }

    /* Objects */

    if (useGift) {
      let newTrap = null;

      if (gift === "mushroom") {
        bodyRef.current.applyImpulse(
          {
            x: forwardDir.x * 5,
            y: forwardDir.y * 5,
            z: forwardDir.z * 5,
          },
          true
        );
      }

      if (gift === "shell") {
        let objectPosition = [
          translation.x + forwardDir.x * 2,
          translation.y + forwardDir.y * 2,
          translation.z + forwardDir.z * 2,
        ];

        newTrap = {
          type: "shell",
          id: uniqid(),
          position: objectPosition,
          direction: forwardDir,
        };
      }

      if (gift === "banana") {
        let objectPosition = [
          translation.x - forwardDir.x * 2,
          translation.y - forwardDir.y * 2,
          translation.z - forwardDir.z * 2,
        ];

        newTrap = {
          type: "banana",
          id: uniqid(),
          position: objectPosition,
        };
      }

      if (gift === "bomb") {
        let objectPosition = [
          translation.x + forwardDir.x * 5,
          translation.y + 2,
          translation.z + forwardDir.z * 5,
        ];

        newTrap = {
          type: "bomb",
          id: uniqid(),
          position: objectPosition,
          direction: forwardDir,
        };
      }

      if (newTrap) {
        socket.emit("addTrap", newTrap);
      }

      updateGift(null);
    }

    /* Idleness */
    const velocity = chassis.linvel();
    const speedSq =
      velocity.x * velocity.x +
      velocity.y * velocity.y +
      velocity.z * velocity.z;

    const isStopped = speedSq < 0.0001; // seuil à ajuster
    const hasInput = forward || backward || leftward || rightward || brake;

    if (!hasInput || isStopped) {
      idlenessCount.current += 1;
    } else {
      idlenessCount.current = 0;
    }

    if (idlenessCount.current > IDLENESS_THRESHOLD) {
      updateIdleness(true)
    }
    else if (idleness === true) {
      updateIdleness(false)
    }

    /* Socket update */
    socket.emit("updatePlayerPosition", id, translation, quaternion);
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

      {/* Camera */}
      {!cameraDebug && (
        <group
          rotation={
            isFirstPersonView
              ? FIRST_PERSON_CAMERA_ROTATION
              : TOP_VIEW_CAMERA_ROTATION
          }
        >
          <PerspectiveCamera
            position={
              isFirstPersonView
                ? FIRST_PERSON_CAMERA_POSITION
                : TOP_VIEW_CAMERA_POSITION
            }
            rotation={[0, Math.PI * 0.5, 0]}
            makeDefault
          />
        </group>
      )}

      {/* Steering wheel */}
      <group
        ref={steeringWheelModel}
        rotation={[0, -Math.PI * 0.5, 0]}
        position={[-0.15, 0.18, 0]}
        visible={true}
      />

      {/* Chassis */}
      <group
        scale={0.8}
        ref={chassisModel}
        position={[0.1, -0.2, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
      />

      {/* Character */}
      <group
        scale={charConfig.scale}
        position={charConfig.position}
        visible={!isFirstPersonView}
        rotation={charConfig.rotation}
      >
        <group ref={characterModel} rotation={[0, -Math.PI * 0.5, 0]} />
      </group>

      {/* Wheels */}
      {wheelsConfig.map((wheel, index) => {
        return (
          <group
            key={index}
            ref={(ref) => (wheelsRef.current[index] = ref)}
            position={wheel.position}
          >
            <group
              scale={wheel.isFront ? 0.8 : 0.6}
              rotation={[0, -Math.PI * 0.5, 0]}
              ref={(ref) => (wheelModels.current[index] = ref)}
            />
          </group>
        );
      })}
    </RigidBody>
  );
};

export default LocalPlayer;
