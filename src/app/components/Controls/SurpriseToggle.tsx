"use client";

import React from "react";

interface SurpriseToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const SurpriseToggle: React.FC<SurpriseToggleProps> = ({
  enabled,
  onToggle,
  disabled,
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
        Mode
      </h3>
      <label className="flex items-center justify-between py-2 cursor-pointer">
        <span className="text-sm text-text-primary">Surprise Mode</span>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={() => !disabled && onToggle(!enabled)}
          disabled={disabled}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            enabled
              ? "bg-resource-sea shadow-[0_0_12px_rgba(26,107,107,0.5)]"
              : "bg-bg-surface-raised border border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    </div>
  );
};
