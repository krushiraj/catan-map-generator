"use client";

import React from "react";
import { Drawer } from "vaul";
import type { NumberOfPlayers } from "../../utils/board";
import { GenerateButton } from "./GenerateButton";
import { PlayerCountPills } from "./PlayerCountPills";
import { ConstraintToggles } from "./ConstraintToggles";
import { ScarceResourcePicker } from "./ScarceResourcePicker";
import { SurpriseToggle } from "./SurpriseToggle";
import { PlayerSetup } from "../Players/PlayerSetup";

interface Player {
  name: string;
  color: string;
}

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
  return (
    <Drawer.Root
      snapPoints={["148px", 0.45, 0.85]}
      activeSnapPoint="148px"
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl bg-bg-surface border-t border-border"
          style={{ maxHeight: "85vh" }}
        >
          {/* Drag Handle */}
          <Drawer.Handle className="mx-auto mt-3 mb-2 w-9 h-1 rounded-full bg-text-secondary/40" />

          {/* Collapsed content - always visible */}
          <div className="px-4 pb-3 flex items-center justify-between gap-3">
            <PlayerCountPills value={numPlayers} onChange={onNumPlayersChange} />
            <GenerateButton onClick={onGenerate} isAnimating={isAnimating} />
          </div>

          {/* Scrollable expanded content */}
          <div className="overflow-y-auto px-4 pb-8 space-y-6">
            <div className="h-px bg-border" />

            <ConstraintToggles
              noSameResources={noSameResources}
              noSameNumbers={noSameNumbers}
              onToggleResources={onToggleResources}
              onToggleNumbers={onToggleNumbers}
            />

            <div className="h-px bg-border" />

            <ScarceResourcePicker value={scarceResource} onChange={onScarceChange} />

            <div className="h-px bg-border" />

            <SurpriseToggle
              enabled={surpriseMode}
              onToggle={onSurpriseToggle}
            />

            <div className="h-px bg-border" />

            {surpriseMode && (
              <PlayerSetup
                players={players}
                setPlayers={setPlayers}
                numberOfPlayers={numPlayers}
              />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
