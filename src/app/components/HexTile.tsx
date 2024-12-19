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

export const resourceColors: { [key: string]: string } = {
  wood: "#77dd77",
  brick: "#ff9999",
  ore: "#ababab",
  hay: "#fdfd96",
  sheep: "#c1e1c1",
  desert: "#F4D3A0",
  inverted: "#40E0D0",
  all: "#F4D3A0",
};

export const icons: { [key: string]: string } = {
  wood: "🪵",
  brick: "🧱",
  ore: "🪨",
  hay: "🌾",
  sheep: "🐏",
  desert: "🏜️🐫",
  all: "❓"
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
          y="0.5"
          textAnchor="middle"
          fontSize="0.3"
          fill="black"
          fontWeight="bold"
        >
          {!reveal ? "" : number}
        </text>
      )}
      <text x="0" y="-0.3" textAnchor="middle" fontSize="0.25" fill="black">
        {!reveal ? "" : resource}
      </text>
      <text x="0" y="0.1" textAnchor="middle" fontSize="0.3" fill="black">
        {!reveal ? "" : icons[resource]}
      </text>
    </g>
  );
};
