import React, { useState } from 'react';

const PlayerSetup = ({ players, setPlayers }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState('');

  const handleAddPlayer = () => {
    setPlayers([...players, { name: playerName, color: playerColor }]);
    setPlayerName('');
    setPlayerColor('');
  };

  return (
    <div>
      <h2>Player Setup</h2>
      <div>
        <label>
          Player Name:
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Player Color:
          <select
            value={playerColor}
            onChange={(e) => setPlayerColor(e.target.value)}
          >
            <option value="">Select Color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="brown">Brown</option>
            <option value="orange">Orange</option>
            <option value="white">White</option>
            <option value="yellow">Yellow</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
      <div>
        <h3>Players</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              {player.name} - {player.color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerSetup;
