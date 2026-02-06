const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = http.createServer(handler);

  const io = new Server(httpServer);

  let players = [];
  let traps = [];

  let gameStatus = {
    started: false,
  };

  io.on("connection", (socket) => {
    console.log("New connection: " + socket.id);

    socket.on("login", (callback) => {
      callback({
        players,
      });
    });

    socket.on("addPlayer", (player, callback) => {
      const canJoin = players.length < 6 && !gameStatus.started;
      let callbackParams = {};

      if (canJoin) {
        let isHost = !players.find((player) => player?.isHost);
        console.log(`New player joined, id: ${socket.id} name: ${player.name}`);
        player.id = socket.id;
        player.isHost = isHost;
        players.push(player);

        callbackParams = {
          status: "OK",
          message: "Player added",
          player: player,
        };

        socket.broadcast.emit("playersUpdate", players);
        socket.emit("playersUpdate", players);
      } else {
        callbackParams = {
          status: "Failed",
          message:
            players.length >= 6
              ? "Maximum number reached"
              : gameStatus.started
              ? "Game already started"
              : "Something went wrong",
        };
      }

      callback(callbackParams);
    });

    socket.on("updatePlayerPosition", (id, position, rotation) => {
      let currentPlayer = players.find((player) => player.id === id);
      let index = players.indexOf(currentPlayer);
      let updatedPlayer = {
        ...currentPlayer,
        position: position,
        rotation: rotation,
      };
      players[index] = updatedPlayer;
      socket.broadcast.emit("updatePlayers", players);
    });

    socket.on("addTrap", (trap) => {
      console.log("New trap added : ");
      console.log(trap);
      traps.push(trap);

      socket.broadcast.emit("trapsUpdate", traps);
      socket.emit("trapsUpdate", traps);
    });

    socket.on("removeTrap", (id) => {
      let newTraps = traps.filter((trap) => trap.id !== id);
      traps = newTraps;

      socket.broadcast.emit("trapsUpdate", traps);
      socket.emit("trapsUpdate", traps);
    });

    socket.on("startGame", () => {
      gameStatus.started = true;
      socket.broadcast.emit("gameUpdate", {
        game: gameStatus,
        players: players,
      });
      socket.emit("gameUpdate", { game: gameStatus, players: players });
    });

    socket.on("endGame", () => {
      gameStarted = false;
      socket.broadcast.emit("gameUpdate", {
        game: gameStatus,
        players: players,
      });
      socket.emit("gameUpdate", { game: gameStatus, players: players });
    });

    socket.on("disconnect", (id) => {
      let newPlayers = players.filter((player) => player.id !== socket.id);
      players = newPlayers;
      socket.broadcast.emit("playersUpdate", players);

      if (players.length === 0) {
        gameStatus.started = false;
        traps=[]
        socket.broadcast.emit("gameUpdate", {
          game: gameStatus,
          players: players,
        });
        socket.emit("gameUpdate", { game: gameStatus, players: players });
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
