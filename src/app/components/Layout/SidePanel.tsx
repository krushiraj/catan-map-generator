"use client";

import React from "react";
import type { NumberOfPlayers } from "../../utils/board";
import { GenerateButton } from "../Controls/GenerateButton";
import { PlayerCountPills } from "../Controls/PlayerCountPills";
import { ConstraintToggles } from "../Controls/ConstraintToggles";
import { ScarceResourcePicker } from "../Controls/ScarceResourcePicker";
import { SurpriseToggle } from "../Controls/SurpriseToggle";
import { PlayerSetup } from "../Players/PlayerSetup";

interface Player {
  name: string;
  color: string;
}

interface SidePanelProps {
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
}

export const SidePanel: React.FC<SidePanelProps> = (props) => {
  return (
    <div className="h-full overflow-y-auto bg-bg-surface border-l border-border p-5 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PlayerCountPills value={props.numPlayers} onChange={props.onNumPlayersChange} />
      </div>

      <GenerateButton onClick={props.onGenerate} isAnimating={props.isAnimating} />

      <div className="h-px bg-border" />

      <ConstraintToggles
        noSameResources={props.noSameResources}
        noSameNumbers={props.noSameNumbers}
        onToggleResources={props.onToggleResources}
        onToggleNumbers={props.onToggleNumbers}
      />

      <div className="h-px bg-border" />

      <ScarceResourcePicker value={props.scarceResource} onChange={props.onScarceChange} />

      <div className="h-px bg-border" />

      <SurpriseToggle enabled={props.surpriseMode} onToggle={props.onSurpriseToggle} />

      {props.surpriseMode && (
        <>
          <div className="h-px bg-border" />
          <PlayerSetup
            players={props.players}
            setPlayers={props.setPlayers}
            numberOfPlayers={props.numPlayers}
          />
        </>
      )}
    </div>
  );
};
