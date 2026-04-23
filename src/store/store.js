import { create } from "zustand";

export const useGameStore = create((set) => ({
  models: [],
  updateModels: (value) => set({ models: value }),
  gift: "",
  updateGift: (value) => set({ gift: value }),
  localPlayer: {
    id: null,
    order: null,
    isHost: null,
    name: null,
    character: null,
  },
  updateLocalPlayer: (value) => set({ localPlayer: value }),
  circuit: {
    id: 0,
    curve: null,
    length: null,
  },
  updateCircuit: (value) => set({ circuit: value }),
  players: [],
  updatePlayers: (value) => set({ players: value }),
  rank: null,
  updateRank: (value) => set({ rank: value }),
  lap: 0,
  updateLap: (value) => set({ lap: value }),
  idleness: false,
  updateIdleness: (value) => set({ idleness: value })
}));
