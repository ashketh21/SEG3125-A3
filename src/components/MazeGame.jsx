import React, { useState, useEffect, useCallback } from 'react';

const MazeGame = ({ config, onGameComplete, onReturnToMenu }) => {
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('preview'); // 'preview', 'playing', 'completed', 'failed'
  const [previewTimeLeft, setPreviewTimeLeft] = useState(config.previewTime);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const mazeSize = config.difficulty === 'beginner' ? 5 : config.difficulty === 'intermediate' ? 8 : 12;

  // Generate maze using recursive backtracking algorithm
  const generateMaze = useCallback(() => {
    const newMaze = Array(mazeSize).fill(null).map(() =>
      Array(mazeSize).fill(null).map(() => ({
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
        isStart: false,
        isEnd: false
      }))
    );

    const stack = [];
    const startX = 0, startY = 0;
    
    // Mark starting cell as visited
    newMaze[startY][startX].visited = true;
    stack.push({ x: startX, y: startY });

    const getNeighbors = (x, y) => {
      const neighbors = [];
      // Check all four directions - look at adjacent cells (not 2 steps away)
      if (y > 0 && !newMaze[y - 1][x].visited) neighbors.push({ x, y: y - 1, direction: 'top' });
      if (x < mazeSize - 1 && !newMaze[y][x + 1].visited) neighbors.push({ x: x + 1, y, direction: 'right' });
      if (y < mazeSize - 1 && !newMaze[y + 1][x].visited) neighbors.push({ x, y: y + 1, direction: 'bottom' });
      if (x > 0 && !newMaze[y][x - 1].visited) neighbors.push({ x: x - 1, y, direction: 'left' });
      return neighbors;
    };

    const removeWallBetween = (x1, y1, x2, y2) => {
      // Remove walls between adjacent cells
      if (x1 === x2) { // vertical connection
        if (y1 < y2) { // moving down
          newMaze[y1][x1].walls.bottom = false;
          newMaze[y2][x2].walls.top = false;
        } else { // moving up
          newMaze[y1][x1].walls.top = false;
          newMaze[y2][x2].walls.bottom = false;
        }
      } else { // horizontal connection
        if (x1 < x2) { // moving right
          newMaze[y1][x1].walls.right = false;
          newMaze[y2][x2].walls.left = false;
        } else { // moving left
          newMaze[y1][x1].walls.left = false;
          newMaze[y2][x2].walls.right = false;
        }
      }
    };

    // Generate the maze using recursive backtracking
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getNeighbors(current.x, current.y);

      if (neighbors.length > 0) {
        // Choose random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Mark next cell as visited
        newMaze[next.y][next.x].visited = true;
        
        // Remove walls between current and next
        removeWallBetween(current.x, current.y, next.x, next.y);
        
        stack.push({ x: next.x, y: next.y });
      } else {
        stack.pop();
      }
    }

    // Reset visited flags for pathfinding
    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        newMaze[y][x].visited = false;
      }
    }

    // Set start and end positions
    newMaze[0][0].isStart = true;
    newMaze[mazeSize - 1][mazeSize - 1].isEnd = true;
    
    // Create additional connections to ensure solvability
    const ensureConnectivity = () => {
      // Ensure start has at least one connection
      if (newMaze[0][0].walls.right && newMaze[0][0].walls.bottom) {
        if (mazeSize > 1) {
          newMaze[0][0].walls.right = false;
          newMaze[0][1].walls.left = false;
        }
      }
      
      // Ensure end has at least one connection
      if (newMaze[mazeSize - 1][mazeSize - 1].walls.left && newMaze[mazeSize - 1][mazeSize - 1].walls.top) {
        if (mazeSize > 1) {
          newMaze[mazeSize - 1][mazeSize - 1].walls.left = false;
          newMaze[mazeSize - 1][mazeSize - 2].walls.right = false;
        }
      }
      
      // Add some random connections to increase solvability
      for (let attempts = 0; attempts < mazeSize; attempts++) {
        const x = Math.floor(Math.random() * mazeSize);
        const y = Math.floor(Math.random() * mazeSize);
        
        const directions = ['top', 'right', 'bottom', 'left'];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        
        switch (dir) {
          case 'top':
            if (y > 0) {
              newMaze[y][x].walls.top = false;
              newMaze[y - 1][x].walls.bottom = false;
            }
            break;
          case 'right':
            if (x < mazeSize - 1) {
              newMaze[y][x].walls.right = false;
              newMaze[y][x + 1].walls.left = false;
            }
            break;
          case 'bottom':
            if (y < mazeSize - 1) {
              newMaze[y][x].walls.bottom = false;
              newMaze[y + 1][x].walls.top = false;
            }
            break;
          case 'left':
            if (x > 0) {
              newMaze[y][x].walls.left = false;
              newMaze[y][x - 1].walls.right = false;
            }
            break;
        }
      }
    };

    ensureConnectivity();
    
    // Verify there's a path from start to end using BFS
    const hasPath = () => {
      const queue = [{ x: 0, y: 0 }];
      const visited = new Set();
      visited.add('0,0');
      
      while (queue.length > 0) {
        const { x, y } = queue.shift();
        
        if (x === mazeSize - 1 && y === mazeSize - 1) {
          return true; // Found path to end
        }
        
        const cell = newMaze[y][x];
        
        // Check all four directions
        if (!cell.walls.top && y > 0 && !visited.has(`${x},${y - 1}`)) {
          visited.add(`${x},${y - 1}`);
          queue.push({ x, y: y - 1 });
        }
        if (!cell.walls.right && x < mazeSize - 1 && !visited.has(`${x + 1},${y}`)) {
          visited.add(`${x + 1},${y}`);
          queue.push({ x: x + 1, y });
        }
        if (!cell.walls.bottom && y < mazeSize - 1 && !visited.has(`${x},${y + 1}`)) {
          visited.add(`${x},${y + 1}`);
          queue.push({ x, y: y + 1 });
        }
        if (!cell.walls.left && x > 0 && !visited.has(`${x - 1},${y}`)) {
          visited.add(`${x - 1},${y}`);
          queue.push({ x: x - 1, y });
        }
      }
      
      return false; // No path found
    };
    
    // If still no path exists, create a guaranteed path along edges
    if (!hasPath()) {
      // Create path along right edge, then bottom edge
      for (let y = 0; y < mazeSize - 1; y++) {
        newMaze[y][0].walls.bottom = false;
        newMaze[y + 1][0].walls.top = false;
      }
      for (let x = 0; x < mazeSize - 1; x++) {
        newMaze[mazeSize - 1][x].walls.right = false;
        newMaze[mazeSize - 1][x + 1].walls.left = false;
      }
    }
    
    return newMaze;
  }, [mazeSize]);

  // Initialize maze
  useEffect(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setMoves(0);
    setStartTime(Date.now());
    setBreadcrumbs([]);
  }, [generateMaze]);

  // Preview countdown
  useEffect(() => {
    if (gameState === 'preview' && previewTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPreviewTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'preview' && previewTimeLeft === 0) {
      setGameState('playing');
    }
  }, [gameState, previewTimeLeft]);

  // Game timer for timed mode
  useEffect(() => {
    if (gameState === 'playing' && config.mode === 'timed' && timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev ? prev - 1 : 0);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && config.mode === 'timed' && timeLeft === 0) {
      setGameState('failed');
      onGameComplete({
        moves,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
        completed: false
      });
    }
  }, [gameState, timeLeft, config.mode, moves, startTime, onGameComplete]);

  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && playerPosition.x === mazeSize - 1 && playerPosition.y === mazeSize - 1) {
      setGameState('completed');
      onGameComplete({
        moves,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
        completed: true
      });
    }
  }, [playerPosition, gameState, mazeSize, moves, startTime, onGameComplete]);

  const canMove = useCallback((from, direction) => {
    if (maze.length === 0) return false;
    
    const cell = maze[from.y]?.[from.x]; // Note: y first, then x
    if (!cell) return false;

    switch (direction) {
      case 'up':
        return !cell.walls.top && from.y > 0;
      case 'down':
        return !cell.walls.bottom && from.y < mazeSize - 1;
      case 'left':
        return !cell.walls.left && from.x > 0;
      case 'right':
        return !cell.walls.right && from.x < mazeSize - 1;
      default:
        return false;
    }
  }, [maze, mazeSize]);

  const movePlayer = useCallback((direction) => {
    if (gameState !== 'playing') return;

    const newPosition = { ...playerPosition };
    
    switch (direction) {
      case 'up':
        if (canMove(playerPosition, 'up')) {
          newPosition.y -= 1;
        }
        break;
      case 'down':
        if (canMove(playerPosition, 'down')) {
          newPosition.y += 1;
        }
        break;
      case 'left':
        if (canMove(playerPosition, 'left')) {
          newPosition.x -= 1;
        }
        break;
      case 'right':
        if (canMove(playerPosition, 'right')) {
          newPosition.x += 1;
        }
        break;
    }

    if (newPosition.x !== playerPosition.x || newPosition.y !== playerPosition.y) {
      setPlayerPosition(newPosition);
      setMoves(prev => prev + 1);
      
      // Update breadcrumbs
      setBreadcrumbs(prev => {
        const newBreadcrumbs = [...prev, playerPosition];
        return newBreadcrumbs.slice(-3);
      });
    }
  }, [playerPosition, gameState, canMove]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const getThemeStyles = () => {
    switch (config.theme) {
      case 'dungeon':
        return {
          background: 'bg-gray-800',
          wall: 'bg-yellow-800',
          floor: 'bg-yellow-100',
          player: 'bg-blue-600',
          start: 'bg-green-500',
          end: 'bg-red-500'
        };
      case 'forest':
        return {
          background: 'bg-green-800',
          wall: 'bg-green-600',
          floor: 'bg-green-100',
          player: 'bg-blue-600',
          start: 'bg-yellow-500',
          end: 'bg-purple-500'
        };
      case 'scifi':
        return {
          background: 'bg-blue-900',
          wall: 'bg-cyan-500',
          floor: 'bg-gray-100',
          player: 'bg-orange-500',
          start: 'bg-green-400',
          end: 'bg-red-400'
        };
      default:
        return {
          background: 'bg-gray-100',
          wall: 'bg-gray-800',
          floor: 'bg-white',
          player: 'bg-blue-600',
          start: 'bg-green-500',
          end: 'bg-red-500'
        };
    }
  };

  const themeStyles = getThemeStyles();
  const cellSize = Math.min(400 / mazeSize, 32);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMazeCell = (cell, row, col) => {
    const isPlayer = playerPosition.x === col && playerPosition.y === row;
    const isBreadcrumb = config.hintsEnabled && breadcrumbs.some(pos => pos.x === col && pos.y === row);
    const isTransparent = gameState === 'playing';
    
    return (
      <div
        key={`${row}-${col}`}
        className={`relative ${themeStyles.floor}`}
        style={{ width: cellSize, height: cellSize }}
      >
        {/* Walls */}
        {cell.walls.top && (
          <div
            className={`absolute top-0 left-0 right-0 ${themeStyles.wall} ${isTransparent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{ height: 2 }}
          />
        )}
        {cell.walls.right && (
          <div
            className={`absolute top-0 right-0 bottom-0 ${themeStyles.wall} ${isTransparent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{ width: 2 }}
          />
        )}
        {cell.walls.bottom && (
          <div
            className={`absolute bottom-0 left-0 right-0 ${themeStyles.wall} ${isTransparent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{ height: 2 }}
          />
        )}
        {cell.walls.left && (
          <div
            className={`absolute top-0 left-0 bottom-0 ${themeStyles.wall} ${isTransparent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{ width: 2 }}
          />
        )}
        
        {/* Start marker */}
        {cell.isStart && (
          <div className={`absolute inset-0 ${themeStyles.start} opacity-30 flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">S</span>
          </div>
        )}
        
        {/* End marker */}
        {cell.isEnd && (
          <div className={`absolute inset-0 ${themeStyles.end} opacity-30 flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">E</span>
          </div>
        )}
        
        {/* Breadcrumb */}
        {isBreadcrumb && gameState === 'playing' && (
          <div className="absolute inset-0 bg-yellow-400 opacity-40 rounded-full m-1" />
        )}
        
        {/* Player */}
        {isPlayer && (
          <div className={`absolute inset-0 ${themeStyles.player} rounded-full m-1 flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">P</span>
          </div>
        )}
      </div>
    );
  };

  if (maze.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Generating maze...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.background} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onReturnToMenu}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Menu
              </button>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Moves:</span>
                <span className="bg-gray-200 px-3 py-1 rounded">{moves}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {config.mode === 'timed' && timeLeft !== undefined && (
                <div className="flex items-center gap-2">
                  <span>Time:</span>
                  <span className={`font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-black'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
              {config.hintsEnabled && (
                <span className="text-sm text-gray-600">Hints ON</span>
              )}
            </div>
          </div>
        </div>

        {/* Game Status */}
        {gameState === 'preview' && (
          <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 text-center">
            <h2 className="text-xl font-bold mb-2">Memorize the Maze!</h2>
            <p>Time remaining: {previewTimeLeft} seconds</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center">
            <h2 className="text-xl font-bold">Navigate to the Exit!</h2>
            <p>Walls are now transparent - use your memory!</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Maze */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-lg p-4">
              <div className="grid gap-0 border-2 border-gray-300 rounded overflow-hidden" style={{
                gridTemplateColumns: `repeat(${mazeSize}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${mazeSize}, ${cellSize}px)`
              }}>
                {maze.map((row, rowIndex) =>
                  row.map((cell, colIndex) => renderMazeCell(cell, rowIndex, colIndex))
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Controls</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div></div>
                <button
                  onClick={() => movePlayer('up')}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded transition-colors flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  ↑
                </button>
                <div></div>
                
                <button
                  onClick={() => movePlayer('left')}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded transition-colors flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  ←
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('right')}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded transition-colors flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  →
                </button>
                
                <div></div>
                <button
                  onClick={() => movePlayer('down')}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded transition-colors flex items-center justify-center"
                  disabled={gameState !== 'playing'}
                >
                  ↓
                </button>
                <div></div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Use arrow keys or WASD to move
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${themeStyles.start} rounded`}></div>
                  <span>Start Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${themeStyles.end} rounded`}></div>
                  <span>Exit Goal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${themeStyles.player} rounded-full`}></div>
                  <span>Your Position</span>
                </div>
                {config.hintsEnabled && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    <span>Breadcrumb Trail</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;