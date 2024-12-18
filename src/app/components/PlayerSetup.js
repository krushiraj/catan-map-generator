"use client";

import React, { useState } from "react";

const PlayerSetup = ({ players, setPlayers, numberOfPlayers }) => {
  const [playerName, setPlayerName] = useState("");
  const [playerColor, setPlayerColor] = useState("");

  const handleAddPlayer = () => {
    if (playerName === "" || playerColor === "") {
      return;
    }
    if (players.length >= numberOfPlayers) {
      return;
    }
    if (players.some((player) => player.name === playerName)) {
      return;
    }
    if (players.some((player) => player.color === playerColor)) {
      return;
    }
    setPlayers([...players, { name: playerName, color: playerColor }]);
    setPlayerName("");
    setPlayerColor("");
  };

  return (
    <div>
      <h2 className="text-black">Player Setup</h2>
      <div>
        <label className="text-black">
          Player Name:
          <input
            className="text-black"
            type="text"
            value={playerName}
            placeholder="Enter Player Name"
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label className="text-black">
          Player Color:
          <select
            className="text-black"
            value={playerColor}
            onChange={(e) => setPlayerColor(e.target.value)}
          >
            <option value="">Select Color</option>
            <option value="#ff0000">Red</option>
            <option value="#0000ff">Blue</option>
            <option value="#008000">Green</option>
            <option value="#a52a2a">Brown</option>
            <option value="#ffa500">Orange</option>
            <option value="#ffffff">White</option>
            <option value="#ffff00">Yellow</option>
          </select>
        </label>
      </div>
      <div>
        <button className="button" onClick={handleAddPlayer}>
          Add Player
        </button>
      </div>
      <div>
        <h3 className="text-black">Players</h3>
        <ul>
          {players.map((player, index) => (
            <li className="text-black" key={index}>
              {player.name} - {player.color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerSetup;
