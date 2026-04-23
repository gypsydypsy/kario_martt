"use client";

import styles from "./scene.module.scss";

import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGameStore } from "@/store/store";
import * as THREE from "three";

import Ground from "../Ground/Ground";
import Player from "../Player/Player";
import LocalPlayer from "../LocalPlayer/LocalPlayer";
import Circuit from "../Circuit/Circuit";
import Traps from "../Traps/Traps";

import circuitsConfig from "@/config/circuits";
import modelsConfig from "@/config/models";
import Props from "../Props/Props";

const DEBUG = true;
const CAMERA_DEBUG = false;

const Scene = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCircuit, setCurrentCircuit] = useState(null);

  const {
    updateModels,
    players,
    updatePlayers,
    localPlayer,
    updateLocalPlayer,
    circuit
  } = useGameStore();

  useEffect(() => {
    /* Load Models */
    const loader = new GLTFLoader();

    let newModels = [];
    modelsConfig.forEach((model) => {
      loader.load(`${process.env.NEXT_PUBLIC_FRONTEND}/${model.url}`, (gltf) => {
        const scene = gltf.scene;
        const box = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.sub(center);

        newModels.push({
          name: model.name,
          scene,
        });

        model.loaded = true;

        if (!modelsConfig.find((el) => el.loaded === false)) {
          updateModels(newModels);
          setIsLoaded(true);
        }
      });
    });

    /* Add player order */
    if(players.length){
      let newPlayers = players.map((player, index) => {
        return {
          ...player,
          order: index,
        };
      });

      const matchLocalPlayer = newPlayers.find(
        (player) => player.id === localPlayer.id
      );
      const localOrder = matchLocalPlayer.order;
      updatePlayers(newPlayers);
      updateLocalPlayer({ ...localPlayer, order: localOrder });
    }

  }, []);

  useEffect( () => {
    let c = circuitsConfig.find( el => el.id === circuit.id)
    setCurrentCircuit(c)
  }, [circuit])

  return (
    <>
      {currentCircuit !== null && isLoaded && localPlayer.order !== null ? (
        <div className={styles.scene}>
          <Canvas>
            {CAMERA_DEBUG && (
              <OrbitControls
                target={currentCircuit.players[0].position}
              />
            )}
            <ambientLight intensity={1} />

            <Physics gravity={[0, -9.08, 0]} debug={DEBUG}>
              <Circuit scale={currentCircuit.circuit.scale} name={currentCircuit.name} points={currentCircuit.curvePoints} />
              <Ground position={[0, -23.25, -20]} />
              <Traps />
              <Props elements={currentCircuit.props}/>
              <KeyboardControls
                map={[
                  { name: "forward", keys: ["ArrowUp", "KeyW"] },
                  { name: "backward", keys: ["ArrowDown", "KeyS"] },
                  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
                  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
                  { name: "useGift", keys: ["Enter"] },
                  { name: "brake", keys: ["Space"] },
                  { name: "reset", keys: ["KeyR"] }
                ]}
              >
                <LocalPlayer
                  character={localPlayer.character}
                  position={
                    currentCircuit.players[localPlayer.order]
                      .position
                  }
                  rotation={
                    currentCircuit.players[localPlayer.order]
                      .rotation
                  }
                  id={localPlayer.id}
                  cameraDebug={CAMERA_DEBUG}
                  debug={DEBUG}
                />
              </KeyboardControls>
              {players
                .filter((player) => player.id !== localPlayer.id)
                .map((player) => {
                  return (
                    <Player
                      key={player.id}
                      character={player.character}
                      name={player.name}
                      position={
                        currentCircuit.players[player.order]
                          .position
                      }
                      rotation={
                        currentCircuit.players[1].rotation
                      }
                      id={player.id}
                    />
                  );
                })}
            </Physics>
          </Canvas>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Scene;
