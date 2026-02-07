"use client";

import React from "react";
import type { Player } from "../../utils/board";

interface PlayerSetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
}

const COLORS = [
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Green", value: "#008000" },
  { name: "Brown", value: "#a52a2a" },
  { name: "Orange", value: "#ffa500" },
  { name: "White", value: "#ffffff" },
];

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  setPlayers,
  numberOfPlayers,
}) => {
  const handleNameChange = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], name };
    setPlayers(updated);
  };

  const handleColorChange = (index: number) => {
    const usedColors = players.map((p) => p.color);
    const available = COLORS.filter((c) => !usedColors.includes(c.value) || players[index].color === c.value);
    const currentIdx = available.findIndex((c) => c.value === players[index].color);
    const nextIdx = (currentIdx + 1) % available.length;
    const updated = [...players];
    updated[index] = { ...updated[index], color: available[nextIdx].value };
    setPlayers(updated);
  };

  // Initialize players if needed
  React.useEffect(() => {
    if (players.length !== numberOfPlayers) {
      const newPlayers: Player[] = [];
      for (let i = 0; i < numberOfPlayers; i++) {
        newPlayers.push({
          name: players[i]?.name || `Player ${i + 1}`,
          color: players[i]?.color || COLORS[i % COLORS.length].value,
        });
      }
      setPlayers(newPlayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfPlayers]);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Players
      </h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-text-secondary text-xs w-4">{index + 1}</span>
            <input
              type="text"
              value={player.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="flex-1 bg-bg-surface-raised border border-border rounded-lg px-3 py-2
                text-sm text-text-primary placeholder:text-text-secondary/50
                focus:outline-none focus:border-accent-gold/50 transition-colors"
              placeholder={`Player ${index + 1}`}
            />
            <button
              onClick={() => handleColorChange(index)}
              className="w-7 h-7 rounded-full border-2 border-border btn-press shrink-0"
              style={{ backgroundColor: player.color }}
              title="Click to change color"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
