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
  wood: "#2d5016",
  brick: "#8b4513",
  ore: "#4a4a4a",
  hay: "#daa520",
  sheep: "#90ee90",
  desert: "#deb887",
  inverted: "#40E0D0",
  all: "#F4D3A0",
};

// Lighter versions for hover effects
export const resourceColorsHover: { [key: string]: string } = {
  wood: "#3a6b1e",
  brick: "#a0522d",
  ore: "#5a5a5a",
  hay: "#ffd700",
  sheep: "#98fb98",
  desert: "#f5deb3",
  inverted: "#48f0e0",
  all: "#f8e7b7",
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
  const baseColor = !reveal ? resourceColors.inverted : resourceColors[resource];
  const hoverColor = !reveal ? resourceColorsHover.inverted : resourceColorsHover[resource];
  const color = isHovered ? hoverColor : baseColor;
  const scale = isHovered ? 1.08 : 1;
  const strokeWidth = isHovered ? 0.06 : 0.03;
  const strokeColor = isHovered ? "#fff" : "#000";

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      style={{ transition: "all 0.2s ease-in-out", cursor: "pointer" }}
    >
      {/* Hex shadow for depth */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation}) translate(0.02, 0.02)`}
        fill="rgba(0,0,0,0.2)"
        stroke="none"
      />
      {/* Main hex */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter={isHovered ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.3))" : "none"}
      />
      {/* Number display */}
      {number && (
        <circle
          cx="0"
          cy="0.35"
          r="0.25"
          fill={isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)"}
          stroke="#333"
          strokeWidth="0.02"
        />
      )}
      {number && (
        <text
          x="0"
          y="0.4"
          textAnchor="middle"
          fontSize="0.25"
          fill="#333"
          fontWeight="bold"
          fontFamily="serif"
        >
          {!reveal ? "" : number}
        </text>
      )}
      {/* Resource label */}
      <text 
        x="0" 
        y="-0.3" 
        textAnchor="middle" 
        fontSize="0.18" 
        fill={isHovered ? "#fff" : "#000"}
        fontWeight="500"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
        {!reveal ? "" : resource.toUpperCase()}
      </text>
      {/* Resource icon */}
      <text 
        x="0" 
        y="0.05" 
        textAnchor="middle" 
        fontSize="0.35" 
        style={{ filter: isHovered ? "drop-shadow(0px 0px 4px rgba(0,0,0,0.5))" : "none" }}
      >
        {!reveal ? "" : icons[resource]}
      </text>
    </g>
  );
};
