import { useState } from "react";
import styles from "./welcome.module.scss";
import { useGameStore } from "@/store/store";
import charactersConfig from "@/config/characters";
import Image from "next/image";

const Welcome = ({ handleAddPlayer, error }) => {
  const [name, setName] = useState("");
  const [character, setCharacter] = useState("");

  return (
    <div className={styles.welcome}>
      <form
        className={styles.welcome_ctn}
        onSubmit={(e) => handleAddPlayer(e, name, character)}
      >
        <h1>
          {"Mario Copy".split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h1>
        <div className={styles.welcome_form}>
          <div className={styles.welcome_form_field}>
            <label htmlFor="name">Pseudo</label>
            <input
              required
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="name"
            />
          </div>
          <div className={styles.welcome_form_field}>
            <label htmlFor="character">Personnage</label>

            <div className={styles.welcome_form_select}>
              {charactersConfig.map((char, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.welcome_form_character} ${
                      char.name === character ? styles.active : ""
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
        <div className={styles.welcome_submit}>
          <button>
            {"Go !".split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </button>
          {error && <span>{error}</span>}
        </div>
      </form>
    </div>
  );
};

export default Welcome;
