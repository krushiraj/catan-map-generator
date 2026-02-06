"use client";

import React, { useState, useEffect } from "react";
import { HexTile } from "./HexTile";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { TriangleTile } from "./TriangleTile";
import {
  createInitialBoard,
  portPositions,
  playerTurns,
  type Resource,
  type NumberOfPlayers,
  type HexPosition,
  type Player,
} from "../utils/board";
import { PlayerTurnBar } from "./Players/PlayerTurnBar";

export type { Resource, NumberOfPlayers, HexPosition, Player };

interface CatanBoardProps {
  numberOfPlayer: NumberOfPlayers;
  sameNumberShouldTouch: boolean;
  sameResourcesShouldTouch: boolean;
  scarceResource: Resource;
  invertTiles: boolean;
  reset: boolean;
  players: Player[];
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

  const currentPlayerIndex = playerTurns[players.length as NumberOfPlayers]?.[playerTurn] ?? 0;
  const currentPlayer = players[currentPlayerIndex];
  const isLastTurn = playerTurns[players.length as NumberOfPlayers]?.length - 1 === playerTurn;

  return (
    <div className="flex flex-col justify-center items-center">
      {invertTiles && currentPlayer && (
        <>
          <PlayerTurnBar
            currentPlayer={currentPlayer}
            onNext={handlePlayerTurn}
            isLastTurn={isLastTurn}
            onReveal={handleReveal}
          />
          {reveal &&
            Object.keys(playerPlacements).map((playerName) => (
              <p key={playerName} className="text-sm text-text-primary py-1">
                <span
                  style={{
                    color: players.filter(
                      (player) => player.name === playerName
                    )[0].color,
                  }}
                >
                  {playerName}
                </span>{" "}
                gets{" "}
                {hexesTouchingSecondHouseForEachPlayer[playerName]?.join(", ")}
              </p>
            ))}
        </>
      )}
      <svg
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
  );
};
