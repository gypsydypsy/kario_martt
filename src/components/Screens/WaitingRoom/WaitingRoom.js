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
          <h2>Liste des joueurs</h2>
          <ul>
            {players.map((player) => {
              console.log(player)
              return (
                <li key={player.id}>
                  <Image src={charactersConfig.find( char => char.name === player.character)?.thumbnail} height={50} width={50} alt={player.character} />
                  <span>{player.name}{player.isHost && " (hôte)"}</span>
                </li>
              );
            })}
          </ul>
          {localPlayer.isHost ? (
            <button>Start Game</button>
          ) : (
            <p>En attente de nouveaux joueurs...</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default WaitingRoom;
