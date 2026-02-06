import { socket } from "@/socket";
import { useGameStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./minimap.module.scss";
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import charactersConfig from "@/config/characters";
import Image from "next/image";

gsap.registerPlugin(MotionPathPlugin);

const NBR_POINTS = 100;

const Minimap = () => {
  const { circuit, rank, updateRank, localPlayer, players } = useGameStore();
  const [playersProgress, setPlayersProgress] = useState([]);
  const pathPoints = useRef();
  const pathRef = useRef();
  const playersRef = useRef([]);
  const playersLap = useRef([...players.map((el) => ({ id: el.id, lap: 0 }))]);
  const playersPrevLapProgress = useRef([
    ...players.map((el) => ({ id: el.id, progress: 0 })),
  ]);

  const generateSVGfromCurve = (curve) => {
    const points = curve.getSpacedPoints(100);
    const flattened = points.map((p) => ({ x: p.x, y: p.z }));

    const minX = Math.min(...flattened.map((p) => p.x));
    const maxX = Math.max(...flattened.map((p) => p.x));
    const minY = Math.min(...flattened.map((p) => p.y));
    const maxY = Math.max(...flattened.map((p) => p.y));
    const scale = 200 / Math.max(maxX - minX, maxY - minY);

    const normalized = flattened.map((p) => ({
      x: (p.x - minX) * scale,
      y: (p.y - minY) * scale,
    }));

    const path =
      normalized
        .map((p, i) => {
          const command = i === 0 ? "M" : "L";
          return `${command} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        })
        .join(" ") + " Z";

    return path;
  };

  useEffect(() => {
    if (circuit.curve) {
      pathPoints.current = generateSVGfromCurve(circuit.curve);
    }
  }, [circuit]);

  useEffect(() => {
    if (circuit.curve && circuit.length) {
      const handler = (players) => {
        // Get each players progression
        let progressArray = [];

        const getPlayerProgress = (position, id, name) => {
          let { curve, length } = circuit;
          const points = curve.getSpacedPoints(NBR_POINTS);
          let closestDist = Infinity;
          let closestIndex = 0;
          let pos = new THREE.Vector3(position.x, position.y, position.z);

          points.forEach((p, i) => {
            const dist = pos.distanceTo(p);
            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = i;
            }
          });

          const u = closestIndex / NBR_POINTS;
          const lapProgress = u * length;

          // Previous progress
          const prevProgress = playersPrevLapProgress.current.find(
            (el) => el.id === id
          )?.progress;
          let currentLap =
            playersLap.current.find((el) => el.id === id)?.lap ?? 0;

          // Add a lap
          if (prevProgress > lapProgress && prevProgress > 0.9 * length) {
            currentLap++;
            playersLap.current = playersLap.current.map((el) =>
              el.id === id ? { id, lap: currentLap } : el
            );
          }

          // Update prev progress
          playersPrevLapProgress.current = playersPrevLapProgress.current.map(
            (el) => (el.id === id ? { id, progress: lapProgress } : el)
          );

          let totalProgress =
            currentLap === 0 ? 0 : currentLap * length + u * length;
     
          return totalProgress;
        };

        players.forEach((player) => {
          if (player.position) {
            const progress = getPlayerProgress(
              player.position,
              player.id,
              player.name
            );
            progressArray.push({ player, progress });
          }
        });

        setPlayersProgress(progressArray);
      };
      socket.on("updatePlayers", handler);

      return () => {
        socket.off("updatePlayers", handler);
      };
    }
  }, [socket, circuit]);

  useEffect(() => {
    /* Update characters position on mini map */

    if (
      playersProgress.length &&
      circuit.length &&
      playersRef.current.length &&
      pathRef.current
    ) {
      playersProgress.map((el, index) => {
        gsap.set(playersRef.current[index], {
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
            start: (el.progress % circuit.length) / circuit.length,
            end: (el.progress % circuit.length) / circuit.length,
            autoRotate: false,
          },
        });
      });

      /* Update rank */
      const newRank = JSON.stringify(
        [...playersProgress]
          .sort((a, b) => b.progress - a.progress)
          .map((el) => {
            return { playerId: el.player.id, progress: el.progress };
          })
      );
      if (rank !== newRank) {
        updateRank(newRank);
      }
    }
  }, [playersProgress]);

  return (
    <div className={styles.minimap}>
      {pathPoints.current && (
        <svg width={220} height={220} style={{}}>
          <path
            ref={pathRef}
            d={pathPoints.current}
            fill="none"
            stroke="white"
            strokeWidth={2}
          />
        </svg>
      )}
      {playersProgress.length &&
        playersProgress.map((item, index) => {
          const thumbnail = charactersConfig.find(
            (el) => el.name === item.player.character
          )?.thumbnail;
          return (
            <div
              key={index}
              className={styles.minimap_player}
              ref={(ref) => (playersRef.current[index] = ref)}
            >
              <Image alt="" src={thumbnail} width={35} height={35} />
            </div>
          );
        })}
    </div>
  );
};

export default Minimap;
