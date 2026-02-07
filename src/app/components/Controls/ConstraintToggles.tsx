"use client";

import React from "react";

interface ConstraintTogglesProps {
  noSameResources: boolean;
  noSameNumbers: boolean;
  onToggleResources: (value: boolean) => void;
  onToggleNumbers: (value: boolean) => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <label className="flex items-center justify-between py-1.5 cursor-pointer gap-4">
    <span className="text-[13px] text-text-primary leading-snug">{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-accent-gold" : "bg-bg-surface-raised border border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);

export const ConstraintToggles: React.FC<ConstraintTogglesProps> = ({
  noSameResources,
  noSameNumbers,
  onToggleResources,
  onToggleNumbers,
}) => {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mb-1.5">
        Constraints
      </h3>
      <Toggle
        label="No Same Resources Touch"
        checked={noSameResources}
        onChange={onToggleResources}
      />
      <Toggle
        label="No Same Numbers Touch"
        checked={noSameNumbers}
        onChange={onToggleNumbers}
      />
    </div>
  );
};
