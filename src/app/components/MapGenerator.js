"use client"

import React, { useState, useEffect } from 'react';

const MapGenerator = ({ numPlayers, noSameResources, noSameNumbers, scarceResource, surpriseMode, players }) => {
  const [map, setMap] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    generateMap();
  }, [numPlayers, noSameResources, noSameNumbers, scarceResource]);

  const generateMap = () => {
    // Mock map generation logic
    const generatedMap = [
      { id: 1, resource: 'brick', number: 6 },
      { id: 2, resource: 'wheat', number: 8 },
      { id: 3, resource: 'ore', number: 3 },
      { id: 4, resource: 'wood', number: 4 },
      { id: 5, resource: 'sheep', number: 5 },
      { id: 6, resource: 'brick', number: 9 },
      { id: 7, resource: 'wheat', number: 10 },
      { id: 8, resource: 'ore', number: 11 },
      { id: 9, resource: 'wood', number: 12 },
      { id: 10, resource: 'sheep', number: 2 },
      { id: 11, resource: 'brick', number: 6 },
      { id: 12, resource: 'wheat', number: 8 },
      { id: 13, resource: 'ore', number: 3 },
      { id: 14, resource: 'wood', number: 4 },
      { id: 15, resource: 'sheep', number: 5 },
      { id: 16, resource: 'brick', number: 9 },
    ];
    setMap(generatedMap);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  return (
    <div>
      <h2 className="header">Generated Map</h2>
      {surpriseMode && !revealed ? (
        <div>
          <p>Map is hidden until players place their settlements and roads.</p>
          <button className="button" onClick={handleReveal}>Reveal Map</button>
        </div>
      ) : (
        <div className="map">
          {map.map(tile => (
            <div key={tile.id} className={`map-tile resource-${tile.resource}`}>
              <p>{tile.resource}</p>
              <p>{tile.number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapGenerator;
