import React from "react";

interface HexTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
  number?: number;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  reveal?: boolean;
}

const resourceColors: { [key: string]: string } = {
  wood: "var(--pastel-green)",
  brick: "var(--pastel-red)",
  ore: "var(--pastel-gray)",
  hay: "var(--pastel-yellow)",
  sheep: "var(--pastel-light-green)",
  desert: "var(--pastel-sand)",
  inverted: "var(--sea-blue)",
};

export const HexTile: React.FC<HexTileProps> = ({
  x,
  y,
  rotation,
  resource,
  number,
  isHovered,
  onHover,
  onHoverEnd,
  reveal = true,
}) => {
  const hexPoints = "0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5";
  const color = !reveal ? resourceColors.inverted : resourceColors[resource];
  const scale = isHovered ? 1.1 : 1;
  const strokeWidth = isHovered ? 0.05 : 0.025;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill={color}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      {number && (
        <text
          x="0"
          y="0.3"
          textAnchor="middle"
          fontSize="0.4"
          fill="black"
          fontWeight="bold"
        >
          {!reveal ? "" : number}
        </text>
      )}
      <text x="0" y="-0.3" textAnchor="middle" fontSize="0.25" fill="black">
        {!reveal ? "" : resource}
      </text>
    </g>
  );
};
