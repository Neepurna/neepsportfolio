import { useEffect, useRef, useState } from 'react';
import './FlappyBird.css';

const FlappyBird = () => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  
  // Game state
  const gameState = useRef({
    gravity: 0.1, // Significantly reduced from 0.25 to 0.1
    playerY: 150, // Start player more centered
    playerVelocity: 0,
    obstacles: [] as { x: number, height: number, passed: boolean, icon: string }[],
    gameLoopId: 0,
    timerIntervalId: 0,
    lastJumpTime: 0, // Track last jump for cooldown
  });

  // Icons to use as obstacles
  const icons = [
    '/icons/react.svg',
    '/icons/javascript.svg',
    '/icons/typescript.svg',
    '/icons/node-js.svg',
    '/icons/python.svg',
    '/icons/vscode.svg',
    '/icons/Github.svg',
    '/icons/blender.svg',
    '/icons/artstation.svg',
    '/icons/unity.svg',
    '/icons/firebase.svg',
    '/icons/solidity.svg',
  ];

  const startGame = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTime(0);
    
    gameState.current = {
      ...gameState.current,
      gravity: 0.1,
      playerY: 150, // Start in middle
      playerVelocity: 0,
      obstacles: [],
      lastJumpTime: 0,
    };
    
    // Start game loop at 60fps (16.67ms)
    gameState.current.gameLoopId = window.setInterval(gameLoop, 16);
    
    // Start timer
    gameState.current.timerIntervalId = window.setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const gameLoop = () => {
    if (!gameAreaRef.current || !playerRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const player = playerRef.current.getBoundingClientRect();
    
    // Apply gravity (but limit maximum falling speed)
    gameState.current.playerVelocity += gameState.current.gravity;
    if (gameState.current.playerVelocity > 5) {
      gameState.current.playerVelocity = 5; // Cap maximum falling speed
    }
    
    gameState.current.playerY += gameState.current.playerVelocity;
    
    // Update player position
    if (playerRef.current) {
      playerRef.current.style.top = `${gameState.current.playerY}px`;
    }
    
    // Check for collisions with floor and ceiling
    if (gameState.current.playerY <= 0 || 
        gameState.current.playerY >= gameArea.height - player.height) {
      endGame();
      return;
    }
    
    // Generate new obstacles
    if (gameState.current.obstacles.length === 0 || 
        gameState.current.obstacles[gameState.current.obstacles.length - 1].x < gameArea.width - 250) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      // Ensure obstacle height is not too extreme (keep it between 30% and 70% of game area)
      const minHeight = gameArea.height * 0.3;
      const maxHeight = gameArea.height * 0.7;
      const randomHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      gameState.current.obstacles.push({
        x: gameArea.width,
        height: randomHeight,
        passed: false,
        icon: randomIcon
      });
    }
    
    // Move obstacles
    gameState.current.obstacles = gameState.current.obstacles
      .filter(obstacle => obstacle.x > -50)
      .map(obstacle => {
        // Check if player passed the obstacle
        if (!obstacle.passed && obstacle.x < player.left) {
          obstacle.passed = true;
          setScore(prevScore => prevScore + 1);
        }
        
        // Check for collision - more forgiving hit detection
        const gapSize = 130; // Increased gap size
        const verticalBufferZone = 15; // Give player some buffer for more forgiving collisions
        
        if (
          player.right > obstacle.x && 
          player.left < obstacle.x + 50 &&
          (player.top < obstacle.height - gapSize/2 + verticalBufferZone || 
           player.bottom > obstacle.height + gapSize/2 - verticalBufferZone)
        ) {
          endGame();
        }
        
        return {
          ...obstacle,
          x: obstacle.x - 2 // Move obstacle left
        };
      });
    
    // Update DOM for obstacles
    updateObstacles();
  };

  const updateObstacles = () => {
    if (!gameAreaRef.current) return;
    
    // Remove all existing obstacles from DOM
    const existingObstacles = gameAreaRef.current.querySelectorAll('.obstacle');
    existingObstacles.forEach(obstacle => obstacle.remove());
    
    // Add updated obstacles
    gameState.current.obstacles.forEach(obstacle => {
      const obstacleEl = document.createElement('div');
      obstacleEl.className = 'obstacle';
      obstacleEl.style.left = `${obstacle.x}px`;
      
      // The gap size is now 130px
      const gapSize = 130; 
      
      // Top pipe
      const topPipe = document.createElement('div');
      topPipe.className = 'pipe top';
      topPipe.style.height = `${obstacle.height - gapSize/2}px`;
      
      // Icon
      const iconEl = document.createElement('img');
      iconEl.src = obstacle.icon;
      iconEl.className = 'obstacle-icon';
      iconEl.style.top = `${obstacle.height}px`;
      
      // Bottom pipe
      const bottomPipe = document.createElement('div');
      bottomPipe.className = 'pipe bottom';
      bottomPipe.style.top = `${obstacle.height + gapSize/2}px`;
      
      // Append elements
      obstacleEl.appendChild(topPipe);
      obstacleEl.appendChild(iconEl);
      obstacleEl.appendChild(bottomPipe);
      
      gameAreaRef.current?.appendChild(obstacleEl);
    });
  };

  const jump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    
    // Add a brief cooldown to prevent rapid jumps
    const now = Date.now();
    if (now - gameState.current.lastJumpTime < 100) return;
    gameState.current.lastJumpTime = now;
    
    // Stronger jump effect
    gameState.current.playerVelocity = -3.5;
    
    // Add visual feedback - animate player
    if (playerRef.current) {
      playerRef.current.classList.add('jumping');
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.classList.remove('jumping');
        }
      }, 300);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    clearInterval(gameState.current.gameLoopId);
    clearInterval(gameState.current.timerIntervalId);
  };

  useEffect(() => {
    // Global keydown event for the space bar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // Prevent page scrolling
        jump();
      }
    };
    
    // Set up click handler directly on game area
    const handleTouch = () => jump();
    
    if (gameAreaRef.current) {
      gameAreaRef.current.addEventListener('click', handleTouch);
    }
    
    // Add keydown to window to ensure it works regardless of focus
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up
      window.removeEventListener('keydown', handleKeyDown);
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener('click', handleTouch);
      }
      clearInterval(gameState.current.gameLoopId);
      clearInterval(gameState.current.timerIntervalId);
    };
  }, []); // Empty dependency array means this runs once on mount

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flappy-container">
      <h2 className="flappy-title">Before you leave...</h2>
      <p className="flappy-description">Can you help this circle escape this simulation? It would be soo helpful...</p>
      
      <div className="game-stats">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {formatTime(time)}</div>
      </div>
      
      <div 
        className="game-area" 
        ref={gameAreaRef}
      >
        <div className="player" ref={playerRef}>
          <div className="player-glow"></div>
        </div>
        
        {!isPlaying && !gameOver && (
          <div className="start-screen">
            <div className="message">Click or press SPACE to start!</div>
          </div>
        )}
        
        {gameOver && (
          <div className="game-over">
            <div className="message">Game Over!</div>
            <div className="sub-message">Score: {score} in {formatTime(time)}</div>
            <button className="restart-btn" onClick={startGame}>Try Again</button>
          </div>
        )}
      </div>
      
      <div className="controls-help">
        <p>Controls: Press <kbd>SPACE</kbd> to jump, or click/tap on the game area</p>
      </div>
    </div>
  );
};

export default FlappyBird;
