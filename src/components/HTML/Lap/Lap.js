import { useGameStore } from "@/store/store";
import styles from "./lap.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";

const Lap = () => {
  const [lap, setLap] = useState(null);

  const { rank, localPlayer, circuit } = useGameStore();

  useEffect( () => {
    if (rank !== null && JSON.parse(rank).length > 1 && circuit.length) {
        const parsedArray = JSON.parse(rank)
        const localProgress = parsedArray.find(el => el.playerId === localPlayer.id)?.progress;
        
        setLap(Math.trunc(localProgress / circuit.length))
    }
  }, [rank])
  return (
    <>
      {lap !== null && (
        <div className={styles.lap}>
          {/* <Image src={'/images/flag.png'} height={40} width={25} alt="" /> */}
          <span className={styles.lap_label}>TOUR</span>
          <span className={styles.lap_lap}>{lap} / 3</span>
        </div>
      )}
    </>
  );
};

export default Lap;
