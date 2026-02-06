"use client";

import React from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick: (x1: number, y1: number, x2: number, y2: number) => void;
  color?: string;
  animated?: boolean;
}

export const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, onClick, color }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color || "#2A2520"}
      strokeWidth={color ? 0.15 : 0.08}
      strokeLinecap="round"
      onClick={() => onClick(x1, y1, x2, y2)}
      className="cursor-pointer"
      style={{
        transition: "all 0.2s ease",
        filter: color ? "drop-shadow(0 0 2px rgba(240, 230, 214, 0.3))" : undefined,
      }}
    />
  );
};
