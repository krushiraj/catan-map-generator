"use client"

import React, { useState, useEffect } from 'react';

const MapGenerator = ({ numPlayers, noSameResources, noSameNumbers, scarceResource, surpriseMode, players }) => {
  const [map, setMap] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    generateMap();
  }, [numPlayers, noSameResources, noSameNumbers, scarceResource]);

  const generateMap = () => {
    if (numPlayers < 4 || numPlayers > 6) {
      console.error("Number of players must be between 4 and 6.");
      return;
    }

    const resources = {
      4: { wood: 4, brick: 3, sheep: 4, ore: 3, wheat: 4, desert: 1 },
      5: { wood: 6, brick: 5, sheep: 6, ore: 5, wheat: 6, desert: 2 },
      6: { wood: 6, brick: 5, sheep: 6, ore: 5, wheat: 6, desert: 2 }
    };

    const layout = {
      4: [3, 4, 5, 4, 3],
      5: [3, 4, 5, 6, 5, 4, 3],
      6: [3, 4, 5, 6, 5, 4, 3]
    };

    const numberTokens = {
      4: { 2: 1, 3: 2, 4: 2, 5: 2, 6: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 1 },
      5: { 2: 2, 3: 3, 4: 3, 5: 3, 6: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 2 },
      6: { 2: 2, 3: 3, 4: 3, 5: 3, 6: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 2 }
    };

    const resourceList = [];
    for (const [resource, count] of Object.entries(resources[numPlayers])) {
      for (let i = 0; i < count; i++) {
        resourceList.push(resource);
      }
    }

    const numberTokenList = [];
    for (const [number, count] of Object.entries(numberTokens[numPlayers])) {
      for (let i = 0; i < count; i++) {
        numberTokenList.push(number);
      }
    }

    const generatedMap = [];
    let id = 1;
    for (const row of layout[numPlayers]) {
      const rowTiles = [];
      for (let i = 0; i < row; i++) {
        const resource = resourceList.splice(Math.floor(Math.random() * resourceList.length), 1)[0];
        const number = resource === 'desert' ? null : numberTokenList.splice(Math.floor(Math.random() * numberTokenList.length), 1)[0];
        rowTiles.push({ id: id++, resource, number });
      }
      generatedMap.push(rowTiles);
    }

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
          {map.map((row, rowIndex) => (
            <div key={rowIndex} className="map-row">
              {row.map(tile => (
                <div key={tile.id} className={`map-tile resource-${tile.resource}`}>
                  <p>{tile.resource}</p>
                  <p>{tile.number}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapGenerator;
