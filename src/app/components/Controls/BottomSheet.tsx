"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import type { NumberOfPlayers, Player } from "../../utils/board";
import { GenerateButton } from "./GenerateButton";
import { PlayerCountPills } from "./PlayerCountPills";
import { ConstraintToggles } from "./ConstraintToggles";
import { ScarceResourcePicker } from "./ScarceResourcePicker";
import { SurpriseToggle } from "./SurpriseToggle";
import { PlayerSetup } from "../Players/PlayerSetup";

interface BottomSheetProps {
  numPlayers: NumberOfPlayers;
  onNumPlayersChange: (count: NumberOfPlayers) => void;
  noSameResources: boolean;
  onToggleResources: (value: boolean) => void;
  noSameNumbers: boolean;
  onToggleNumbers: (value: boolean) => void;
  scarceResource: string;
  onScarceChange: (resource: string) => void;
  surpriseMode: boolean;
  onSurpriseToggle: (value: boolean) => void;
  onGenerate: () => void;
  isAnimating: boolean;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  locked?: boolean;
}

const COLLAPSED_HEIGHT = 148;

export const BottomSheet: React.FC<BottomSheetProps> = ({
  numPlayers,
  onNumPlayersChange,
  noSameResources,
  onToggleResources,
  noSameNumbers,
  onToggleNumbers,
  scarceResource,
  onScarceChange,
  surpriseMode,
  onSurpriseToggle,
  onGenerate,
  isAnimating,
  players,
  setPlayers,
}) => {
  const [sheetHeight, setSheetHeight] = useState(COLLAPSED_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const getSnapPoints = useCallback(() => {
    const vh = window.innerHeight;
    return [COLLAPSED_HEIGHT, vh * 0.5, vh * 0.92];
  }, []);

  const snapToNearest = useCallback((height: number) => {
    const snaps = getSnapPoints();
    let closest = snaps[0];
    let minDist = Math.abs(height - snaps[0]);
    for (const snap of snaps) {
      const dist = Math.abs(height - snap);
      if (dist < minDist) {
        minDist = dist;
        closest = snap;
      }
    }
    setSheetHeight(closest);
  }, [getSnapPoints]);

  // Touch handlers on the entire sheet — every swipe drags the sheet
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = sheetHeight;
  }, [sheetHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const maxH = window.innerHeight * 0.92;
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(maxH, dragStartHeight.current + deltaY));
    setSheetHeight(newHeight);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToNearest(sheetHeight);
  }, [isDragging, sheetHeight, snapToNearest]);

  // Mouse support for desktop testing
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = dragStartY.current - e.clientY;
      const maxH = window.innerHeight * 0.92;
      const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(maxH, dragStartHeight.current + deltaY));
      setSheetHeight(newHeight);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      snapToNearest(sheetHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, sheetHeight, snapToNearest]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = sheetHeight;
  }, [sheetHeight]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl bg-bg-surface border-t border-border cursor-grab active:cursor-grabbing"
      style={{
        height: sheetHeight,
        touchAction: "none",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
        <div className="w-9 h-1 rounded-full bg-text-secondary/40" />
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mt-2">
          Settings
        </span>
      </div>

      {/* Collapsed content - always visible */}
      <div className="px-4 pb-3 flex items-center justify-between gap-3 shrink-0">
        <PlayerCountPills value={numPlayers} onChange={onNumPlayersChange} />
        <GenerateButton onClick={onGenerate} isAnimating={isAnimating} />
      </div>

      {/* Expanded content */}
      <div className="flex-1 min-h-0 overflow-hidden overscroll-contain scrollbar-thin pl-4 pr-6 pb-8">
        <div className="h-px bg-border mb-4" />

        <ConstraintToggles
          noSameResources={noSameResources}
          noSameNumbers={noSameNumbers}
          onToggleResources={onToggleResources}
          onToggleNumbers={onToggleNumbers}
        />

        <div className="h-px bg-border my-4" />

        <ScarceResourcePicker value={scarceResource} onChange={onScarceChange} />

        <div className="h-px bg-border my-4" />

        <SurpriseToggle
          enabled={surpriseMode}
          onToggle={onSurpriseToggle}
        />

        {surpriseMode && (
          <>
            <div className="h-px bg-border my-4" />
            <PlayerSetup
              players={players}
              setPlayers={setPlayers}
              numberOfPlayers={numPlayers}
            />
          </>
        )}
      </div>
    </div>
  );
};
