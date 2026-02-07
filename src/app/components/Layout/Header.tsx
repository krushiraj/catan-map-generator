"use client";

import React from "react";
import { useMediaLayout } from "../../hooks/useMediaLayout";

interface HeaderProps {
  onShare?: () => void;
  surpriseMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onShare, surpriseMode }) => {
  const layout = useMediaLayout();

  return (
    <header
      className={`shrink-0 z-50 h-12 flex items-center justify-between px-4 glass-surface border-b border-border ${
        surpriseMode
          ? "border-b-2 border-b-transparent bg-gradient-to-r from-accent-gold/20 via-resource-sea/20 to-accent-gold/20"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Hex logo */}
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <polygon
            points="12,1 22,7 22,21 12,27 2,21 2,7"
            stroke="url(#gold-gradient)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4A546" />
              <stop offset="100%" stopColor="#B8922E" />
            </linearGradient>
          </defs>
        </svg>
        {layout !== "mobile" && (
          <span className="text-text-primary font-semibold tracking-wide text-sm">
            Catan Map Generator
          </span>
        )}
        {surpriseMode && (
          <span className="text-xs font-bold text-resource-sea animate-pulse-glow px-2 py-0.5 rounded-full bg-resource-sea/10 ml-2">
            SURPRISE
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onShare && (
          <button
            onClick={onShare}
            className="btn-press text-text-secondary hover:text-accent-gold transition-colors p-2"
            aria-label="Share map"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};
