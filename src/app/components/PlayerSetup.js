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

  const colorOptions = [
    { value: "#ff0000", name: "Red", emoji: "🔴" },
    { value: "#0000ff", name: "Blue", emoji: "🔵" },
    { value: "#008000", name: "Green", emoji: "🟢" },
    { value: "#a52a2a", name: "Brown", emoji: "🟤" },
    { value: "#ffa500", name: "Orange", emoji: "🟠" },
    { value: "#ffffff", name: "White", emoji: "⚪" },
    { value: "#ffff00", name: "Yellow", emoji: "🟡" },
  ];

  const getColorInfo = (colorValue) => {
    return colorOptions.find(color => color.value === colorValue);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Name Input */}
        <div className="control-group">
          <label className="control-label">
            <span className="flex items-center space-x-2">
              <span>👤</span>
              <span>Player Name</span>
            </span>
            <input
              className="text-black"
              type="text"
              value={playerName}
              placeholder="Enter Player Name"
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>
        </div>

        {/* Player Color Select */}
        <div className="control-group">
          <label className="control-label">
            <span className="flex items-center space-x-2">
              <span>🎨</span>
              <span>Player Color</span>
            </span>
            <select
              className="text-black"
              value={playerColor}
              onChange={(e) => setPlayerColor(e.target.value)}
            >
              <option value="">Select Color</option>
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.emoji} {color.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Add Player Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleAddPlayer}
          disabled={!playerName || !playerColor || players.length >= numberOfPlayers}
          className="success disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          ➕ Add Player ({players.length}/{numberOfPlayers})
        </button>
      </div>

      {/* Players List */}
      {players.length > 0 && (
        <div className="control-group">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>👥</span>
            <span>Current Players</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {players.map((player, index) => {
              const colorInfo = getColorInfo(player.color);
              return (
                <div
                  key={index}
                  className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg p-3 
                           border border-white/10 dark:border-gray-600/10
                           flex items-center space-x-3"
                >
                  <span className="text-2xl">{colorInfo?.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-white">{player.name}</div>
                    <div className="text-sm text-gray-300">{colorInfo?.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSetup;
