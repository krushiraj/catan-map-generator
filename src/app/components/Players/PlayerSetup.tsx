"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Player } from "../../utils/board";

interface PlayerSetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
}

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#eab308" },
  { name: "Blue", value: "#3b82f6" },
  { name: "White", value: "#ffffff" },
  { name: "Orange", value: "#f97316" },
  { name: "Green", value: "#22c55e" },
  { name: "Brown", value: "#5c2d0e" },
];

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  setPlayers,
  numberOfPlayers,
}) => {
  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleNameChange = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], name };
    setPlayers(updated);
  };

  const handleColorSelect = (index: number, newColor: string) => {
    const updated = [...players];
    const oldColor = updated[index].color;

    if (newColor === oldColor) {
      setOpenPickerIndex(null);
      return;
    }

    // Swap: if another player has this color, give them our old color
    const otherIndex = updated.findIndex(
      (p, i) => i !== index && p.color === newColor
    );
    if (otherIndex !== -1) {
      updated[otherIndex] = { ...updated[otherIndex], color: oldColor };
    }
    updated[index] = { ...updated[index], color: newColor };

    setPlayers(updated);
    setOpenPickerIndex(null);
  };

  // Close picker on click outside
  useEffect(() => {
    if (openPickerIndex === null) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpenPickerIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openPickerIndex]);

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
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mb-2">
        Players
      </h3>
      <div className="space-y-1.5">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors"
            style={{ backgroundColor: `${player.color}15` }}
          >
            <span className="text-text-secondary/50 text-[11px] font-mono w-3 text-right">{index + 1}</span>
            <input
              type="text"
              value={player.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="flex-1 bg-bg-surface-raised border border-border rounded-lg px-3 py-1.5
                text-[13px] text-text-primary placeholder:text-text-secondary/40
                focus:outline-none focus:border-accent-gold/50 transition-colors"
              placeholder={`Player ${index + 1}`}
            />
            <div className="relative" ref={openPickerIndex === index ? pickerRef : undefined}>
              <button
                onClick={() =>
                  setOpenPickerIndex(openPickerIndex === index ? null : index)
                }
                className="w-6 h-6 rounded-full border-2 border-border btn-press shrink-0 hover:scale-110 transition-transform translate-y-0.5"
                style={{ backgroundColor: player.color }}
                title={COLORS.find((c) => c.value === player.color)?.name ?? "Color"}
              />
              {openPickerIndex === index && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-10 flex gap-1.5 p-2 rounded-lg bg-bg-surface-raised border border-border shadow-lg"
                >
                  {COLORS.map((c) => {
                    const isSelected = player.color === c.value;
                    return (
                      <button
                        key={c.value}
                        onClick={() => handleColorSelect(index, c.value)}
                        className="w-6 h-6 rounded-full shrink-0 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c.value,
                          boxShadow: isSelected
                            ? "0 0 0 2px #1a1a2e, 0 0 0 4px #d4a546"
                            : "none",
                        }}
                        title={c.name}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
