"use client";

import React from "react";

interface Player {
  name: string;
  color: string;
}

interface PlayerTurnBarProps {
  currentPlayer: Player;
  onNext: () => void;
  isLastTurn: boolean;
  onReveal: () => void;
}

export const PlayerTurnBar: React.FC<PlayerTurnBarProps> = ({
  currentPlayer,
  onNext,
  isLastTurn,
  onReveal,
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 h-10 border-b border-border transition-colors"
      style={{
        backgroundColor: `${currentPlayer.color}12`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: currentPlayer.color }}
        />
        <span className="text-sm font-medium text-text-primary">
          {currentPlayer.name}&apos;s Turn
        </span>
      </div>
      <button
        onClick={isLastTurn ? onReveal : onNext}
        className="btn-press text-xs font-semibold px-3 py-1 rounded-lg transition-colors
          bg-bg-surface-raised border border-border hover:border-accent-gold/50 text-text-primary"
      >
        {isLastTurn ? "Reveal All" : "Next \u2192"}
      </button>
    </div>
  );
};
