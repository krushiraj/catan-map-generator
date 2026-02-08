"use client";

import React, { useState } from "react";

interface ScarceResourcePickerProps {
  value: string;
  onChange: (resource: string) => void;
}

const RESOURCES: { key: string; label: string; color: string; icon: string }[] = [
  { key: "brick", label: "Brick", color: "bg-resource-brick", icon: "\u{1F9F1}" },
  { key: "hay", label: "Wheat", color: "bg-resource-wheat", icon: "\u{1F33E}" },
  { key: "ore", label: "Ore", color: "bg-resource-ore", icon: "\u{1FAA8}" },
  { key: "wood", label: "Wood", color: "bg-resource-wood", icon: "\u{1FAB5}" },
  { key: "sheep", label: "Sheep", color: "bg-resource-sheep", icon: "\u{1F40F}" },
];

export const ScarceResourcePicker: React.FC<ScarceResourcePickerProps> = ({
  value,
  onChange,
}) => {
  const [isRandom, setIsRandom] = useState(false);

  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mb-2">
        Scarce Resource
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { setIsRandom(false); onChange(""); }}
          className={`btn-press flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            value === "" && !isRandom
              ? "gold-gradient text-bg-base"
              : "bg-bg-surface-raised text-text-secondary border border-border"
          }`}
        >
          None
        </button>
        {RESOURCES.map((res) => (
          <button
            key={res.key}
            onClick={() => { setIsRandom(false); onChange(res.key); }}
            className={`btn-press flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              value === res.key && !isRandom
                ? `ring-2 ring-accent-gold ring-offset-2 ring-offset-bg-base ${res.color}`
                : "bg-bg-surface-raised text-text-secondary border border-border hover:border-border/80"
            }`}
            title={res.label}
          >
            <span className="text-base">{res.icon}</span>
            {res.label}
          </button>
        ))}
        <button
          onClick={() => {
            setIsRandom(true);
            const resources = ["brick", "hay", "ore", "wood", "sheep"];
            onChange(resources[Math.floor(Math.random() * resources.length)]);
          }}
          className={`btn-press flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            isRandom
              ? "gold-gradient text-bg-base"
              : "bg-bg-surface-raised text-text-secondary border border-border"
          }`}
        >
          <span className="text-base">{"\u{1F3B2}"}</span>
          Random
        </button>
      </div>
    </div>
  );
};
