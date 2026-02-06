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
  <label className="flex items-center justify-between py-2 cursor-pointer">
    <span className="text-sm text-text-primary">{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? "bg-accent-gold" : "bg-bg-surface-raised border border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
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
    <div className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
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
