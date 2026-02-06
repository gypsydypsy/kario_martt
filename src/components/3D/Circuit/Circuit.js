import { useGameStore } from "@/store/store";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

const VISUALIZE_CURVE = false;

const Circuit = ({ name, scale, points }) => {
  const { models, circuit, updateCircuit } = useGameStore();
  const circuitref = useRef();

  useEffect(() => {
    const curve = new THREE.CatmullRomCurve3(points, false);
    const length = curve.getLength();

    if(VISUALIZE_CURVE){
      const points = curve.getPoints(50); 
      const geometry = new THREE.BufferGeometry().setFromPoints(points); 
      const material = new THREE.LineBasicMaterial({ color: 0xffffff}); 
      const object = new THREE.Line(geometry, material); 
      circuitref.current.add(object)
    }
    updateCircuit({...circuit, length, curve})
  }, []);

  useEffect(() => {
    const model = models.find((model) => model.name === name);

    if (model) {
      circuitref.current.add(model.scene);
    }
  }, [models]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group scale={scale} ref={circuitref} />
    </RigidBody>
  );
};

export default Circuit;
