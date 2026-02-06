"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CatanBoard } from "./components/Map";
import { Header } from "./components/Layout/Header";
import { BottomSheet } from "./components/Controls/BottomSheet";
import { SidePanel } from "./components/Layout/SidePanel";
import { useMediaLayout } from "./hooks/useMediaLayout";
import type { NumberOfPlayers, Resource, Player } from "./utils/board";

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

  const handleGenerate = useCallback(() => {
    setResetMap((prev) => !prev);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1200);
  }, []);

  const handleShare = useCallback(async () => {
    if (!boardRef.current) return;
    const { toPng } = await import("html-to-image");
    try {
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0D0D0F",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "catan-map.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ title: "Catan Map", files: [file] });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      }
    } catch {
      // silently fail
    }
  }, []);

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
  }, [handleGenerate]);

  if (!layout) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        surpriseMode={surpriseMode && players.length === numPlayers}
        onShare={handleShare}
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
            players={players}
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
    </div>
  );
};

export default HomePage;
