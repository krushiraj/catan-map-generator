"use client";

import React from "react";

interface GenerateButtonProps {
  onClick: () => void;
  isAnimating?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isAnimating }) => {
  return (
    <button
      onClick={onClick}
      disabled={isAnimating}
      className="btn-press gold-gradient text-bg-base font-bold text-sm px-6 py-3 rounded-xl
        shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 transition-shadow
        disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden min-w-[140px]"
    >
      <span className="relative z-10">Generate Map</span>
      {!isAnimating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          animate-[shimmer-sweep_5s_ease-in-out_infinite] -translate-x-full" />
      )}
      {isAnimating && (
        <div className="absolute inset-0 rounded-xl border-2 border-accent-gold
          animate-[border-sweep_1s_linear_infinite]" />
      )}
    </button>
  );
};
