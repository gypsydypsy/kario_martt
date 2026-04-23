import Scene from "@/components/3D/Scene/Scene";
import Gift from "@/components/HTML/Gift/Gift";
import styles from "./game.module.scss";
import Minimap from "@/components/HTML/Minimap/Minimap";
import Rank from "@/components/HTML/Rank/Rank";
import Lap from "@/components/HTML/Lap/Lap";
import { useGameStore } from "@/store/store";
import Debug from "@/components/HTML/Debug/Debug";

const Game = () => {
    
    const { idleness } = useGameStore(); 

    return (
        <div className={styles.game}>
            <Scene />
            <Gift />
            <Minimap />
            <Rank /> 
            <Lap />
            {idleness && <Debug />}
        </div>
    )
}

export default Game; 