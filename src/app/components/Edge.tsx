"use client";

import React from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick: (x1: number, y1: number, x2: number, y2: number) => void;
  color?: string;
  disabled?: boolean;
  valid?: boolean;
  highlightColor?: string;
}

export const Edge: React.FC<EdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  onClick,
  color,
  disabled,
  valid,
  highlightColor,
}) => {
  const isPlaced = !!color;
  const isInteractive = !disabled && !isPlaced;

  if (isPlaced) {
    // Placed road: thick plank with border and glow
    return (
      <g>
        {/* Road glow */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={0.22}
          strokeLinecap="round"
          opacity={0.15}
          style={{ pointerEvents: "none" }}
        />
        {/* Road border (dark outline) */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#1A1714"
          strokeWidth={0.18}
          strokeLinecap="round"
          style={{ pointerEvents: "none" }}
        />
        {/* Road fill (player color) */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={0.12}
          strokeLinecap="round"
          style={{
            pointerEvents: "none",
            filter: `drop-shadow(0 0 2px ${color})`,
          }}
        />
        {/* Center highlight for 3D feel */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.04}
          strokeLinecap="round"
          style={{ pointerEvents: "none" }}
        />
      </g>
    );
  }

  if (valid && highlightColor) {
    // Valid road: dashed ghost line
    return (
      <g>
        {/* Wide invisible hit area */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="transparent"
          strokeWidth={0.4}
          strokeLinecap="round"
          onClick={() => onClick(x1, y1, x2, y2)}
          className="cursor-pointer"
        />
        {/* Glow behind */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={highlightColor}
          strokeWidth={0.16}
          strokeLinecap="round"
          opacity={0.1}
          style={{ pointerEvents: "none", animation: "pulse-glow 2s ease-in-out infinite" }}
        />
        {/* Dashed ghost road */}
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={highlightColor}
          strokeWidth={0.1}
          strokeLinecap="round"
          strokeDasharray="0.12 0.08"
          opacity={0.5}
          onClick={() => onClick(x1, y1, x2, y2)}
          className="cursor-pointer"
          style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
        />
      </g>
    );
  }

  // Default: subtle grid edge
  return (
    <g>
      {isInteractive && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="transparent"
          strokeWidth={0.4}
          strokeLinecap="round"
          onClick={() => onClick(x1, y1, x2, y2)}
          className="cursor-pointer"
        />
      )}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#2A2520"
        strokeWidth={0.05}
        strokeLinecap="round"
        style={{ pointerEvents: isInteractive ? "none" : undefined }}
      />
    </g>
  );
};
