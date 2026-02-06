"use client";

import { useGameStore } from "@/store/store";
import styles from "./gift.module.scss";
import giftsConfig from "@/config/gifts";
import Image from "next/image";
import { useEffect, useState } from "react";

const Gift = () => {
  const { gift } = useGameStore();
  const [translation, setTranslation] = useState(0);

  useEffect(() => {
    if (gift) {
      const matchingGift = giftsConfig.find((el) => el.name === gift);
      const index = giftsConfig.indexOf(matchingGift);
      const t =
        ((index +
          (index === giftsConfig.length - 1 ? 2 : 3) * giftsConfig.length) *
          100) /
        (giftsConfig.length * 4);
      setTranslation(t);
    } else {
      setTranslation(0);
    }
  }, [gift]);

  return (
    <div className={styles.gift}>
      <div
        className={styles.gift_list}
        style={{
          opacity: gift ? 1 : 0,
          transform: `translateY(-${translation}%)`,
        }}
      >
        {new Array(4).fill(null).map((_, index) => {
          return giftsConfig.map((gift, index) => {
            return (
              <div key={index} className={styles.gift_item}>
                <Image
                  src={`${gift.thumbnail}`}
                  height={100}
                  width={100}
                  alt={""}
                />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Gift;
