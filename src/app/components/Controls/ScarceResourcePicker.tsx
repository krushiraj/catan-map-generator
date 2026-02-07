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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Scarce Resource
      </h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setIsRandom(false); onChange(""); }}
          className={`btn-press px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
            className={`btn-press w-9 h-9 rounded-full text-lg transition-all flex items-center justify-center ${
              value === res.key && !isRandom
                ? "ring-2 ring-accent-gold ring-offset-2 ring-offset-bg-base"
                : "opacity-60 hover:opacity-100"
            } ${res.color}`}
            title={res.label}
          >
            {res.icon}
          </button>
        ))}
        <button
          onClick={() => {
            setIsRandom(true);
            const resources = ["brick", "hay", "ore", "wood", "sheep"];
            onChange(resources[Math.floor(Math.random() * resources.length)]);
          }}
          className={`btn-press px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isRandom
              ? "gold-gradient text-bg-base"
              : "bg-bg-surface-raised text-text-secondary border border-border"
          }`}
        >
          Random
        </button>
      </div>
    </div>
  );
};
