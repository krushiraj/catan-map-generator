"use client";

import React, { useState } from "react";
import PlayerSetup from "./components/PlayerSetup";
import { CatanBoard } from "./components/Map";

import type { NumberOfPlayers, Resource } from "./components/Map";
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
    <div className="min-h-screen flex flex-col">
      {/* <InstallPrompt /> */}
      <main className="flex-1 animate-fade-in">
        <div className="container">
          <h1 className="header">🏝️ Catan Map Generator</h1>
          
          {/* Control Panel */}
          <div className="section">
            <div className="control-panel">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                🎮 Game Configuration
              </h2>
              
              <div className="controls-grid">
                {/* Number of Players */}
                <div className="control-group">
                  <label className="control-label">
                    <span className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>Number of Players</span>
                    </span>
                    <select
                      className="text-black"
                      value={numPlayers}
                      onChange={handleNumPlayersChange}
                    >
                      <option value={4}>4 Players</option>
                      <option value={5}>5 Players</option>
                      <option value={6}>6 Players</option>
                    </select>
                  </label>
                </div>

                {/* Resource Rules */}
                <div className="control-group">
                  <label className="control-label-horizontal">
                    <span className="flex items-center space-x-2">
                      <span>🚫</span>
                      <span>No Same Resources Touch</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={noSameResources}
                      onChange={(e) => setNoSameResources(e.target.checked)}
                    />
                  </label>
                </div>

                {/* Number Rules */}
                <div className="control-group">
                  <label className="control-label-horizontal">
                    <span className="flex items-center space-x-2">
                      <span>🔢</span>
                      <span>No Same Numbers Touch</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={noSameNumbers}
                      onChange={(e) => setNoSameNumbers(e.target.checked)}
                    />
                  </label>
                </div>

                {/* Scarce Resource */}
                <div className="control-group">
                  <label className="control-label">
                    <span className="flex items-center space-x-2">
                      <span>💎</span>
                      <span>Scarce Resource</span>
                    </span>
                    <select
                      className="text-black"
                      value={scarceResource}
                      onChange={(e) => {
                        if (e.target.value === "random") {
                          const resources = ["brick", "hay", "ore", "wood", "sheep"];
                          setScarceResource(
                            resources[Math.floor(Math.random() * resources.length)]
                          );
                          return;
                        }
                        setScarceResource(e.target.value);
                      }}
                    >
                      <option value="">None</option>
                      <option value="brick">🧱 Brick</option>
                      <option value="hay">🌾 Hay</option>
                      <option value="ore">🪨 Ore</option>
                      <option value="wood">🪵 Wood</option>
                      <option value="sheep">🐏 Sheep</option>
                      <option value="random">🎲 Random</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button onClick={handleGenerateMap} className="success">
                  🔄 Generate New Map
                </button>
                <button onClick={handleSurpriseMode} className="secondary">
                  {surpriseMode ? "🙈 Hide Surprise Mode" : "🎉 Surprise Mode"}
                </button>
              </div>
            </div>
          </div>

          {/* Player Setup */}
          {surpriseMode && (
            <div className="section animate-fade-in">
              <div className="control-panel">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                  👥 Player Setup
                </h2>
                <PlayerSetup
                  players={players}
                  setPlayers={setPlayers}
                  numberOfPlayers={numPlayers}
                />
              </div>
            </div>
          )}

          {/* Game Board */}
          <div className="section">
            <div className="map-container">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                🗺️ Game Board
              </h2>
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
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="flex items-center space-x-2">
            <span>Made with</span>
            <span className="text-red-400 animate-pulse">❤️</span>
            <span>for Catan by</span>
          </span>
          <a
            className="font-medium text-amber-400 hover:text-amber-300 underline decoration-amber-400 hover:decoration-amber-300 transition-colors duration-200"
            href="https://krushiraj.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Krushi Raj Tula
          </a>
          <span className="text-gray-300">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
