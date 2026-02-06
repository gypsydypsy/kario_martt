import { useGameStore } from "@/store/store";
import Shell from "../Shell/Shell";
import Bobomb from "../Bobomb/Bobomb";
import Banana from "../Banana/Banana";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

const Traps = () => {
  const [traps, setTraps] = useState([]);

  useEffect( () => {
    const handler = (traps) => {
      setTraps(traps)
    }
    socket.on('trapsUpdate', handler)

    return () => {
      socket.off('trapsUpdate', handler)
    }
  }, [])

  return (
    <>
      {traps.length &&
        traps.map((item, index) => {
          if (item.type === "shell") {
            return (
              <Shell
                key={index}
                id={item.id}
                position={item.position}
                direction={item.direction}
              />
            );
          }

          if (item.type === "banana") {
            return <Banana key={index} id={item.id} position={item.position} />;
          }

          if (item.type === "bomb") {
            return (
              <Bobomb
                key={index}
                id={item.id}
                position={item.position}
                direction={item.direction}
              />
            );
          }
        })}
    </>
  );
};

export default Traps;
