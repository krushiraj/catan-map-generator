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

const PHASE_ICONS: Record<PlacementPhase, string> = {
  settlement: "\u{1F3E0}",
  road: "\u{1F6E4}\uFE0F",
  done: "\u2705",
};

const PHASE_LABELS: Record<PlacementPhase, string> = {
  settlement: "Tap a vertex to place settlement",
  road: "Tap an edge to place road",
  done: "Ready to confirm",
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

  return (
    <div className="w-full flex flex-col">
      {/* Top row: Player info */}
      <div
        className="flex items-center justify-between px-4 py-2 transition-colors"
        style={{ backgroundColor: `${currentPlayer.color}15` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: currentPlayer.color,
              boxShadow: `0 0 0 2px var(--bg-base), 0 0 0 3.5px ${currentPlayer.color}`,
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary leading-tight">
              {currentPlayer.name}
            </span>
            <span className="text-[10px] text-text-secondary leading-tight">
              Turn {turnNumber} of {totalTurns}
            </span>
          </div>
        </div>

        {canUndo && (
          <button
            onClick={onUndo}
            className="btn-press text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors
              bg-bg-surface-raised border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary"
          >
            \u21A9 Undo
          </button>
        )}
      </div>

      {/* Bottom row: Phase indicator / Confirm button */}
      <div
        className="flex items-center px-4 py-1.5 border-b border-border"
        style={{ backgroundColor: `${currentPlayer.color}08` }}
      >
        {isConfirmPhase ? (
          // Full-width confirm button
          <button
            onClick={isLastTurn ? onReveal : onConfirm}
            className="btn-press w-full py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all
              gold-gradient text-bg-base animate-pulse-glow"
          >
            {isLastTurn ? "\u2728 Reveal All Resources" : `Confirm & Next Player \u2192`}
          </button>
        ) : (
          // Phase instruction
          <div className="flex items-center gap-2 py-1">
            <span className="text-sm">{PHASE_ICONS[placementPhase]}</span>
            <span className="text-xs text-text-secondary">
              {PHASE_LABELS[placementPhase]}
            </span>
            {/* Step dots */}
            <div className="flex items-center gap-1 ml-auto">
              <div
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    placementPhase === "settlement"
                      ? currentPlayer.color
                      : "var(--text-secondary)",
                  opacity: placementPhase === "settlement" ? 1 : 0.3,
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    placementPhase === "road"
                      ? currentPlayer.color
                      : "var(--text-secondary)",
                  opacity: placementPhase === "road" ? 1 : 0.3,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
