"use client";

import React, { useState } from "react";
import PlayerSetup from "./components/PlayerSetup";
import { CatanBoard } from "./components/Map";

import type { NumberOfPlayers } from "./components/Map";
// import InstallPrompt from "./components/InstallPrompt";

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
    <>
      {/* <InstallPrompt /> */}
      <div className="container bg-blue-100">
        <h1 className="header text-black">Catan Map Generator</h1>
        <div className="section flex flex-wrap items-center space-x-4 space-y-2">
          <label className="text-black flex items-center space-x-2">
            <span>Number of Players:</span>
            <select
              className="input text-black"
              value={numPlayers}
              onChange={handleNumPlayersChange}
            >
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </label>
          <label className="text-black flex items-center space-x-2">
            <span>No Same Resources Touch:</span>
            <input
              className="input text-black"
              type="checkbox"
              checked={noSameResources}
              onChange={(e) => setNoSameResources(e.target.checked)}
            />
          </label>
          <label className="text-black flex items-center space-x-2">
            <span>No Same Numbers Touch:</span>
            <input
              className="input text-black"
              type="checkbox"
              checked={noSameNumbers}
              onChange={(e) => setNoSameNumbers(e.target.checked)}
            />
          </label>
          <label className="text-black flex items-center space-x-2">
            <span>Scarce Resource:</span>
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
          <button className="button" onClick={handleGenerateMap}>
            🔁 Generate Map 🔁
          </button>
          <button className="button" onClick={handleSurpriseMode}>
            ‼️ Surprise Mode ‼️
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
      <footer className="footer text-black bg-blue-200 w-full p-4 text-center">
        Made with ❤️ for Catan by{" "}
        <a className="underline hover:text-red-500" href="https://krushiraj.github.io">Krushi Raj Tula</a> - ©{" "}
        {new Date().getFullYear()}
      </footer>
    </>
  );
};

export default HomePage;
