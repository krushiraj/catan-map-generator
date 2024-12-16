"use client"

import React, { useState } from 'react';
import MapGenerator from './components/MapGenerator';
import PlayerSetup from './components/PlayerSetup';

const HomePage = () => {
  const [numPlayers, setNumPlayers] = useState(4);
  const [noSameResources, setNoSameResources] = useState(false);
  const [noSameNumbers, setNoSameNumbers] = useState(false);
  const [scarceResource, setScarceResource] = useState('');
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [players, setPlayers] = useState([]);

  const handleGenerateMap = () => {
    // Logic to generate map
  };

  const handleSurpriseMode = () => {
    setSurpriseMode(true);
  };

  const handleNumPlayersChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 4 && value <= 6) {
      setNumPlayers(value);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Catan Map Generator</h1>
      <div className="section">
        <label>
          Number of Players:
          <select
            className="input"
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
        <label>
          No Same Resources Touch:
          <input
            className="input"
            type="checkbox"
            checked={noSameResources}
            onChange={(e) => setNoSameResources(e.target.checked)}
          />
        </label>
      </div>
      <div className="section">
        <label>
          No Same Numbers Touch:
          <input
            className="input"
            type="checkbox"
            checked={noSameNumbers}
            onChange={(e) => setNoSameNumbers(e.target.checked)}
          />
        </label>
      </div>
      <div className="section">
        <label>
          Scarce Resource:
          <select
            className="input"
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
        <PlayerSetup players={players} setPlayers={setPlayers} />
      )}
      <MapGenerator
        numPlayers={numPlayers}
        noSameResources={noSameResources}
        noSameNumbers={noSameNumbers}
        scarceResource={scarceResource}
        surpriseMode={surpriseMode}
        players={players}
      />
    </div>
  );
};

export default HomePage;
