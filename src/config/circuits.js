import * as THREE from "three";

const circuitsConfig = [
  {
    id: 0,
    name: "figure_eight_circuit",
    circuit: {
      track: "/models/circuits/figure_eight_circuit/scene.gltf",
      scale: 1,
    },
    players: [
      {
        position: [40, -23, -24],
        rotation: [0, -Math.PI, 0],
      },
      {
        position: [30, -23, -24],
        rotation: [0, -Math.PI, 0],
      },
    ],
    curvePoints: [
      new THREE.Vector3(44.5, -23.15, -24),
      new THREE.Vector3(107.5, -22.7, -24),
      new THREE.Vector3(138, -22, -28),
      new THREE.Vector3(171.5, -20.3, -44.5),
      new THREE.Vector3(193, -18.2, -73),
      new THREE.Vector3(198, -17.2, -90),
      new THREE.Vector3(196, -15.75, -121),
      new THREE.Vector3(180, -14.5, -142),
      new THREE.Vector3(165, -13.6, -150),
      new THREE.Vector3(123, -11.9, -153),
      new THREE.Vector3(90, -11, -130),
      new THREE.Vector3(-85, -10.5, 50),
      new THREE.Vector3(-115, -11, 70),
      new THREE.Vector3(-150, -11, 72),
      new THREE.Vector3(-175, -11.2, 58),
      new THREE.Vector3(-182, -11.8, 40),
      new THREE.Vector3(-179, -13.8, 10),
      new THREE.Vector3(-160, -16.5, -12),
      new THREE.Vector3(-118, -20.5, -23),
      new THREE.Vector3(40, -23.15, -24),
    ],
    props : [
      {
        type: "itembox", 
        position: [80, -23.1, -25],
        rotation: [0, 0, 0]
      }, 
      {
        type: "tremplin", 
        position: [100, -22.6, -25], 
        rotation: [0, Math.PI * 0.77, 0]
      }, 
      {
        type: "accelerator", 
        position: [120, -22.43, -25], 
        rotation: [0, 0, 0]
      }, 
      { 
        type: "thwomp", 
        position: [70, -20.5, -30],
        rotation: [0, -0.5 * Math.PI, 0]
      },
      {
        type: "thwomp", 
        position: [80, -20.5, -30], 
        rotation: [0, -0.5 * Math.PI, 0]
      }
    ]
  },
  {
    id: 1,
    name: "mario_circuit",
    circuit: {
      track: "/models/circuits/mario_circuit/scene.gltf",
      scale: 0.125,
    },
    player: {
      position: [200, 50, -125],
      rotation: [0, Math.PI, 0],
    },
  },
  {
    id: 2,
    name: "rainbow_road",
    circuit: {
      track: "/models/circuits/rainbow_road/track.gltf",
      scale: 2,
    },
    player: {
      position: [17, 100, 0],
      rotation: [0, Math.PI * 0.5, 0],
    },
  },
  {
    id: 4,
    name: "sydney_sprint",
    circuit: {
      track: "/models/circuits/sydney_sprint/scene.gltf",
      scale: 50,
    },
    player: {
      position: [30, 2, 50],
      rotation: [0, 0.5 * Math.PI, 0],
    },
  },
  {
    id: 5,
    name: "toad_harbor",
    circuit: {
      track: "/models/circuits/toad_harbor/scene.gltf",
      scale: 0.125,
    },
    player: {
      position: [-150, -70, 215],
      rotation: [0, 0, 0],
    },
  },
];

export default circuitsConfig;
