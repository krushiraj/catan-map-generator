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
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary/70 mb-1.5">
        Mode
      </h3>
      <label className="flex items-center justify-between py-1.5 cursor-pointer">
        <span className="text-[13px] text-text-primary">Surprise Mode</span>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={() => !disabled && onToggle(!enabled)}
          disabled={disabled}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
            enabled
              ? "bg-resource-sea shadow-[0_0_12px_rgba(26,107,107,0.5)]"
              : "bg-bg-surface-raised border border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    </div>
  );
};
