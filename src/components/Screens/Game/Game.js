import Scene from "@/components/3D/Scene/Scene";
import Gift from "@/components/HTML/Gift/Gift";
import styles from "./game.module.scss";
import Minimap from "@/components/HTML/Minimap/Minimap";
import Rank from "@/components/HTML/Rank/Rank";
import Lap from "@/components/HTML/Lap/Lap";

const Game = () => {
    return (
        <div className={styles.game}>
            <Scene />
            <Gift />
            <Minimap />
            <Rank /> 
            <Lap />
        </div>
    )
}

export default Game; 