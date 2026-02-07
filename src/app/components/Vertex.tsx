"use client";

import React from "react";

interface VertexProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  color?: string;
  disabled?: boolean;
  valid?: boolean;
  highlightColor?: string;
}

// House shape: pentagon (square base + triangle roof)
const housePoints = (cx: number, cy: number, s: number) => {
  // s = scale factor
  const w = 0.16 * s; // half width
  const bh = 0.1 * s; // base height below center
  const th = 0.06 * s; // wall height above center
  const rh = 0.2 * s; // roof peak above center
  return [
    [cx - w, cy + bh], // bottom-left
    [cx + w, cy + bh], // bottom-right
    [cx + w, cy - th], // top-right wall
    [cx, cy - rh],     // roof peak
    [cx - w, cy - th], // top-left wall
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(" ");
};

export const Vertex: React.FC<VertexProps> = ({
  x,
  y,
  onClick,
  color,
  disabled,
  valid,
  highlightColor,
}) => {
  const isPlaced = !!color;
  const isInteractive = !disabled && !isPlaced;

  if (isPlaced) {
    // Placed settlement: house shape with glow
    return (
      <g>
        {/* Glow behind house */}
        <polygon
          points={housePoints(x, y, 1.6)}
          fill={color}
          opacity={0.15}
          style={{ filter: `blur(0.05px)` }}
        />
        {/* House shadow */}
        <polygon
          points={housePoints(x, y + 0.02, 1.15)}
          fill="rgba(0,0,0,0.4)"
        />
        {/* House body */}
        <polygon
          points={housePoints(x, y, 1.15)}
          fill={color}
          stroke="#F0E6D6"
          strokeWidth={0.03}
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 3px ${color})`,
          }}
        />
        {/* Door detail */}
        <rect
          x={x - 0.04}
          y={y - 0.01}
          width={0.08}
          height={0.1}
          rx={0.01}
          fill="rgba(0,0,0,0.3)"
        />
      </g>
    );
  }

  if (valid && highlightColor) {
    // Valid placement: ghost house outline pulsing
    return (
      <g className="animate-pulse">
        {/* Glow ring */}
        <circle
          cx={x}
          cy={y}
          r={0.3}
          fill={highlightColor}
          opacity={0.12}
        />
        {/* Ghost house outline */}
        <polygon
          points={housePoints(x, y, 1.0)}
          fill={`${highlightColor}20`}
          stroke={highlightColor}
          strokeWidth={0.025}
          strokeLinejoin="round"
          strokeDasharray="0.06 0.04"
          opacity={0.7}
          onClick={() => onClick(x, y)}
          className="cursor-pointer"
        />
        {/* Invisible wider click target */}
        <circle
          cx={x}
          cy={y}
          r={0.25}
          fill="transparent"
          onClick={() => onClick(x, y)}
          className="cursor-pointer"
        />
      </g>
    );
  }

  // Default: subtle intersection dot
  return (
    <circle
      cx={x}
      cy={y}
      r={0.08}
      fill={isInteractive ? "#3a3530" : "#242019"}
      stroke="#2A2520"
      strokeWidth={0.02}
      onClick={isInteractive ? () => onClick(x, y) : undefined}
      className={isInteractive ? "cursor-pointer" : ""}
      style={{ transition: "all 0.2s ease" }}
    />
  );
};
