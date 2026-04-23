"use client";

import { socket } from "@/socket";
import Welcome from "@/components/Screens/Welcome/Welcome";
import { useGameStore } from "@/store/store";
import { useEffect, useState } from "react";
import WaitingRoom from "@/components/Screens/WaitingRoom/WaitingRoom";
import Game from "@/components/Screens/Game/Game";

const IS_MULTIPLAYER = true;

export default function Home() {
  const { localPlayer, updateLocalPlayer, updatePlayers } = useGameStore();
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");
  const [showLobby, setShowLobby] = useState(false); 

  useEffect(() => {
    if (IS_MULTIPLAYER) {
      if (socket.connected) {
        onConnect();
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    } else {
      setGameStarted(true);
      updateLocalPlayer({
        id: 42,
        order: 0,
        isHost: true,
        name: "DEBUG",
        character: "mario",
      });
    }
  }, []);

  function onConnect() {
    socket.emit("login", (response) => {
      updatePlayers(response.players);
    });
    socket.on("playersUpdate", (players) => {
      updatePlayers(players);
    });
    socket.on("gameUpdate", (data) => {
      updatePlayers(data.players);
      setGameStarted(data.game.started);
    });
  }

  function onDisconnect() {
    socket.emit("disconnect");
  }

  const handleAddPlayer = (e, name, character) => {
    e.preventDefault();

    let newPlayer = { ...localPlayer, name: name, character: character };

    socket.emit("addPlayer", newPlayer, (response) => {
      if (response.status === "OK") {
        newPlayer.id = response.player.id;
        newPlayer.isHost = response.player.isHost;
        updateLocalPlayer(newPlayer);
      } else if (response.status === "Failed") {
        setError(response.message);
      }
    });
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    socket.emit("startGame");
  };

  return (
    <>
      {(!showLobby && !gameStarted) && <Welcome handleAddPlayer={handleAddPlayer} error={error} displayWaitingRoom={() => setShowLobby(true)} />}
      {(showLobby && !gameStarted) && <WaitingRoom handleStartGame={handleStartGame} />}
      {(gameStarted && localPlayer.id) && <Game />}
    </>
  );
}
