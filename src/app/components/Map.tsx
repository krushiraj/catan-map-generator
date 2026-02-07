"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

const RESOURCE_ICONS: Record<string, string> = {
  wood: "\u{1FAB5}",
  brick: "\u{1F9F1}",
  ore: "\u{1FAA8}",
  hay: "\u{1F33E}",
  sheep: "\u{1F40F}",
};

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

interface ViewState {
  centerX: number;
  centerY: number;
  zoom: number;
}

const DEFAULT_VIEW: ViewState = { centerX: 0, centerY: 0, zoom: 1 };
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const DRAG_THRESHOLD = 5; // pixels

interface CatanBoardProps {
  numberOfPlayer: NumberOfPlayers;
  sameNumberShouldTouch: boolean;
  sameResourcesShouldTouch: boolean;
  scarceResource: Resource;
  invertTiles: boolean;
  reset: boolean;
  players: Player[];
  boardRef?: React.MutableRefObject<{ resource?: Resource; number?: number }[]>;
  housesRef?: React.MutableRefObject<Set<string>>;
  roadsRef?: React.MutableRefObject<Set<string>>;
  initialBoardData?: { resource: Resource; number: number }[];
  initialHouses?: string[];
  initialRoads?: string[];
}

export const CatanBoard: React.FC<CatanBoardProps> = ({
  numberOfPlayer,
  sameNumberShouldTouch,
  sameResourcesShouldTouch,
  scarceResource,
  invertTiles,
  players,
  reset,
  boardRef,
  housesRef,
  roadsRef,
  initialBoardData,
  initialHouses,
  initialRoads,
}) => {
  const [board, setBoard] = useState<HexPosition[]>([]);
  const [houses, setHouses] = useState<Set<string>>(new Set());
  const [roads, setRoads] = useState<Set<string>>(new Set());
  const [playerPlacements, setPlayerPlacements] = useState<PlayerPlacements>({});
  const [playerTurn, setPlayerTurn] = useState(0);
  const [reveal, setReveal] = useState(true);
  const [placementPhase, setPlacementPhase] = useState<PlacementPhase>("settlement");
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW);
  const [isDragging, setIsDragging] = useState(false);

  // SVG element ref
  const svgRef = useRef<SVGSVGElement>(null);

  // Mutable refs for pan/zoom (avoid stale closures in native listeners)
  const isPanningRef = useRef(false);
  const wasDraggedRef = useRef(false);
  const panStartScreenRef = useRef({ x: 0, y: 0 });
  const panStartCenterRef = useRef({ x: 0, y: 0 });
  const touchStateRef = useRef({ distance: 0, midX: 0, midY: 0 });
  // Stale-closure-safe refs synced from state
  const viewStateRef = useRef(viewState);
  viewStateRef.current = viewState;
  const numberOfPlayerRef = useRef(numberOfPlayer);
  numberOfPlayerRef.current = numberOfPlayer;

  const turnOrder = playerTurns[players.length as NumberOfPlayers];
  const currentPlayerIndex = turnOrder?.[playerTurn] ?? 0;
  const currentPlayer = players[currentPlayerIndex];
  const isLastTurn = turnOrder?.length - 1 === playerTurn;
  const isSurpriseMode = invertTiles && currentPlayer;

  // Compute dynamic viewBox from pan/zoom state
  const baseSize = numberOfPlayer === 4 ? 12 : 16;
  const baseOffset = numberOfPlayer === 4 ? -0.5 : 0;
  const computedViewBox = useMemo(() => {
    const vw = baseSize / viewState.zoom;
    const vh = baseSize / viewState.zoom;
    const x = baseOffset + viewState.centerX - vw / 2;
    const y = baseOffset + viewState.centerY - vh / 2;
    return `${x} ${y} ${vw} ${vh}`;
  }, [viewState, baseSize, baseOffset]);

  // Helper: get base dimensions for current player count
  const getBaseSize = useCallback(() => {
    return numberOfPlayerRef.current === 4 ? 12 : 16;
  }, []);

  // Reset everything on new board generation
  useEffect(() => {
    const newBoard = createInitialBoard(
      numberOfPlayer,
      sameNumberShouldTouch,
      sameResourcesShouldTouch,
      scarceResource
    );

    // If shared data is provided, override the random board with it
    if (initialBoardData) {
      for (let i = 0; i < newBoard.length && i < initialBoardData.length; i++) {
        newBoard[i].resource = initialBoardData[i].resource;
        newBoard[i].number = initialBoardData[i].number;
      }
      setBoard(newBoard);
      setHouses(new Set(initialHouses ?? []));
      setRoads(new Set(initialRoads ?? []));
      setReveal(true);
    } else {
      setBoard(newBoard);
      setHouses(new Set());
      setRoads(new Set());
      setReveal(!invertTiles);
    }

    setPlayerPlacements({});
    setPlayerTurn(0);
    setPlacementPhase("settlement");
    setViewState(DEFAULT_VIEW);
  }, [
    numberOfPlayer,
    sameNumberShouldTouch,
    sameResourcesShouldTouch,
    scarceResource,
    reset,
    invertTiles,
    initialBoardData,
    initialHouses,
    initialRoads,
  ]);

  // Sync board state to parent refs for sharing
  useEffect(() => {
    if (boardRef) boardRef.current = board;
  }, [board, boardRef]);

  useEffect(() => {
    if (housesRef) housesRef.current = houses;
  }, [houses, housesRef]);

  useEffect(() => {
    if (roadsRef) roadsRef.current = roads;
  }, [roads, roadsRef]);

  // Track previous player colors to detect changes and sync placements
  const prevPlayersRef = useRef<Player[]>(players);
  useEffect(() => {
    const prev = prevPlayersRef.current;
    prevPlayersRef.current = players;

    // Build map of color changes
    const colorMap = new Map<string, string>();
    for (let i = 0; i < Math.min(prev.length, players.length); i++) {
      if (prev[i].color !== players[i].color) {
        colorMap.set(prev[i].color, players[i].color);
      }
    }
    if (colorMap.size === 0) return;

    // Use a temp prefix to avoid collisions during swaps
    const tempPrefix = "__temp__";
    const replaceColorInKey = (key: string, oldColor: string, newColor: string) =>
      key.replace(oldColor, newColor);

    const rebuildSet = (set: Set<string>) => {
      const arr = [...set];
      // Pass 1: old -> temp
      const intermediate = arr.map((key) => {
        for (const [oldC] of colorMap) {
          if (key.includes(oldC)) {
            return replaceColorInKey(key, oldC, tempPrefix + oldC);
          }
        }
        return key;
      });
      // Pass 2: temp -> new
      const final = intermediate.map((key) => {
        for (const [oldC, newC] of colorMap) {
          const temp = tempPrefix + oldC;
          if (key.includes(temp)) {
            return replaceColorInKey(key, temp, newC);
          }
        }
        return key;
      });
      return new Set(final);
    };

    setHouses((prev) => rebuildSet(prev));
    setRoads((prev) => rebuildSet(prev));
    setPlayerPlacements((prev) => {
      const updated: PlayerPlacements = {};
      for (const [name, placements] of Object.entries(prev)) {
        updated[name] = placements.map((p) => {
          let house = p.house;
          let road = p.road;
          // Pass 1: old -> temp
          for (const [oldC] of colorMap) {
            if (house.includes(oldC)) house = replaceColorInKey(house, oldC, tempPrefix + oldC);
            if (road.includes(oldC)) road = replaceColorInKey(road, oldC, tempPrefix + oldC);
          }
          // Pass 2: temp -> new
          for (const [oldC, newC] of colorMap) {
            const temp = tempPrefix + oldC;
            if (house.includes(temp)) house = replaceColorInKey(house, temp, newC);
            if (road.includes(temp)) road = replaceColorInKey(road, temp, newC);
          }
          return { house, road };
        });
      }
      return updated;
    });
  }, [players]);

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

  // --- Pan & zoom event handlers ---

  const clampCenter = useCallback(
    (cx: number, cy: number, zoom: number) => {
      const bs = getBaseSize();
      const maxPan = bs * 0.6;
      return {
        centerX: Math.max(-maxPan, Math.min(maxPan, cx)),
        centerY: Math.max(-maxPan, Math.min(maxPan, cy)),
        zoom,
      };
    },
    [getBaseSize]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      // Only start pan on primary button (left click / single touch)
      if (e.button !== 0) return;
      isPanningRef.current = true;
      wasDraggedRef.current = false;
      panStartScreenRef.current = { x: e.clientX, y: e.clientY };
      panStartCenterRef.current = {
        x: viewStateRef.current.centerX,
        y: viewStateRef.current.centerY,
      };
      // Don't capture pointer here — capturing immediately redirects pointerup
      // to the SVG, which prevents click events from reaching child elements
      // (vertices/edges). Capture is deferred to handlePointerMove once the
      // drag threshold is exceeded.
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - panStartScreenRef.current.x;
      const dy = e.clientY - panStartScreenRef.current.y;

      if (
        !wasDraggedRef.current &&
        Math.abs(dx) < DRAG_THRESHOLD &&
        Math.abs(dy) < DRAG_THRESHOLD
      ) {
        return;
      }

      if (!wasDraggedRef.current) {
        wasDraggedRef.current = true;
        setIsDragging(true);
        // Capture pointer now that we know it's a real drag, so panning
        // continues smoothly even if the cursor leaves the SVG bounds.
        const svg = svgRef.current;
        if (svg) {
          try { svg.setPointerCapture(e.pointerId); } catch { /* already released */ }
        }
      }

      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const vs = viewStateRef.current;
      const bs = getBaseSize();
      const vw = bs / vs.zoom;
      const vh = bs / vs.zoom;

      // Convert screen pixel delta to SVG coordinate delta
      const dxSvg = dx * (vw / rect.width);
      const dySvg = dy * (vh / rect.height);

      setViewState(
        clampCenter(
          panStartCenterRef.current.x - dxSvg,
          panStartCenterRef.current.y - dySvg,
          vs.zoom
        )
      );
    },
    [getBaseSize, clampCenter]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      isPanningRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
      } catch { /* pointer was never captured (simple click, not a drag) */ }
    },
    []
  );

  const handleClickCapture = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // Only reset the drag flag when clicking on the SVG background itself
      if (wasDraggedRef.current && e.target === e.currentTarget) {
        wasDraggedRef.current = false;
      }
    },
    []
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // Don't reset if double-clicking an interactive element (vertex/edge)
      const target = e.target as Element;
      if (target.classList.contains("cursor-pointer")) return;
      setViewState(DEFAULT_VIEW);
    },
    []
  );

  // Wheel zoom (native listener for non-passive preventDefault)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const vs = viewStateRef.current;
      const bs = getBaseSize();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vs.zoom * factor));

      // Zoom toward cursor: compute SVG coord under mouse
      const rect = svg.getBoundingClientRect();
      const vw = bs / vs.zoom;
      const vh = bs / vs.zoom;
      const svgX = vs.centerX - vw / 2 + (e.clientX - rect.left) / rect.width * vw;
      const svgY = vs.centerY - vh / 2 + (e.clientY - rect.top) / rect.height * vh;

      // After zoom, the same screen pixel should map to the same SVG coord
      const newVw = bs / newZoom;
      const newVh = bs / newZoom;
      const newCenterX = svgX - (e.clientX - rect.left) / rect.width * newVw + newVw / 2;
      const newCenterY = svgY - (e.clientY - rect.top) / rect.height * newVh + newVh / 2;

      setViewState(clampCenter(newCenterX, newCenterY, newZoom));
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [getBaseSize, clampCenter]);

  // Pinch-to-zoom (native touch listeners for non-passive preventDefault)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getTouchDistance = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const getTouchMidpoint = (t1: Touch, t2: Touch) => ({
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    });

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        // Cancel single-finger pan
        isPanningRef.current = false;
        const d = getTouchDistance(e.touches[0], e.touches[1]);
        const mid = getTouchMidpoint(e.touches[0], e.touches[1]);
        touchStateRef.current = { distance: d, midX: mid.x, midY: mid.y };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length < 2) return;
      e.preventDefault();
      const vs = viewStateRef.current;
      const bs = getBaseSize();
      const rect = svg.getBoundingClientRect();

      const d = getTouchDistance(e.touches[0], e.touches[1]);
      const mid = getTouchMidpoint(e.touches[0], e.touches[1]);
      const prevState = touchStateRef.current;

      // Pinch ratio
      const ratio = d / prevState.distance;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, vs.zoom * ratio));

      // Midpoint delta for pan
      const vw = bs / vs.zoom;
      const vh = bs / vs.zoom;
      const dxSvg = (mid.x - prevState.midX) * (vw / rect.width);
      const dySvg = (mid.y - prevState.midY) * (vh / rect.height);

      // Zoom toward pinch midpoint
      const svgX = vs.centerX - vw / 2 + (mid.x - rect.left) / rect.width * vw;
      const svgY = vs.centerY - vh / 2 + (mid.y - rect.top) / rect.height * vh;
      const newVw = bs / newZoom;
      const newVh = bs / newZoom;
      const newCenterX =
        svgX - (mid.x - rect.left) / rect.width * newVw + newVw / 2 - dxSvg;
      const newCenterY =
        svgY - (mid.y - rect.top) / rect.height * newVh + newVh / 2 - dySvg;

      setViewState(clampCenter(newCenterX, newCenterY, newZoom));
      touchStateRef.current = { distance: d, midX: mid.x, midY: mid.y };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Going from 2 fingers to 1: reset pan start to remaining finger
        panStartScreenRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        panStartCenterRef.current = {
          x: viewStateRef.current.centerX,
          y: viewStateRef.current.centerY,
        };
        isPanningRef.current = true;
      }
    };

    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd);
    return () => {
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getBaseSize, clampCenter]);

  const handleVertexClick = useCallback(
    (x: number, y: number) => {
      if (wasDraggedRef.current) { wasDraggedRef.current = false; return; }
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
      if (wasDraggedRef.current) { wasDraggedRef.current = false; return; }
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
  // Falls back to first settlement if player only has one placement
  const resourcesPerPlayer: Record<string, Resource[]> = {};
  for (const playerName of Object.keys(playerPlacements)) {
    const placements = playerPlacements[playerName];
    if (placements.length === 0) continue;
    const house = placements.length >= 2 ? placements[1].house : placements[0].house;
    if (!house) continue;
    const { x, y } = coordsFromVertexKey(house);
    const touching = board.filter(
      (hex) => dist(hex.x, hex.y, x, y) < MIN_SETTLEMENT_DIST
    );
    resourcesPerPlayer[playerName] = touching
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
    <div className="flex flex-col justify-center items-center w-full h-full min-h-0">
      {isSurpriseMode && !reveal && (
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
      )}
      <div className="relative w-full h-full min-h-0">
        {reveal && Object.keys(playerPlacements).length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-10 mt-1 mx-1 rounded-xl overflow-hidden border border-border bg-bg-surface/80">
            <button
              onClick={() => setResourcesExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/5 transition-colors"
            >
              <span>{"\u2728"} Reveal Resources</span>
              <span className="text-text-secondary text-xs">{resourcesExpanded ? "\u25B2" : "\u25BC"}</span>
            </button>
            {resourcesExpanded && (
              <div className="border-t border-border">
                {Object.keys(playerPlacements).map((playerName) => {
                  const resources = resourcesPerPlayer[playerName];
                  if (!resources) return null;
                  const playerColor = players.find((p) => p.name === playerName)?.color;
                  return (
                    <div key={playerName} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0">
                      <div className="flex items-center gap-2 font-medium" style={{ color: playerColor }}>
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: playerColor }} />
                        {playerName}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {resources.map((r, i) => (
                          <span key={i} className="inline-flex items-center gap-0.5 bg-white/5 rounded-md px-1.5 py-0.5 text-xs text-text-primary">
                            {RESOURCE_ICONS[r] ?? ""} {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <svg
          ref={svgRef}
          viewBox={computedViewBox}
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClickCapture={handleClickCapture}
          onDoubleClick={handleDoubleClick}
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
        {/* Layer 1: All hex tiles first */}
        {board.map((hex, index) => (
          <HexTile
            key={`hex-${index}-${hex.x},${hex.y}`}
            x={hex.x}
            y={hex.y}
            rotation={60}
            resource={board[index].resource as string}
            number={board[index].number}
            reveal={reveal}
          />
        ))}
        {/* Layer 2: All edges on top of hex tiles */}
        {board.map((hex, index) => (
          <React.Fragment key={`edges-${index}-${hex.x},${hex.y}`}>
            {allEdges(hex.x, hex.y).filter((_, i) => hex.edges.includes(i))}
          </React.Fragment>
        ))}
        {/* Layer 3: All vertices on top of everything */}
        {board.map((hex, index) => (
          <React.Fragment key={`verts-${index}-${hex.x},${hex.y}`}>
            {allVertices(hex.x, hex.y).filter((_, i) => hex.vertices.includes(i))}
          </React.Fragment>
        ))}
        </svg>
      </div>
    </div>
  );
};
