import { useState } from "react";
import styles from "./characterselection.module.scss";
import charactersConfig from "@/config/characters";
import Image from "next/image";

const CharacterSelection = ({ handleAddPlayer, error, displayControls }) => {
    const [name, setName] = useState("");
    const [character, setCharacter] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); 
        handleAddPlayer(e, name, character)
        displayControls()
    }

    return (
        <div className={styles.selection}>
            <form
                className={styles.selection_ctn}
                onSubmit={(e) => handleSubmit(e, name, character)}
            >
                <h1>
                    {"Mario Copy".split("").map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </h1>
                <div className={styles.selection_form}>
                    <div className={styles.selection_form_field}>
                        <label htmlFor="name">Pseudo</label>
                        <input
                            required
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Pseudo"
                        />
                    </div>
                    <div className={styles.selection_form_field}>
                        <label htmlFor="character">Personnage</label>

                        <div className={styles.selection_form_select}>
                            {charactersConfig.map((char, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.selection_form_character} ${char.name === character ? styles.active : ""
                                            }`}
                                        onClick={() => setCharacter(char.name)}
                                    >
                                        <Image
                                            height={65}
                                            width={65}
                                            alt={char.name}
                                            src={char.thumbnail}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={styles.selection_submit}>
                    <button>
                        {"Go !".split("").map((char, index) => (
                            <span key={index}>{char}</span>
                        ))}
                    </button>
                    {error && <span className={styles.selection_error}>{error}</span>}
                </div>
            </form>
        </div>
    );
};

export default CharacterSelection;
