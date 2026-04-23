import { useGameStore } from "@/store/store";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

const VISUALIZE_CURVE = false;

const Circuit = ({ model, scale, points }) => {
  const { circuit, updateCircuit } = useGameStore();
  const circuitref = useRef();

  useEffect(() => {
    const curve = new THREE.CatmullRomCurve3(points, false);
    const length = curve.getLength();

    if (VISUALIZE_CURVE) {
      const debugPoints = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(debugPoints);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const object = new THREE.Line(geometry, material);
      circuitref.current.add(object);
    }

    updateCircuit({ ...circuit, length, curve });
  }, [points]);

  if (!model) {
    return null;
  }

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group scale={scale} ref={circuitref}>
        <primitive object={model.scene} />
      </group>
    </RigidBody>
  );
};

export default Circuit;
