/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { HexTile } from "./HexTile";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { randomiser } from "../utils";
import { TriangleTile } from "./TriangleTile";

// Define the types of resources
export type Resource = "wood" | "brick" | "ore" | "hay" | "sheep" | "desert";

export type NumberOfPlayers = 4 | 5 | 6;

interface HexPosition {
  x: number;
  y: number;
  vertices: number[];
  edges: number[];
  adjacent: number[];
  resource?: Resource;
  number?: number;
}

const portPositions = {
  4: [
    {
      x: -0.7,
      y: -4.7,
      resource: "all",
      rotation: -30,
    },
    {
      x: 2.7,
      y: -4.6,
      resource: "all",
      rotation: 30,
    },
    {
      x: -3.7,
      y: -2.9,
      resource: "sheep",
      rotation: -30,
    },
    {
      x: 4.4,
      y: -1.7,
      resource: "brick",
      rotation: -30,
    },
    {
      x: -5.4,
      y: 0,
      resource: "all",
      rotation: -90,
    },
    {
      x: 4.4,
      y: 1.7,
      resource: "wood",
      rotation: 90,
    },
    {
      x: -3.7,
      y: 3,
      resource: "ore",
      rotation: -30,
    },
    {
      x: -0.7,
      y: 4.7,
      resource: "hay",
      rotation: -30,
    },
    {
      x: 2.7,
      y: 4.7,
      resource: "all",
      rotation: 30,
    },
  ],
  6: [
    {
      x: -2.7,
      y: -6.4,
      resource: "all",
      rotation: -30,
    },
    {
      x: 0.7,
      y: -6.4,
      resource: "sheep",
      rotation: 30,
    },
    {
      x: 3.6,
      y: -4.7,
      resource: "all",
      rotation: 30,
    },
    {
      x: -5.4,
      y: -1.7,
      resource: "ore",
      rotation: 30,
    },
    {
      x: -5.6,
      y: 1.3,
      resource: "all",
      rotation: -30,
    },
    {
      x: -4.4,
      y: 3.4,
      resource: "hay",
      rotation: 30,
    },
    {
      x: -2.7,
      y: 6.5,
      resource: "all",
      rotation: -30,
    },
    {
      x: 0.7,
      y: 6.5,
      resource: "wood",
      rotation: 30,
    },
    {
      x: 3.4,
      y: 5.2,
      resource: "all",
      rotation: 90,
    },
    {
      x: 4.65,
      y: 3.05,
      resource: "brick",
      rotation: 30,
    },
    {
      x: 6.4,
      y: 0,
      resource: "all",
      rotation: 90,
    },
  ],
};

// Helper function to create the initial board layout
const createInitialBoard = (
  numberOfPlayer: NumberOfPlayers,
  sameNumberShouldTouch: boolean,
  sameResourcesShouldTouch: boolean,
  scarceResource: Resource
): HexPosition[] => {
  const resources: Resource[] = [
    "wood",
    "wood",
    "wood",
    "wood",
    "brick",
    "brick",
    "brick",
    "ore",
    "ore",
    "ore",
    "hay",
    "hay",
    "hay",
    "hay",
    "sheep",
    "sheep",
    "sheep",
    "sheep",
    "desert",
  ];

  if (numberOfPlayer > 4) {
    resources.push(
      ...([
        "wood",
        "wood",
        "brick",
        "brick",
        "ore",
        "ore",
        "hay",
        "hay",
        "sheep",
        "sheep",
        "desert",
      ] as Resource[])
    );
  }

  const numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

  if (numberOfPlayer > 4) {
    numbers.push(...[...new Set(numbers)]);
  }

  const hexPositions =
    numberOfPlayer === 4
      ? [
          // Row 1 (3 hexes)
          {
            x: -2,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 3, 4],
          },
          {
            x: 0,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 2, 4, 5],
          },
          {
            x: 2,
            y: -3.46,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [5, 6],
          },
          // Row 2 (4 hexes)
          {
            x: -3,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 4, 7, 8],
          },
          {
            x: -1,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 1, 3, 5, 8, 9],
          },
          {
            x: 1,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 2, 4, 6, 9, 10],
          },
          {
            x: 3,
            y: -1.73,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [2, 5, 10, 11],
          },
          // Row 3 (5 hexes)
          {
            x: -4,
            y: 0,
            vertices: [0, 5, 4],
            edges: [4, 5, 0, 3],
            adjacent: [3, 8, 12],
          },
          {
            x: -2,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 4, 7, 9, 12, 13],
          },
          {
            x: 0,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [4, 5, 8, 10, 13, 14],
          },
          {
            x: 2,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [5, 6, 9, 11, 14, 15],
          },
          {
            x: 4,
            y: 0,
            vertices: [0, 5, 2, 1],
            edges: [4, 5, 0, 1, 2],
            adjacent: [6, 10, 15],
          },
          // Row 4 (4 hexes)
          {
            x: -3,
            y: 1.73,
            vertices: [0, 5, 4],
            edges: [4, 5, 0, 3],
            adjacent: [7, 8, 13, 16],
          },
          {
            x: -1,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [8, 9, 12, 14, 16, 17],
          },
          {
            x: 1,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [9, 10, 13, 15, 17, 18],
          },
          {
            x: 3,
            y: 1.73,
            vertices: [0, 5, 2, 1],
            edges: [4, 5, 0, 1, 2],
            adjacent: [10, 11, 14, 18],
          },
          // Row 5 (3 hexes)
          {
            x: -2,
            y: 3.46,
            vertices: [0, 5, 3, 2, 4],
            edges: [4, 5, 0, 2, 3],
            adjacent: [12, 13, 17],
          },
          {
            x: 0,
            y: 3.46,
            vertices: [0, 5, 3, 2, 4],
            edges: [4, 5, 0, 2, 3],
            adjacent: [13, 14, 16, 18],
          },
          {
            x: 2,
            y: 3.46,
            vertices: [0, 5, 1, 3, 2, 4],
            edges: [4, 5, 0, 1, 2, 3],
            adjacent: [14, 15, 17],
          },
        ]
      : [
          // Row 1 (3 hexes)
          {
            x: -2,
            y: -5.19,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 3, 4],
          },
          {
            x: 0,
            y: -5.19,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 2, 4, 5],
          },
          {
            x: 2,
            y: -5.19,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [1, 5, 6],
          },
          // Row 2 (4 hexes)
          {
            x: -3,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 4, 7, 8],
          },
          {
            x: -1,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 1, 3, 5, 8, 9],
          },
          {
            x: 1,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 2, 4, 6, 9, 10],
          },
          {
            x: 3,
            y: -3.46,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [2, 5, 10, 11],
          },
          // Row 3 (5 hexes)
          {
            x: -4,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 8, 12, 13],
          },
          {
            x: -2,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 4, 7, 9, 13, 14],
          },
          {
            x: 0,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [4, 5, 8, 10, 14, 15],
          },
          {
            x: 2,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [5, 6, 9, 11, 15, 16],
          },
          {
            x: 4,
            y: -1.73,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [6, 10, 16, 17],
          },
          // Row 4 (6 hexes)
          {
            x: -5,
            y: 0,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [7, 13, 18],
          },
          {
            x: -3,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [7, 8, 12, 14, 18, 19],
          },
          {
            x: -1,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [8, 9, 13, 15, 19, 20],
          },
          {
            x: 1,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [9, 10, 14, 16, 20, 21],
          },
          {
            x: 3,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [10, 11, 15, 17, 21, 22],
          },
          {
            x: 5,
            y: 0,
            vertices: [0, 5, 1, 2],
            edges: [4, 5, 0, 1, 2],
            adjacent: [11, 16, 22],
          },
          // Row 5 (5 hexes)
          {
            x: -4,
            y: 1.73,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [12, 13, 19, 23],
          },
          {
            x: -2,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [13, 14, 18, 20, 23, 24],
          },
          {
            x: 0,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [14, 15, 19, 21, 24, 25],
          },
          {
            x: 2,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [15, 16, 20, 22, 25, 26],
          },
          {
            x: 4,
            y: 1.73,
            vertices: [0, 5, 1, 2],
            edges: [1, 2, 4, 5, 0],
            adjacent: [16, 17, 21, 26],
          },
          // Row 6 (4 hexes)
          {
            x: -3,
            y: 3.46,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [18, 19, 24, 27],
          },
          {
            x: -1,
            y: 3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [19, 20, 23, 25, 27, 28],
          },
          {
            x: 1,
            y: 3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [20, 21, 24, 26, 28, 29],
          },
          {
            x: 3,
            y: 3.46,
            vertices: [0, 5, 1, 2],
            edges: [1, 2, 4, 5, 0],
            adjacent: [21, 22, 25, 29],
          },
          // Row 7 (3 hexes)
          {
            x: -2,
            y: 5.19,
            vertices: [0, 3, 4, 5],
            edges: [2, 3, 4, 5, 0],
            adjacent: [23, 24, 28],
          },
          {
            x: 0,
            y: 5.19,
            vertices: [0, 3, 4, 5],
            edges: [2, 3, 4, 5, 0],
            adjacent: [24, 25, 27, 29],
          },
          {
            x: 2,
            y: 5.19,
            vertices: [0, 3, 4, 2, 5, 1],
            edges: [2, 3, 4, 5, 0, 1],
            adjacent: [25, 26, 28],
          },
        ];

  const probabilities: Record<number, number> = {
    6: 5,
    8: 5,
    9: 4,
    5: 4,
    4: 3,
    10: 3,
    3: 2,
    11: 2,
    2: 1,
    12: 1,
  };

  const recursivelyAssignResourceAndNumber = (
    hexPositions: HexPosition[],
    idx: number,
    availableResources: Resource[],
    availableNumbers: number[]
  ) => {
    if (
      idx === hexPositions.length &&
      hexPositions.every((hex) => hex.resource)
    ) {
      return hexPositions;
    }

    const hex = hexPositions[idx];
    const adjacentResources = hex.adjacent
      .map((idx: number) => hexPositions[idx].resource)
      .filter(Boolean);
    const adjacentNumbers = hex.adjacent
      .map((idx: number) => hexPositions[idx].number)
      .filter(Boolean);

    const resourceForHex = availableResources.find((resource) => {
      if (!sameResourcesShouldTouch) {
        return !adjacentResources.includes(resource);
      }
      return true;
    });

    if (!resourceForHex) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    const resourceIndex = availableResources.indexOf(resourceForHex);

    let numberForHex =
      availableNumbers.find((number) => {
        if (!sameNumberShouldTouch) {
          return !adjacentNumbers.includes(number);
        }
        return true;
      }) || 0;

    if (scarceResource && resourceForHex === scarceResource) {
      // check if numberForHex has least probability among availableNumbers
      // if not, find the number with least probability
      // swap the number with numberForHex and update availableNumbers
      const probabilitiesForAvailableNumbers = availableNumbers.map(
        (number) => probabilities[number]
      );
      const probabilityForNumberForHex = probabilities[numberForHex];
      const minProbability = Math.min(...probabilitiesForAvailableNumbers);

      if (minProbability > 2 && probabilityForNumberForHex > 2) {
        return recursivelyAssignResourceAndNumber(
          hexPositions,
          0,
          randomiser(resources),
          randomiser(numbers)
        );
      }

      if (probabilityForNumberForHex > minProbability) {
        const minProbabilityNumber = availableNumbers.find(
          (number) => probabilities[number] === minProbability
        );

        if (minProbabilityNumber && minProbabilityNumber !== numberForHex) {
          numberForHex = minProbabilityNumber;
          const numberIndex = availableNumbers.indexOf(numberForHex);
          availableNumbers[numberIndex] = numberForHex;
        }
      }
    }

    if (availableNumbers.length && !numberForHex) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    const numberIndex =
      availableNumbers.length && availableNumbers.indexOf(numberForHex);

    const newCopyOfHexPositions = [...hexPositions];
    newCopyOfHexPositions[idx] = {
      ...hex,
      resource: resourceForHex,
      number: resourceForHex !== "desert" ? numberForHex : undefined,
    };

    const newAvailableResources = [...availableResources];
    newAvailableResources.splice(resourceIndex, 1);

    const newAvailableNumbers = [...availableNumbers];
    if (resourceForHex !== "desert") {
      newAvailableNumbers.splice(numberIndex, 1);
    }

    const unsetAdjacentIdxs = hex.adjacent.filter(
      (idx) => !newCopyOfHexPositions[idx].resource
    );

    const result: HexPosition[] = recursivelyAssignResourceAndNumber(
      newCopyOfHexPositions,
      idx + 1,
      newAvailableResources,
      newAvailableNumbers
    );

    if (!result.every((hex) => hex.resource)) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    return result;
  };

  return recursivelyAssignResourceAndNumber(
    hexPositions as HexPosition[],
    0,
    randomiser(resources),
    randomiser(numbers)
  );
};

type PlayerColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "white"
  | "orange"
  | "brown";

interface CatanBoardProps {
  numberOfPlayer: NumberOfPlayers;
  sameNumberShouldTouch: boolean;
  sameResourcesShouldTouch: boolean;
  scarceResource: Resource;
  invertTiles: boolean;
  reset: boolean;
  players: { name: string; color: PlayerColor }[];
}

interface Placement {
  house: string;
  road: string;
}

interface PlayerPlacement {
  [key: string]: Placement[];
}

export const CatanBoard: React.FC<CatanBoardProps> = ({
  numberOfPlayer,
  sameNumberShouldTouch,
  sameResourcesShouldTouch,
  scarceResource,
  invertTiles,
  players,
  reset,
}) => {
  const [board, setBoard] = useState<HexPosition[]>([]);
  const [hoveredHex, setHoveredHex] = useState<number | null>(null);
  const [houses, setHouses] = useState<Set<string>>(new Set());
  const [roads, setRoads] = useState<Set<string>>(new Set());
  const [playerPlacements, setPlayerPlacements] = useState<PlayerPlacement>({});
  const [playerTurn, setPlayerTurn] = useState(0);
  const [reveal, setReveal] = useState(true);

  const playerTurns = {
    4: [0, 1, 2, 3, 3, 2, 1, 0],
    5: [0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
    6: [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0],
  };

  useEffect(() => {
    setBoard(
      createInitialBoard(
        numberOfPlayer,
        sameNumberShouldTouch,
        sameResourcesShouldTouch,
        scarceResource
      )
    );
    setReveal(!invertTiles);
  }, [
    numberOfPlayer,
    sameNumberShouldTouch,
    sameResourcesShouldTouch,
    scarceResource,
    reset,
    invertTiles,
  ]);

  const handlePlayerTurn = () => setPlayerTurn(playerTurn + 1);

  const handleReveal = () => setReveal(true);

  // Calculate positions for a hexagonal grid with horizontal gaps

  const handleVertexClick = (x: number, y: number) => {
    const currentPlayer =
      players[playerTurns[players.length as NumberOfPlayers][playerTurn]];

    const key = `${x},${y}${currentPlayer.color}`;

    for (const house of [...houses].filter((house: string) => house !== key)) {
      const [houseX, houseY] = house.split("#")[0].split(",").map(Number);
      const distance = Math.sqrt((houseX - x) ** 2 + (houseY - y) ** 2);
      if (distance < 1.2) {
        return;
      }
    }

    let addingHouse = true;

    setHouses((prevHouses) => {
      const newHouses = new Set(prevHouses);
      if (newHouses.has(key)) {
        newHouses.delete(key);
        addingHouse = false;
      } else {
        newHouses.add(key);
      }
      return newHouses;
    });

    if (addingHouse) {
      setPlayerPlacements((prevPlacements) => {
        const newPlacements = { ...prevPlacements };
        if (!newPlacements[currentPlayer.name]) {
          newPlacements[currentPlayer.name] = [];
        }
        newPlacements[currentPlayer.name].push({
          house: key,
          road: "",
        });
        return newPlacements;
      });
    } else {
      setPlayerPlacements((prevPlacements) => {
        const newPlacements = { ...prevPlacements };
        if (!newPlacements[currentPlayer.name]) {
          newPlacements[currentPlayer.name] = [];
        }
        newPlacements[currentPlayer.name] = newPlacements[
          currentPlayer.name
        ].filter((placement) => placement.house !== key);
        return newPlacements;
      });
    }
  };

  const handleEdgeClick = (x1: number, y1: number, x2: number, y2: number) => {
    const currentPlayer =
      players[playerTurns[players.length as NumberOfPlayers][playerTurn]];

    const key = `${x1},${y1}-${x2},${y2}${currentPlayer.color}`;

    const lastHouse =
      playerPlacements[currentPlayer.name][
        playerPlacements[currentPlayer.name].length - 1
      ].house;
    const [lastHouseX, lastHouseY] = lastHouse
      .split("#")[0]
      .split(",")
      .map(Number);

    const distance1 = Math.sqrt(
      (x1 - lastHouseX) ** 2 + (y1 - lastHouseY) ** 2
    );
    const distance2 = Math.sqrt(
      (x2 - lastHouseX) ** 2 + (y2 - lastHouseY) ** 2
    );

    if (distance1 > 0.1 && distance2 > 0.1) {
      return; // Do not add the road if it doesn't align with the last clicked house
    }

    if (!currentPlayer) {
      return;
    }

    if (!playerPlacements[currentPlayer.name]) {
      return;
    }

    if (
      !playerPlacements[currentPlayer.name][
        playerPlacements[currentPlayer.name].length - 1
      ]
    ) {
      return;
    }

    if (
      !playerPlacements[currentPlayer.name][
        playerPlacements[currentPlayer.name].length - 1
      ].house
    ) {
      return;
    }

    let addingRoad = true;

    setRoads((prevRoads) => {
      const newRoads = new Set(prevRoads);
      if (newRoads.has(key)) {
        newRoads.delete(key);
        addingRoad = false;
      } else {
        newRoads.add(key);
      }
      return newRoads;
    });

    if (addingRoad) {
      setPlayerPlacements((prevPlacements) => {
        const newPlacements = { ...prevPlacements };
        if (!newPlacements[currentPlayer.name]) {
          newPlacements[currentPlayer.name] = [];
        }
        newPlacements[currentPlayer.name][
          newPlacements[currentPlayer.name].length - 1
        ].road = key;
        return newPlacements;
      });
    } else {
      setPlayerPlacements((prevPlacements) => {
        const newPlacements = { ...prevPlacements };
        if (!newPlacements[currentPlayer.name]) {
          newPlacements[currentPlayer.name] = [];
        }
        newPlacements[currentPlayer.name][
          newPlacements[currentPlayer.name].length - 1
        ].road = "";
        return newPlacements;
      });
    }
  };

  const DrawVertex = ({ x, y }: { x: number; y: number }) => {
    const color = [...houses]
      .find((house) => house.startsWith(`${x},${y}`))
      ?.split("#")[1];
    return (
      <Vertex
        x={x}
        y={y}
        onClick={handleVertexClick}
        color={color ? `#${color}` : undefined}
      />
    );
  };

  const DrawEdge = ({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) => {
    const color = [...roads]
      .find((road) => road.startsWith(`${x1},${y1}-${x2},${y2}`))
      ?.split("#")[1];

    return (
      <Edge
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        onClick={handleEdgeClick}
        color={color ? `#${color}` : undefined}
      />
    );
  };

  const allVertices = (x: number, y: number) => [
    <DrawVertex x={x} y={y - 1.173} key={0} />,
    <DrawVertex x={x + 0.99} y={y - 0.5865} key={1} />,
    <DrawVertex x={x + 0.99} y={y + 0.5865} key={2} />,
    <DrawVertex x={x} y={y + 1.173} key={3} />,
    <DrawVertex x={x - 0.99} y={y + 0.5865} key={4} />,
    <DrawVertex x={x - 0.99} y={y - 0.5865} key={5} />,
  ];

  const allEdges = (x: number, y: number) => [
    <DrawEdge x1={x} y1={y - 1.173} x2={x + 0.99} y2={y - 0.5865} key={0} />,
    <DrawEdge
      x1={x + 0.99}
      y1={y - 0.5865}
      x2={x + 0.99}
      y2={y + 0.5865}
      key={1}
    />,
    <DrawEdge x1={x + 0.99} y1={y + 0.5865} x2={x} y2={y + 1.173} key={2} />,
    <DrawEdge x1={x} y1={y + 1.173} x2={x - 0.99} y2={y + 0.5865} key={3} />,
    <DrawEdge
      x1={x - 0.99}
      y1={y + 0.5865}
      x2={x - 0.99}
      y2={y - 0.5865}
      key={4}
    />,
    <DrawEdge x1={x - 0.99} y1={y - 0.5865} x2={x} y2={y - 1.173} key={5} />,
  ];

  const hexesTouchingSecondHouseForEachPlayer: Record<string, Resource[]> = {};

  for (const playerName of Object.keys(playerPlacements)) {
    const placements = playerPlacements[playerName];
    if (placements.length < 2) {
      continue;
    }

    const secondHouse = placements[1].house;
    const [x, y] = secondHouse.split("#")[0].split(",").map(Number);

    if (!hexesTouchingSecondHouseForEachPlayer[playerName]) {
      hexesTouchingSecondHouseForEachPlayer[playerName] = [];
    }

    // const getAllVerticesOfHex = (x: number, y: number) => [
    //   { x: x, y: y - 1 },
    //   { x: x + 0.866, y: y - 0.5 },
    //   { x: x + 0.866, y: y + 0.5 },
    //   { x: x, y: y + 1 },
    //   { x: x - 0.866, y: y + 0.5 },
    //   { x: x - 0.866, y: y - 0.5 },
    // ];

    // Find the hexes touching the second house
    const hexesTouchingSecondHouse = board.filter(
      (hex) => Math.sqrt((hex.x - x) ** 2 + (hex.y - y) ** 2) < 1.2
    );

    const resources = hexesTouchingSecondHouse.map((hex) => hex.resource);

    hexesTouchingSecondHouseForEachPlayer[playerName] = resources.filter(
      (resource) => resource !== "desert"
    ) as Resource[];
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {invertTiles && (
        <div className="mb-6 text-center space-y-4">
          <h3 className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
            <span>🙈</span>
            <span>Surprise Mode - Hidden Tiles</span>
          </h3>
          <div className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-lg font-medium flex items-center space-x-2"
               style={{
                 color:
                   players[
                     playerTurns[players.length as NumberOfPlayers][playerTurn]
                   ].color,
               }}
            >
              <span>🎮</span>
              <span>
                {
                  players[
                    playerTurns[players.length as NumberOfPlayers][playerTurn]
                  ].name
                }
                's turn
              </span>
            </p>
          </div>
          <button
            onClick={
              playerTurns[players.length as NumberOfPlayers].length - 1 ===
              playerTurn
                ? handleReveal
                : handlePlayerTurn
            }
            className={playerTurns[players.length as NumberOfPlayers].length - 1 === playerTurn ? "success" : ""}
          >
            {playerTurns[players.length as NumberOfPlayers].length - 1 ===
            playerTurn
              ? "🎉 Reveal Map"
              : "✅ Confirm Placements"}
          </button>
          {reveal &&
            Object.keys(playerPlacements).map((playerName) => (
              <div key={playerName} className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg p-3 inline-block mx-2">
                <p className="text-white">
                  <span
                    className="font-semibold"
                    style={{
                      color: players.filter(
                        (player) => player.name === playerName
                      )[0].color,
                    }}
                  >
                    {playerName}
                  </span>{" "}
                  gets{" "}
                  <span className="font-medium">
                    {hexesTouchingSecondHouseForEachPlayer[playerName].join(", ")}
                  </span>
                </p>
              </div>
            ))}
        </div>
      )}
      <div className="w-full flex justify-center">
        <svg
          className="max-w-full h-auto"
          viewBox={numberOfPlayer === 4 ? "-6.5 -6.5 12 12" : "-8 -8 16 16"}
          preserveAspectRatio="xMidYMid meet"
        >
          {portPositions[numberOfPlayer === 4 ? 4 : 6].map((port, index) => (
            <React.Fragment key={index}>
              <TriangleTile
                x={port.x}
                y={port.y}
                resource={port.resource}
                rotation={port.rotation}
              />
            </React.Fragment>
          ))}
          {board.map((hex, index) => (
            <React.Fragment key={`${index}-${hex.x},${hex.y}`}>
              <HexTile
                x={hex.x}
                y={hex.y}
                rotation={60}
                resource={board[index].resource as string}
                number={board[index].number}
                isHovered={hoveredHex === index}
                onHover={() => setHoveredHex(index)}
                onHoverEnd={() => setHoveredHex(null)}
                reveal={reveal}
              />
              {allEdges(hex.x, hex.y).filter((_, index) =>
                hex.edges.includes(index)
              )}
              {allVertices(hex.x, hex.y).filter((_, index) =>
                hex.vertices.includes(index)
              )}
            </React.Fragment>
          ))}
        </svg>
      </div>
    </div>
  );
};
