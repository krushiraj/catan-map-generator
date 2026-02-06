"use client";

import React, { useState, useEffect, useRef } from "react";
import { CatanBoard } from "./components/Map";
import { Header } from "./components/Layout/Header";
import { BottomSheet } from "./components/Controls/BottomSheet";
import { SidePanel } from "./components/Layout/SidePanel";
import { ShareActions } from "./components/Share/ShareActions";
import { useMediaLayout } from "./hooks/useMediaLayout";
import type { NumberOfPlayers, Resource } from "./utils/board";

interface Player {
  name: string;
  color: string;
}

const HomePage = () => {
  const layout = useMediaLayout();
  const boardRef = useRef<HTMLDivElement>(null);

  const [numPlayers, setNumPlayers] = useState<NumberOfPlayers>(4);
  const [noSameResources, setNoSameResources] = useState(false);
  const [noSameNumbers, setNoSameNumbers] = useState(false);
  const [scarceResource, setScarceResource] = useState("");
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [resetMap, setResetMap] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerate = () => {
    setResetMap((prev) => !prev);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const controlProps = {
    numPlayers,
    onNumPlayersChange: setNumPlayers,
    noSameResources,
    onToggleResources: setNoSameResources,
    noSameNumbers,
    onToggleNumbers: setNoSameNumbers,
    scarceResource,
    onScarceChange: setScarceResource,
    surpriseMode,
    onSurpriseToggle: setSurpriseMode,
    onGenerate: handleGenerate,
    isAnimating,
    players,
    setPlayers,
  };

  // Keyboard shortcut: spacebar to regenerate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        surpriseMode={surpriseMode && players.length === numPlayers}
      />

      {/* Main Content */}
      <main className={`flex-1 flex pt-12 overflow-hidden ${
        layout === "desktop" ? "max-w-[1280px] mx-auto w-full" : ""
      }`}>
        {/* Desktop: Left Panel */}
        {layout === "desktop" && (
          <aside className="w-[280px] shrink-0">
            <SidePanel {...controlProps} />
          </aside>
        )}

        {/* Board Area */}
        <div className="flex-1 flex items-center justify-center relative p-4" ref={boardRef}>
          {/* Vignette overlay */}
          <div className="absolute inset-0 vignette pointer-events-none" />

          <CatanBoard
            numberOfPlayer={numPlayers}
            sameResourcesShouldTouch={!noSameResources}
            sameNumberShouldTouch={!noSameNumbers}
            invertTiles={players.length === numPlayers ? surpriseMode : false}
            scarceResource={scarceResource as Resource}
            reset={resetMap}
            players={players as { name: string; color: "red" | "blue" | "green" | "yellow" | "white" | "orange" | "brown" }[]}
          />
        </div>

        {/* Tablet: Right Panel */}
        {layout === "tablet" && (
          <aside className="w-[300px] shrink-0">
            <SidePanel {...controlProps} />
          </aside>
        )}
      </main>

      {/* Mobile: Bottom Sheet */}
      {layout === "mobile" && <BottomSheet {...controlProps} />}

      {/* Share floating button for mobile */}
      {layout === "mobile" && (
        <div className="fixed top-2 right-2 z-50">
          <ShareActions boardRef={boardRef} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
