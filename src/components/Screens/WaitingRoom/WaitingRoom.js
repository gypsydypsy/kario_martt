import { useGameStore } from "@/store/store";
import styles from "./waitingroom.module.scss";
import charactersConfig from "@/config/characters";
import Image from "next/image";

const WaitingRoom = ({ handleStartGame }) => {
  const { localPlayer, players } = useGameStore();

  return (
    <div className={styles.waitingroom}>
      <form className={styles.waitingroom_ctn} onSubmit={handleStartGame}>
        <h1>
          {"Mario Copy".split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h1>
        <div className={styles.waitingroom_form}>
          <h2>Liste des joueurs : </h2>
          <ul>
            {players.map((player) => {
              return (
                <li key={player.id}>
                  <Image src={charactersConfig.find(char => char.name === player.character)?.thumbnail} height={50} width={50} alt={player.character} />
                  <span>{player.name}{player.isHost && " (hôte)"}</span>
                </li>
              );
            })}
          </ul>
          <p className={styles.waitingroom_info}>
            {players.length < 6 &&
              <>
                {localPlayer.isHost ?
                  "Attendez de nouveaux joueurs ou démarrez la partie" : "Attendez que l'hôte démarre la partie"
                }
              </>
            }
          </p>
        </div>
        {localPlayer.isHost && (
          <div className={styles.waitingroom_submit}>
            <button>  {"Start".split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default WaitingRoom;
