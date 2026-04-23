import styles from './controls.module.scss'
import arrows from "../../../../public/images/arrows.png"
import spacebar from "../../../../public/images/spacebar.png"
import enter from "../../../../public/images/enter.png"
import keyr from "../../../../public/images/keyr.png"
import Image from 'next/image'

const Controls = ({ displayWaitingRoom }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        displayWaitingRoom();
    }

    return (
        <div className={styles.controls}>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className={styles.controls_ctn}
            >
                <h1>
                    {"Mario Copy".split("").map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </h1>
                <div className={styles.controls_pannel}>
                    <h2>Commandes : </h2>
                    <ul>
                        <li>
                            <p>Se déplacer</p> 
                            <Image src={arrows} height={110} width={165} alt={'Touches fléchées'}/>
                        </li>
                        <li>
                            <p>Freiner</p> 
                            <Image src={spacebar} height={50} width={100} alt={'Barre espace'}/>
                        </li>
                        <li>
                            <p>Utiliser un objet</p> 
                            <Image src={enter} height={112} width={87} alt={'Touche entrée'}/>
                        </li>
                        <li>
                            <p>Reset / Debugger la position</p> 
                            <Image src={keyr} height={50} width={50} alt={'Touche r'}/>
                        </li>
                    </ul>
                </div>
                <div className={styles.controls_submit}>
                    <button>
                        {"OK".split("").map((char, index) => (
                            <span key={index}>{char}</span>
                        ))}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Controls;
