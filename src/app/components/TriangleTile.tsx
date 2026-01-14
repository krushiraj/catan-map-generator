import React from "react";
import { icons, resourceColors } from "./HexTile";

interface TriangleTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
}

export const TriangleTile: React.FC<TriangleTileProps> = ({
  x,
  y,
  rotation,
  resource,
}) => {
  const trianglePoints = "0,-0.75 0.6495,0.375 -0.6495,0.375";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      {/* Triangle shadow for depth */}
      <polygon
        points={trianglePoints}
        transform="translate(0.02, 0.02)"
        fill="rgba(0,0,0,0.2)"
        stroke="none"
      />
      {/* Main triangle */}
      <polygon
        points={trianglePoints}
        fill={resourceColors[resource]}
        stroke="#333"
        strokeWidth={0.04}
      />

      <text
        transform={`rotate(${-1 * rotation})`}
        x="0"
        y="0"
        textAnchor="middle"
        fontSize="0.35"
        style={{ filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))" }}
      >
        {icons[resource]}
      </text>
    </g>
  );
};
