import { useGameStore } from "@/store/store";
import styles from "./rank.module.scss";
import { useEffect, useState } from "react";

const Rank = () => {
  const { rank, localPlayer } = useGameStore();
  const [playerRank, setPlayerRank] = useState(null);

  useEffect(() => {
    if (rank !== null && JSON.parse(rank).length > 1) {
      const parsedArray = JSON.parse(rank);
      const matchPlayerId = parsedArray.find((el) => el.playerId === localPlayer.id);
      if (matchPlayerId) {
        const newRank = parsedArray.indexOf(matchPlayerId) + 1;
        if (newRank !== playerRank) {
          setPlayerRank(newRank);
        }
      }
    }
  }, [rank]);

  return (
    <>
      {playerRank!== null && (
        <div className={styles.rank} data-pos={playerRank}>
          <span>{playerRank}</span>
        </div>
      )}
    </>
  );
};

export default Rank;
