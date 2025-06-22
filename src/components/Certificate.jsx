// src/components/Certificate.jsx
import React from 'react';

const Certificate = ({
  stats,
  difficulty,
  theme,
  playerName = 'Player'     // if nothign come here, we deflt to “Player”
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':      return 'text-green-600';
      case 'intermediate':  return 'text-yellow-600';
      case 'advanced':      return 'text-red-600';
      default:              return 'text-gray-600';
    }
  };
// emoji cool fr
  const getThemeEmoji = (gameTheme) => {
    switch (gameTheme) {
      case 'dungeon':  return '🏰';
      case 'forest':   return '🌲';
      case 'scifi':    return '🚀';
      default:         return '🎯';
    }
  };

  const downloadCertificate = () => {
    const certificateText = `
MAZEMEMORY CHAMPION CERTIFICATE

This certifies that ${playerName} has successfully completed
the MazeMemo challenge!

Details:
• Difficulty: ${difficulty.toUpperCase()}
• Theme: ${theme.toUpperCase()} ${getThemeEmoji(theme)}
• Time: ${formatTime(stats.timeElapsed)}
• Moves: ${stats.moves}

Awarded on: ${new Date().toLocaleDateString()}

Congratulations on your spatial memory mastery!
    `.trim();

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mazememory-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCertificate = () => {
    const shareText = `🏆 I just completed MazeMemo on ${difficulty} difficulty in ${formatTime(
      stats.timeElapsed
    )}! Can you match my aura, skills and big brain energy? 🧠✨`;

    if (navigator.share) {
      navigator.share({
        title: 'MazeMemo Achievement',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Achievement copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center border-4 border-yellow-400">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">🏆</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Certificate of Achievement
        </h1>
        <div className="w-32 h-1 bg-yellow-500 mx-auto rounded-full"></div>
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-600 mb-4">This certifies that</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {playerName}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          has successfully completed the{' '}
          <span className="font-semibold">MazeMemo</span> spatial memory challenge!
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Achievement Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-600">Difficulty</p>
            <p className={`font-bold text-lg ${getDifficultyColor(difficulty)}`}>
              {difficulty.toUpperCase()}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-600">Theme</p>
            <p className="font-bold text-lg text-gray-800">
              {theme.toUpperCase()} {getThemeEmoji(theme)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-600">Total Completion Time</p>
            <p className="font-bold text-lg text-blue-600">
              {formatTime(stats.timeElapsed)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-600">Total Moves Made</p>
            <p className="font-bold text-lg text-green-600">
              {stats.moves}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Awarded on {new Date().toLocaleDateString()} • MazeMemo Winner Winner Chicken Dinner
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={downloadCertificate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download Certificate
        </button>
        <button
          onClick={shareCertificate}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Share Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
