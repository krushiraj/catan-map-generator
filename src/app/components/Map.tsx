"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { PlayerTurnBar, type PlacementPhase } from "./Players/PlayerTurnBar";

export type { Resource, NumberOfPlayers, HexPosition, Player };

// Coordinate key helpers - we use # as delimiter since hex colors contain #
const vertexKey = (x: number, y: number, color: string) => `${x},${y}${color}`;
const edgeKey = (x1: number, y1: number, x2: number, y2: number, color: string) =>
  `${x1},${y1}-${x2},${y2}${color}`;

const coordsFromVertexKey = (key: string) => {
  const [coords] = key.split("#");
  const [x, y] = coords.split(",").map(Number);
  return { x, y };
};

const dist = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

// Minimum distance between two settlements (Catan distance rule)
const MIN_SETTLEMENT_DIST = 1.2;
// Max distance for an edge endpoint to "touch" a vertex
const EDGE_VERTEX_TOLERANCE = 0.1;

interface Placement {
  house: string;
  road: string;
}

interface PlayerPlacements {
  [playerName: string]: Placement[];
}

interface CatanBoardProps {
  numberOfPlayer: NumberOfPlayers;
  sameNumberShouldTouch: boolean;
  sameResourcesShouldTouch: boolean;
  scarceResource: Resource;
  invertTiles: boolean;
  reset: boolean;
  players: Player[];
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
  const [houses, setHouses] = useState<Set<string>>(new Set());
  const [roads, setRoads] = useState<Set<string>>(new Set());
  const [playerPlacements, setPlayerPlacements] = useState<PlayerPlacements>({});
  const [playerTurn, setPlayerTurn] = useState(0);
  const [reveal, setReveal] = useState(true);
  const [placementPhase, setPlacementPhase] = useState<PlacementPhase>("settlement");

  const turnOrder = playerTurns[players.length as NumberOfPlayers];
  const currentPlayerIndex = turnOrder?.[playerTurn] ?? 0;
  const currentPlayer = players[currentPlayerIndex];
  const isLastTurn = turnOrder?.length - 1 === playerTurn;
  const isSurpriseMode = invertTiles && currentPlayer;

  // Reset everything on new board generation
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
    setHouses(new Set());
    setRoads(new Set());
    setPlayerPlacements({});
    setPlayerTurn(0);
    setPlacementPhase("settlement");
  }, [
    numberOfPlayer,
    sameNumberShouldTouch,
    sameResourcesShouldTouch,
    scarceResource,
    reset,
    invertTiles,
  ]);

  // Collect all vertex positions from the board for validation
  const allVertexPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const seen = new Set<string>();
    for (const hex of board) {
      const verts = [
        { x: hex.x, y: hex.y - 1.173 },
        { x: hex.x + 0.99, y: hex.y - 0.5865 },
        { x: hex.x + 0.99, y: hex.y + 0.5865 },
        { x: hex.x, y: hex.y + 1.173 },
        { x: hex.x - 0.99, y: hex.y + 0.5865 },
        { x: hex.x - 0.99, y: hex.y - 0.5865 },
      ];
      for (const v of verts) {
        const key = `${v.x.toFixed(3)},${v.y.toFixed(3)}`;
        if (!seen.has(key)) {
          seen.add(key);
          positions.push(v);
        }
      }
    }
    return positions;
  }, [board]);

  // Collect all edge positions from the board
  const allEdgePositions = useMemo(() => {
    const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const seen = new Set<string>();
    for (const hex of board) {
      const verts = [
        { x: hex.x, y: hex.y - 1.173 },
        { x: hex.x + 0.99, y: hex.y - 0.5865 },
        { x: hex.x + 0.99, y: hex.y + 0.5865 },
        { x: hex.x, y: hex.y + 1.173 },
        { x: hex.x - 0.99, y: hex.y + 0.5865 },
        { x: hex.x - 0.99, y: hex.y - 0.5865 },
      ];
      const hexEdges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      ];
      for (const edgeIdx of hex.edges) {
        const [a, b] = hexEdges[edgeIdx];
        const e = { x1: verts[a].x, y1: verts[a].y, x2: verts[b].x, y2: verts[b].y };
        // Normalize key so same edge from different hexes is same
        const k1 = `${e.x1.toFixed(3)},${e.y1.toFixed(3)}-${e.x2.toFixed(3)},${e.y2.toFixed(3)}`;
        const k2 = `${e.x2.toFixed(3)},${e.y2.toFixed(3)}-${e.x1.toFixed(3)},${e.y1.toFixed(3)}`;
        if (!seen.has(k1) && !seen.has(k2)) {
          seen.add(k1);
          edges.push(e);
        }
      }
    }
    return edges;
  }, [board]);

  // Check if a vertex is valid for settlement placement (distance rule)
  const isValidSettlement = useCallback(
    (x: number, y: number) => {
      for (const key of houses) {
        const coords = coordsFromVertexKey(key);
        if (dist(x, y, coords.x, coords.y) < MIN_SETTLEMENT_DIST) {
          return false;
        }
      }
      return true;
    },
    [houses]
  );

  // Get the settlement placed this turn (if any)
  const currentTurnSettlement = useMemo(() => {
    if (!currentPlayer) return null;
    const placements = playerPlacements[currentPlayer.name];
    if (!placements || placements.length === 0) return null;
    const last = placements[placements.length - 1];
    // Only return if it was placed this turn (road not yet confirmed)
    if (placementPhase === "road" || placementPhase === "done") {
      return coordsFromVertexKey(last.house);
    }
    return null;
  }, [currentPlayer, playerPlacements, placementPhase]);

  // Check if an edge is valid for road placement (must connect to current settlement)
  const isValidRoad = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (!currentTurnSettlement) return false;
      const { x, y } = currentTurnSettlement;
      const d1 = dist(x1, y1, x, y);
      const d2 = dist(x2, y2, x, y);
      return d1 < EDGE_VERTEX_TOLERANCE || d2 < EDGE_VERTEX_TOLERANCE;
    },
    [currentTurnSettlement]
  );

  // Set of valid vertex positions for current state
  const validVertices = useMemo(() => {
    if (!isSurpriseMode || placementPhase !== "settlement") return new Set<string>();
    const valid = new Set<string>();
    for (const v of allVertexPositions) {
      if (isValidSettlement(v.x, v.y)) {
        valid.add(`${v.x.toFixed(3)},${v.y.toFixed(3)}`);
      }
    }
    return valid;
  }, [isSurpriseMode, placementPhase, allVertexPositions, isValidSettlement]);

  // Set of valid edge positions for current state
  const validEdges = useMemo(() => {
    if (!isSurpriseMode || placementPhase !== "road") return new Set<string>();
    const valid = new Set<string>();
    for (const e of allEdgePositions) {
      if (isValidRoad(e.x1, e.y1, e.x2, e.y2)) {
        // Check edge isn't already taken
        const taken = [...roads].some((r) => {
          const [coordPart] = r.split("#");
          const [p1, p2] = coordPart.split("-");
          const [rx1, ry1] = p1.split(",").map(Number);
          const [rx2, ry2] = p2.split(",").map(Number);
          return (
            (dist(rx1, ry1, e.x1, e.y1) < EDGE_VERTEX_TOLERANCE &&
              dist(rx2, ry2, e.x2, e.y2) < EDGE_VERTEX_TOLERANCE) ||
            (dist(rx1, ry1, e.x2, e.y2) < EDGE_VERTEX_TOLERANCE &&
              dist(rx2, ry2, e.x1, e.y1) < EDGE_VERTEX_TOLERANCE)
          );
        });
        if (!taken) {
          valid.add(`${e.x1.toFixed(3)},${e.y1.toFixed(3)}-${e.x2.toFixed(3)},${e.y2.toFixed(3)}`);
        }
      }
    }
    return valid;
  }, [isSurpriseMode, placementPhase, allEdgePositions, isValidRoad, roads]);

  const handleVertexClick = useCallback(
    (x: number, y: number) => {
      if (!isSurpriseMode || placementPhase !== "settlement" || !currentPlayer) return;
      if (!isValidSettlement(x, y)) return;

      const key = vertexKey(x, y, currentPlayer.color);

      setHouses((prev) => new Set(prev).add(key));
      setPlayerPlacements((prev) => {
        const updated = { ...prev };
        if (!updated[currentPlayer.name]) updated[currentPlayer.name] = [];
        updated[currentPlayer.name] = [
          ...updated[currentPlayer.name],
          { house: key, road: "" },
        ];
        return updated;
      });
      setPlacementPhase("road");
    },
    [isSurpriseMode, placementPhase, currentPlayer, isValidSettlement]
  );

  const handleEdgeClick = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (!isSurpriseMode || placementPhase !== "road" || !currentPlayer) return;
      if (!isValidRoad(x1, y1, x2, y2)) return;

      const key = edgeKey(x1, y1, x2, y2, currentPlayer.color);

      setRoads((prev) => new Set(prev).add(key));
      setPlayerPlacements((prev) => {
        const updated = { ...prev };
        const placements = updated[currentPlayer.name];
        if (placements && placements.length > 0) {
          placements[placements.length - 1].road = key;
        }
        return { ...updated };
      });
      setPlacementPhase("done");
    },
    [isSurpriseMode, placementPhase, currentPlayer, isValidRoad]
  );

  const handleConfirm = useCallback(() => {
    setPlayerTurn((prev) => prev + 1);
    setPlacementPhase("settlement");
  }, []);

  const handleReveal = useCallback(() => {
    setReveal(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (!currentPlayer) return;

    if (placementPhase === "done") {
      // Undo road
      setPlayerPlacements((prev) => {
        const updated = { ...prev };
        const placements = updated[currentPlayer.name];
        if (placements && placements.length > 0) {
          const roadKey = placements[placements.length - 1].road;
          if (roadKey) {
            setRoads((prevRoads) => {
              const newRoads = new Set(prevRoads);
              newRoads.delete(roadKey);
              return newRoads;
            });
          }
          placements[placements.length - 1].road = "";
        }
        return { ...updated };
      });
      setPlacementPhase("road");
    } else if (placementPhase === "road") {
      // Undo settlement
      setPlayerPlacements((prev) => {
        const updated = { ...prev };
        const placements = updated[currentPlayer.name];
        if (placements && placements.length > 0) {
          const houseKey = placements[placements.length - 1].house;
          if (houseKey) {
            setHouses((prevHouses) => {
              const newHouses = new Set(prevHouses);
              newHouses.delete(houseKey);
              return newHouses;
            });
          }
          placements.pop();
        }
        return { ...updated };
      });
      setPlacementPhase("settlement");
    }
  }, [currentPlayer, placementPhase]);

  // Check if a vertex position is valid for highlighting
  const isVertexValid = useCallback(
    (x: number, y: number) => {
      return validVertices.has(`${x.toFixed(3)},${y.toFixed(3)}`);
    },
    [validVertices]
  );

  // Check if an edge position is valid for highlighting
  const isEdgeValid = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const k1 = `${x1.toFixed(3)},${y1.toFixed(3)}-${x2.toFixed(3)},${y2.toFixed(3)}`;
      const k2 = `${x2.toFixed(3)},${y2.toFixed(3)}-${x1.toFixed(3)},${y1.toFixed(3)}`;
      return validEdges.has(k1) || validEdges.has(k2);
    },
    [validEdges]
  );

  // Compute resources touching second settlement for each player
  const hexesTouchingSecondHouseForEachPlayer: Record<string, Resource[]> = {};
  for (const playerName of Object.keys(playerPlacements)) {
    const placements = playerPlacements[playerName];
    if (placements.length < 2) continue;
    const secondHouse = placements[1].house;
    const { x, y } = coordsFromVertexKey(secondHouse);
    const touching = board.filter(
      (hex) => dist(hex.x, hex.y, x, y) < MIN_SETTLEMENT_DIST
    );
    hexesTouchingSecondHouseForEachPlayer[playerName] = touching
      .map((hex) => hex.resource)
      .filter((r) => r !== "desert") as Resource[];
  }

  const DrawVertex = ({ x, y }: { x: number; y: number }) => {
    const color = [...houses]
      .find((house) => house.startsWith(`${x},${y}`))
      ?.split("#")[1];
    const placed = color ? `#${color}` : undefined;
    const valid = !placed && isVertexValid(x, y);

    return (
      <Vertex
        x={x}
        y={y}
        onClick={handleVertexClick}
        color={placed}
        disabled={!isSurpriseMode || placementPhase !== "settlement"}
        valid={valid}
        highlightColor={currentPlayer?.color}
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
    const placed = color ? `#${color}` : undefined;
    const valid = !placed && isEdgeValid(x1, y1, x2, y2);

    return (
      <Edge
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        onClick={handleEdgeClick}
        color={placed}
        disabled={!isSurpriseMode || placementPhase !== "road"}
        valid={valid}
        highlightColor={currentPlayer?.color}
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
    <DrawEdge x1={x + 0.99} y1={y - 0.5865} x2={x + 0.99} y2={y + 0.5865} key={1} />,
    <DrawEdge x1={x + 0.99} y1={y + 0.5865} x2={x} y2={y + 1.173} key={2} />,
    <DrawEdge x1={x} y1={y + 1.173} x2={x - 0.99} y2={y + 0.5865} key={3} />,
    <DrawEdge x1={x - 0.99} y1={y + 0.5865} x2={x - 0.99} y2={y - 0.5865} key={4} />,
    <DrawEdge x1={x - 0.99} y1={y - 0.5865} x2={x} y2={y - 1.173} key={5} />,
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {isSurpriseMode && (
        <>
          <PlayerTurnBar
            currentPlayer={currentPlayer}
            placementPhase={placementPhase}
            onConfirm={handleConfirm}
            onUndo={handleUndo}
            isLastTurn={isLastTurn}
            onReveal={handleReveal}
            turnNumber={playerTurn + 1}
            totalTurns={turnOrder?.length ?? 0}
          />
          {reveal &&
            Object.keys(playerPlacements).map((playerName) => (
              <p key={playerName} className="text-sm text-text-primary py-1">
                <span
                  style={{
                    color: players.find((p) => p.name === playerName)?.color,
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
        className="w-full h-full max-w-[600px]"
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
              reveal={reveal}
            />
            {allEdges(hex.x, hex.y).filter((_, i) => hex.edges.includes(i))}
            {allVertices(hex.x, hex.y).filter((_, i) => hex.vertices.includes(i))}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};
