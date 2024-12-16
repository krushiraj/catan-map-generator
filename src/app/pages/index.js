import React, { useState } from 'react';
import MapGenerator from '../components/MapGenerator';
import PlayerSetup from '../components/PlayerSetup';

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

  return (
    <div>
      <h1>Catan Map Generator</h1>
      <div>
        <label>
          Number of Players:
          <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))}>
            <option value={4}>4 Players</option>
            <option value={6}>6 Players</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          No Same Resources Touch:
          <input type="checkbox" checked={noSameResources} onChange={(e) => setNoSameResources(e.target.checked)} />
        </label>
      </div>
      <div>
        <label>
          No Same Numbers Touch:
          <input type="checkbox" checked={noSameNumbers} onChange={(e) => setNoSameNumbers(e.target.checked)} />
        </label>
      </div>
      <div>
        <label>
          Scarce Resource:
          <select value={scarceResource} onChange={(e) => setScarceResource(e.target.value)}>
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
      <div>
        <button onClick={handleGenerateMap}>Generate Map</button>
      </div>
      <div>
        <button onClick={handleSurpriseMode}>Surprise Mode</button>
      </div>
      {surpriseMode && <PlayerSetup players={players} setPlayers={setPlayers} />}
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
