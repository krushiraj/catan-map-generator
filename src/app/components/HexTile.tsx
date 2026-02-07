"use client";

import React from "react";

export const resourceColors: Record<string, string> = {
  wood: "#4A9B5A",
  brick: "#E85D4A",
  ore: "#8A9BAE",
  hay: "#E8C44A",
  sheep: "#8BBF7A",
  desert: "#C4956A",
  inverted: "#1A6B6B",
  all: "#C4956A",
};

export const icons: Record<string, string> = {
  wood: "\u{1FAB5}",
  brick: "\u{1F9F1}",
  ore: "\u{1FAA8}",
  hay: "\u{1F33E}",
  sheep: "\u{1F40F}",
  desert: "\u{1F3DC}\uFE0F",
  all: "\u2753",
};

interface HexTileProps {
  x: number;
  y: number;
  rotation: number;
  resource: string;
  number?: number;
  reveal?: boolean;
  animationDelay?: number;
  animationPhase?: "idle" | "tiles" | "colors" | "numbers" | "complete";
  visible?: boolean;
}

export const HexTile: React.FC<HexTileProps> = ({
  x,
  y,
  rotation,
  resource,
  number,
  reveal = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animationDelay = 0,
  animationPhase = "complete",
  visible = true,
}) => {
  const hexPoints = "0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5";
  const showContent = reveal && (animationPhase === "colors" || animationPhase === "numbers" || animationPhase === "complete");
  const showNumbers = reveal && (animationPhase === "numbers" || animationPhase === "complete");
  const color = !reveal ? resourceColors.inverted : resourceColors[resource];
  const isHighProb = number === 6 || number === 8;

  if (!visible && animationPhase !== "complete") return null;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="hex-tile"
    >
      {/* Hex shape */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill={showContent ? color : resourceColors.inverted}
        stroke="#2A2520"
        strokeWidth={0.03}
        style={{
          transition: "fill 0.3s ease",
        }}
      />

      {/* Inner shadow for depth */}
      <polygon
        points={hexPoints}
        transform={`rotate(${rotation})`}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={0.06}
        style={{ pointerEvents: "none" }}
      />

      {/* Resource icon */}
      {showContent && resource !== "desert" && (
        <text
          x="0"
          y="-0.15"
          textAnchor="middle"
          fontSize="0.35"
          style={{
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        >
          {icons[resource]}
        </text>
      )}

      {/* Desert icon */}
      {showContent && resource === "desert" && (
        <text x="0" y="0.1" textAnchor="middle" fontSize="0.4" style={{ pointerEvents: "none" }}>
          {"\u{1F3DC}\uFE0F"}
        </text>
      )}

      {/* Number token */}
      {showNumbers && number && (
        <g style={{ pointerEvents: "none" }}>
          <circle
            cx="0"
            cy="0.35"
            r="0.28"
            fill="#1A1714"
            stroke={isHighProb ? "#E85D4A" : "#2A2520"}
            strokeWidth={0.03}
          />
          <text
            x="0"
            y="0.43"
            textAnchor="middle"
            fontSize="0.25"
            fontWeight="bold"
            fill={isHighProb ? "#E85D4A" : "#F0E6D6"}
            fontFamily="var(--font-geist-sans), system-ui"
          >
            {number}
          </text>
        </g>
      )}

      {/* Hidden state question mark */}
      {!reveal && (
        <text
          x="0"
          y="0.15"
          textAnchor="middle"
          fontSize="0.4"
          fill="#1A6B6B"
          opacity="0.6"
          style={{ pointerEvents: "none" }}
        >
          ?
        </text>
      )}

      {/* Accessibility */}
      <title>
        {reveal ? `${resource} tile${number ? `, number ${number}` : ""}` : "Hidden tile"}
      </title>
    </g>
  );
};
