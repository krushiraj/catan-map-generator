"use client";

import React from "react";
import { icons, resourceColors } from "./HexTile";

interface TriangleTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
}

export const TriangleTile: React.FC<TriangleTileProps> = ({ x, y, rotation, resource }) => {
  const trianglePoints = "0,-0.55 0.48,0.275 -0.48,0.275";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <polygon
        points={trianglePoints}
        fill={resourceColors[resource]}
        stroke="#2A2520"
        strokeWidth={0.03}
        opacity={0.85}
      />
      <text
        transform={`rotate(${-1 * rotation})`}
        x="0"
        y="0.05"
        textAnchor="middle"
        fontSize="0.25"
      >
        {icons[resource]}
      </text>
    </g>
  );
};
