import React from 'react';
import Certificate from './Certificate';

const GameComplete = ({ stats, difficulty, theme, onPlayAgain, onReturnToMenu }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    if (!stats.completed) {
      return { rating: 'Try Again', color: 'text-red-500', message: 'Don\'t give up! Practice makes perfect.' };
    }

    const timeScore = stats.timeElapsed;
    const moveScore = stats.moves;
    
    if (timeScore < 30 && moveScore < 20) {
      return { rating: 'Master', color: 'text-purple-500', message: 'Incredible spatial memory skills!' };
    } else if (timeScore < 60 && moveScore < 40) {
      return { rating: 'Expert', color: 'text-blue-500', message: 'Excellent navigation and memory!' };
    } else if (timeScore < 120 && moveScore < 80) {
      return { rating: 'Skilled', color: 'text-green-500', message: 'Great job completing the challenge!' };
    } else {
      return { rating: 'Completed', color: 'text-yellow-500', message: 'Well done! Keep practicing to improve.' };
    }
  };

  const performance = getPerformanceRating();

  if (!stats.completed) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">⏰</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Time's Up!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Don't beat yourself - even the best maze runners need practice!
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Moves Made</p>
                <p className="text-2xl font-bold">{stats.moves}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Time Taken</p>
                <p className="text-2xl font-bold">{formatTime(stats.timeElapsed)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onReturnToMenu}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">🏆</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Congratulations!</h1>
          <p className="text-2xl text-gray-600 mb-2">You've mastered the MazeMemo challenge!</p>
          <p className={`text-3xl font-bold ${performance.color} mb-4`}>{performance.rating}</p>
          <p className="text-lg text-gray-500">{performance.message}</p>
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <span className="text-2xl mb-2 block">⏱️</span>
              <p className="text-sm text-gray-600">Completion Time</p>
              <p className="text-2xl font-bold">{formatTime(stats.timeElapsed)}</p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <span className="text-2xl mb-2 block">👣</span>
              <p className="text-sm text-gray-600">Total Moves</p>
              <p className="text-2xl font-bold">{stats.moves}</p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <span className="text-2xl mb-2 block">🏆</span>
              <p className="text-sm text-gray-600">Difficulty</p>
              <p className="text-2xl font-bold capitalize">{difficulty}</p>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="mb-8">
          <Certificate
            stats={stats}
            difficulty={difficulty}
            theme={theme}
            playerName="Maze Master"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Play Again
          </button>
          <button
            onClick={onReturnToMenu}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;