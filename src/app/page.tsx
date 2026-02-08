"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CatanBoard } from "./components/Map";
import { Header } from "./components/Layout/Header";
import { BottomSheet } from "./components/Controls/BottomSheet";
import { SidePanel } from "./components/Layout/SidePanel";
import { Toast } from "./components/Share/Toast";
import { InstallPrompt } from "./components/InstallPrompt";
import { useMediaLayout } from "./hooks/useMediaLayout";
import { encodeMap, decodeMap, type MapData } from "./utils/mapEncoding";
import type { NumberOfPlayers, Resource, Player } from "./utils/board";

const HomePage = () => {
  const layout = useMediaLayout();

  const [numPlayers, setNumPlayers] = useState<NumberOfPlayers>(4);
  const [noSameResources, setNoSameResources] = useState(false);
  const [noSameNumbers, setNoSameNumbers] = useState(false);
  const [scarceResource, setScarceResource] = useState("");
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [resetMap, setResetMap] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [initialMapData, setInitialMapData] = useState<MapData | null>(null);
  const sharedDataConsumedRef = useRef(false);

  // Refs to access board state from CatanBoard for URL sharing
  const boardDataRef = useRef<{ resource?: Resource; number?: number }[]>([]);
  const housesRef = useRef<Set<string>>(new Set());
  const roadsRef = useRef<Set<string>>(new Set());

  const handleGenerate = useCallback(() => {
    setInitialMapData(null); // Clear shared map data so new board is random
    setResetMap((prev) => !prev);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const encoded = encodeMap(
        boardDataRef.current,
        {
          numPlayers,
          noSameResources,
          noSameNumbers,
          scarceResource,
        },
        housesRef.current,
        roadsRef.current
      );
      const url = `${window.location.origin}${window.location.pathname}?m=${encoded}`;

      if (navigator.share && window.isSecureContext) {
        try {
          await navigator.share({ title: "Catan Map", url });
          return;
        } catch (err) {
          // User dismissed the share sheet — not a real failure
          if (err instanceof DOMException && err.name === "AbortError") return;
          // Other share errors — fall through to clipboard
        }
      }

      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard API may fail on HTTP — use fallback
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast("Link copied to clipboard!");
    } catch {
      setToast("Link copied to clipboard!");
    }
  }, [numPlayers, noSameResources, noSameNumbers, scarceResource]);

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

  // Decode shared map from URL ?m= param on mount
  useEffect(() => {
    if (sharedDataConsumedRef.current) return;
    const encoded = new URLSearchParams(window.location.search).get("m");
    if (!encoded) return;
    const decoded = decodeMap(encoded);
    if (!decoded) return;
    setNumPlayers(decoded.settings.numPlayers);
    setNoSameResources(decoded.settings.noSameResources);
    setNoSameNumbers(decoded.settings.noSameNumbers);
    setScarceResource(decoded.settings.scarceResource);
    setInitialMapData(decoded);
    sharedDataConsumedRef.current = true;
  }, []);

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
      <main className={`flex-1 min-h-0 flex overflow-hidden ${
        layout === "desktop" ? "max-w-[1280px] mx-auto w-full" : ""
      }`}>
        {/* Desktop: Left Panel */}
        {layout === "desktop" && (
          <aside className="w-[300px] shrink-0">
            <SidePanel {...controlProps} />
          </aside>
        )}

        {/* Board Area */}
        <div className="flex-1 min-h-0 flex items-center justify-center relative p-4">
          {/* Vignette overlay */}
          <div className="absolute inset-0 vignette pointer-events-none" />

          <CatanBoard
            numberOfPlayer={numPlayers}
            sameResourcesShouldTouch={!noSameResources}
            sameNumberShouldTouch={!noSameNumbers}
            invertTiles={surpriseMode}
            scarceResource={scarceResource as Resource}
            reset={resetMap}
            players={players}
            boardRef={boardDataRef}
            housesRef={housesRef}
            roadsRef={roadsRef}
            initialBoardData={initialMapData?.hexes}
            initialHouses={initialMapData?.houses}
            initialRoads={initialMapData?.roads}
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

      <Toast message={toast || ""} visible={!!toast} onHide={() => setToast(null)} />
      <InstallPrompt />
    </div>
  );
};

export default HomePage;
