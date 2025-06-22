import React, { useState } from 'react';

const GameMenu = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('beginner');
  const [theme, setTheme] = useState('dungeon');
  const [mode, setMode] = useState('normal');
  const [hintsEnabled, setHintsEnabled] = useState(true);

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', size: '5×5', time: '5s preview' },
    { value: 'intermediate', label: 'Intermediate', size: '8×8', time: '3s preview' },
    { value: 'advanced', label: 'Advanced', size: '12×12', time: '2s preview' }
  ];

  const themeOptions = [
    { value: 'dungeon', label: 'Dungeon', desc: 'Stone walls' },
    { value: 'forest', label: 'Forest', desc: 'Green hedges' },
    { value: 'scifi', label: 'Sci-Fi', desc: 'Blue corridors' }
  ];

  const getPreviewTime = () => {
    switch (difficulty) {
      case 'beginner': return 5;
      case 'intermediate': return 3;
      case 'advanced': return 2;
      default: return 5;
    }
  };

  const getTimeLimit = () => {
    if (mode !== 'timed') return undefined;
    switch (difficulty) {
      case 'beginner': return 60;
      case 'intermediate': return 90;
      case 'advanced': return 120;
      default: return 60;
    }
  };

  const handleStartGame = () => {
    const config = {
      difficulty,
      theme,
      mode,
      previewTime: getPreviewTime(),
      timeLimit: getTimeLimit(),
      hintsEnabled
    };
    onStartGame(config);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">MazeMemo</h1>
          <p className="text-gray-600">Spatial Memory Challenge</p>
          <p className="text-sm text-gray-500 mt-2">
            Memorize the maze, then navigate with transparent walls!
          </p>
        </div>

        <div className="space-y-6">
          {/* Difficulty */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Difficulty Level</h3>
            <div className="space-y-2">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={`w-full p-3 rounded border-2 text-left transition-colors ${
                    difficulty === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.size} • {option.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-3 rounded border-2 text-center transition-colors ${
                    theme === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Game Mode</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('normal')}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === 'normal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setMode('timed')}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === 'timed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Timed Challenge
              </button>
            </div>
            {mode === 'timed' && (
              <p className="text-sm text-gray-500 mt-1">
                Time limit: {getTimeLimit()}s
              </p>
            )}
          </div>

          {/* Hints */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Hints</h3>
            <button
              onClick={() => setHintsEnabled(!hintsEnabled)}
              className={`px-4 py-2 rounded transition-colors ${
                hintsEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {hintsEnabled ? 'Enabled' : 'Disabled'}
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Show last 3 moves as breadcrumbs
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleStartGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;