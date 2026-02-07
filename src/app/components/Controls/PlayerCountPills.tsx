"use client";

import React from "react";
import type { NumberOfPlayers } from "../../utils/board";

interface PlayerCountPillsProps {
  value: NumberOfPlayers;
  onChange: (count: NumberOfPlayers) => void;
}

export const PlayerCountPills: React.FC<PlayerCountPillsProps> = ({ value, onChange }) => {
  const counts: NumberOfPlayers[] = [4, 5, 6];

  return (
    <div className="flex gap-2">
      {counts.map((count) => (
        <button
          key={count}
          onClick={() => onChange(count)}
          className={`btn-press w-10 h-10 rounded-full text-sm font-semibold transition-all
            ${
              value === count
                ? "gold-gradient text-bg-base shadow-lg shadow-accent-gold/30"
                : "bg-bg-surface-raised text-text-secondary border border-border hover:border-accent-gold/50"
            }`}
        >
          {count}
        </button>
      ))}
    </div>
  );
};
