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
      <polygon
        points={trianglePoints}
        fill={resourceColors[resource]}
        stroke="black"
        strokeWidth={0.05}
      />

      <text
        transform={`rotate(${-1 * rotation})`}
        x="0"
        y="0"
        textAnchor="middle"
        fontSize="0.3"
        fill="black"
      >
        {icons[resource]}
      </text>
    </g>
  );
};
