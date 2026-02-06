"use client";

import React from "react";

interface VertexProps {
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  color?: string;
  glowColor?: string;
  pulsing?: boolean;
}

export const Vertex: React.FC<VertexProps> = ({ x, y, onClick, color, glowColor, pulsing }) => {
  return (
    <g>
      {pulsing && glowColor && (
        <circle
          cx={x}
          cy={y}
          r={0.35}
          fill={glowColor}
          opacity={0.3}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={0.2}
        fill={color || "#242019"}
        stroke={color ? "#F0E6D6" : "#2A2520"}
        strokeWidth={0.04}
        onClick={() => onClick(x, y)}
        className="cursor-pointer"
        style={{
          transition: "all 0.2s ease",
          filter: color ? "drop-shadow(0 0 3px rgba(212, 165, 70, 0.5))" : undefined,
        }}
      />
    </g>
  );
};
