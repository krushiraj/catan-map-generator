"use client";

import React from "react";
import type { Player } from "../../utils/board";

export type PlacementPhase = "settlement" | "road" | "done";

interface PlayerTurnBarProps {
  currentPlayer: Player;
  placementPhase: PlacementPhase;
  onConfirm: () => void;
  onUndo: () => void;
  isLastTurn: boolean;
  onReveal: () => void;
  turnNumber: number;
  totalTurns: number;
}

const PHASE_LABELS: Record<PlacementPhase, string> = {
  settlement: "Place settlement on a vertex",
  road: "Place road on an edge",
  done: "Placement complete",
};

export const PlayerTurnBar: React.FC<PlayerTurnBarProps> = ({
  currentPlayer,
  placementPhase,
  onConfirm,
  onUndo,
  isLastTurn,
  onReveal,
  turnNumber,
  totalTurns,
}) => {
  const isConfirmPhase = placementPhase === "done";
  const canUndo = placementPhase === "road" || placementPhase === "done";
  const stepIndex = placementPhase === "settlement" ? 0 : 1;

  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${currentPlayer.color}30 0%, ${currentPlayer.color}10 100%)`,
        borderTop: `2px solid ${currentPlayer.color}90`,
      }}
    >

      {/* Player info row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Player color badge */}
          <div
            className="w-5 h-5 rounded-full shrink-0"
            style={{
              backgroundColor: currentPlayer.color,
              boxShadow: `0 0 8px ${currentPlayer.color}60`,
            }}
          />
          <div className="flex flex-col">
            <span className="text-base font-bold text-white leading-tight">
              {currentPlayer.name}
            </span>
            <span className="text-xs text-neutral-400 leading-tight">
              Turn {turnNumber} of {totalTurns}
            </span>
          </div>
        </div>

        {canUndo && (
          <button
            onClick={onUndo}
            className="btn-press flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors
              bg-white/10 border border-white/15 text-neutral-300 hover:text-white hover:bg-white/15"
          >
            {"\u21A9"} Undo
          </button>
        )}
      </div>

      {/* Phase / action row — fixed height to prevent layout jump */}
      <div className="px-4 pb-4 h-[52px] flex items-center">
        {isConfirmPhase ? (
          <button
            onClick={isLastTurn ? onReveal : onConfirm}
            className="btn-press w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all
              gold-gradient text-bg-base shadow-lg"
            style={{
              boxShadow: "0 4px 20px rgba(212,165,70,0.3), 0 0 0 1px rgba(212,165,70,0.3)",
            }}
          >
            {isLastTurn
              ? `${"\u2728"} Reveal All Resources`
              : `Confirm & Next Player ${"\u2192"}`}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Step progress */}
            <div className="flex items-center gap-1.5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === stepIndex ? 24 : 10,
                    backgroundColor:
                      i === stepIndex
                        ? currentPlayer.color
                        : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {/* Phase icon + label */}
            <span className="text-base">
              {placementPhase === "settlement" ? `${"\u{1F3E0}"}` : `${"\u{1F6E4}\uFE0F"}`}
            </span>
            <span className="text-sm text-neutral-300">
              {PHASE_LABELS[placementPhase]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
