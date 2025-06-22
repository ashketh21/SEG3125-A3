// src/App.jsx
import React, { useState } from 'react';
import GameMenu     from './components/GameMenu';
import MazeGame     from './components/MazeGame';
import GameComplete from './components/GameComplete';

function App() {
  const [appState,   setAppState]   = useState('menu');   // 'menu' | 'playing' | 'completed'
  const [gameConfig, setGameConfig] = useState(null);
  const [gameStats,  setGameStats]  = useState(null);

  const handleStartGame = (config) => {
    setGameConfig(config);
    setAppState('playing');
  };

  const handleGameComplete = (stats) => {
    setGameStats(stats);
    setAppState('completed');
  };

  const handlePlayAgain    = () => gameConfig && setAppState('playing');
  const handleReturnToMenu = () => {
    setAppState('menu');
    setGameConfig(null);
    setGameStats(null);
  };

  return (
    <div className="min-h-screen">
      {appState === 'menu' && (
        <GameMenu onStartGame={handleStartGame} />
      )}

      {appState === 'playing' && gameConfig && (
        <MazeGame
          config={gameConfig}
          onGameComplete={handleGameComplete}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {appState === 'completed' && gameStats && gameConfig && (
        <GameComplete
          stats={gameStats}
          difficulty={gameConfig.difficulty}
          theme={gameConfig.theme}
          playerName={gameConfig.playerName}        // ← pass it here!
          onPlayAgain={handlePlayAgain}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}

export default App;

