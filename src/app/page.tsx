"use client";

import React, { useState } from "react";
import PlayerSetup from "./components/PlayerSetup";
import { CatanBoard } from "./components/Map";

import type { NumberOfPlayers } from "./components/Map";

const HomePage = () => {
  const [numPlayers, setNumPlayers] = useState<NumberOfPlayers>(4);
  const [noSameResources, setNoSameResources] = useState(false);
  const [noSameNumbers, setNoSameNumbers] = useState(false);
  const [scarceResource, setScarceResource] = useState("");
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [players, setPlayers] = useState([]);
  const [resetMap, setResetMap] = useState(false);

  const handleGenerateMap = () => {
    setResetMap(!resetMap);
  };

  const handleSurpriseMode = () => {
    setSurpriseMode(!surpriseMode);
  };

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 4 && value <= 6) {
      setNumPlayers(value as NumberOfPlayers);
    }
  };

  return (
    <div className="container bg-blue-100">
      <h1 className="header text-black">Catan Map Generator</h1>
      <div className="section">
        <label className="text-black">
          Number of Players:
          <select
            className="input text-black"
            value={numPlayers}
            onChange={handleNumPlayersChange}
          >
            <option value={4}>4 Players</option>
            <option value={5}>5 Players</option>
            <option value={6}>6 Players</option>
          </select>
        </label>
      </div>
      <div className="section">
        <label className="text-black">
          No Same Resources Touch:
          <input
            className="input text-black"
            type="checkbox"
            checked={noSameResources}
            onChange={(e) => setNoSameResources(e.target.checked)}
          />
        </label>
      </div>
      <div className="section">
        <label className="text-black">
          No Same Numbers Touch:
          <input
            className="input text-black"
            type="checkbox"
            checked={noSameNumbers}
            onChange={(e) => setNoSameNumbers(e.target.checked)}
          />
        </label>
      </div>
      <div className="section">
        <label className="text-black">
          Scarce Resource:
          <select
            className="input text-black"
            value={scarceResource}
            onChange={(e) => setScarceResource(e.target.value)}
          >
            <option value="">None</option>
            <option value="brick">Brick</option>
            <option value="wheat">Wheat</option>
            <option value="ore">Ore</option>
            <option value="wood">Wood</option>
            <option value="sheep">Sheep</option>
            <option value="random">Random</option>
          </select>
        </label>
      </div>
      <div className="section">
        <button className="button" onClick={handleGenerateMap}>
          Generate Map
        </button>
      </div>
      <div className="section">
        <button className="button" onClick={handleSurpriseMode}>
          Surprise Mode
        </button>
      </div>
      {surpriseMode && (
        <PlayerSetup
          players={players}
          setPlayers={setPlayers}
          numberOfPlayers={numPlayers}
        />
      )}
      <CatanBoard
        numberOfPlayer={numPlayers}
        sameResourcesShouldTouch={!noSameResources}
        sameNumberShouldTouch={!noSameNumbers}
        invertTiles={players.length === numPlayers ? surpriseMode : false}
        scarceResource="desert"
        reset={resetMap}
        players={players}
      />
    </div>
  );
};

export default HomePage;
