import { useEffect, useRef, useState } from 'react';
import './EndlessRunner.css';

const GROUND_HEIGHT = 50; // Height of the ground in pixels
const PLAYER_SIZE = 20; // Player width/height
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const INITIAL_GAME_SPEED = 5;

interface Obstacle {
  x: number;
  icon: string;
}

const EndlessRunner = () => {
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_GAME_SPEED);
  
  // DOM References
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<HTMLDivElement>(null);
  
  // Game variables that don't need to trigger re-renders
  const gameLoopRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const playerY = useRef(0);
  const playerVelocity = useRef(0);
  const isJumping = useRef(false);
  const obstacles = useRef<Obstacle[]>([]);
  const obstacleTimer = useRef<number | null>(null);
  const currentSpeed = useRef(INITIAL_GAME_SPEED);
  const lastObstacleTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Icon options for obstacles
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
  
  // Clean up all timers and animation frames
  const cleanupGame = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (obstacleTimer.current) {
      clearTimeout(obstacleTimer.current);
      obstacleTimer.current = null;
    }
  };
  
  // Reset the game state
  const resetGame = () => {
    cleanupGame();
    
    // Reset state variables
    setScore(0);
    setTime(0);
    setSpeed(INITIAL_GAME_SPEED);
    setGameOver(false);
    
    // Reset refs
    playerY.current = 0;
    playerVelocity.current = 0;
    isJumping.current = false;
    obstacles.current = [];
    currentSpeed.current = INITIAL_GAME_SPEED;
    
    // Reset DOM elements
    if (playerRef.current) {
      playerRef.current.style.bottom = `${GROUND_HEIGHT}px`;
    }
    
    if (obstaclesRef.current) {
      obstaclesRef.current.innerHTML = '';
    }
  };
  
  // Start the game
  const startGame = () => {
    if (isPlaying) return;
    
    resetGame();
    setIsPlaying(true);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    
    // Start game loop
    gameLoop();
  };
  
  // Handle jump action
  const jump = () => {
    if (gameOver) return;
    
    if (!isPlaying) {
      startGame();
      return;
    }
    
    if (!isJumping.current) {
      isJumping.current = true;
      playerVelocity.current = JUMP_FORCE;
      
      if (playerRef.current) {
        playerRef.current.classList.add('jumping');
      }
    }
  };
  
  // End the game
  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    cleanupGame();
  };
  
  // Spawn a new obstacle
  const spawnObstacle = () => {
    if (!gameAreaRef.current || !isPlaying) return;
    
    const gameWidth = gameAreaRef.current.offsetWidth;
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    // Add obstacle to state
    obstacles.current.push({
      x: gameWidth,
      icon: randomIcon
    });
    
    // Create and add obstacle element to DOM
    if (obstaclesRef.current) {
      const obstacleEl = document.createElement('div');
      obstacleEl.className = 'obstacle';
      obstacleEl.style.left = `${gameWidth}px`;
      obstacleEl.style.bottom = `${GROUND_HEIGHT}px`;
      
      const iconEl = document.createElement('img');
      iconEl.src = randomIcon;
      iconEl.className = 'obstacle-icon';
      obstacleEl.appendChild(iconEl);
      
      obstaclesRef.current.appendChild(obstacleEl);
    }
    
    // Schedule next obstacle
    const minTime = Math.max(800, 2000 - (currentSpeed.current * 100));
    const randomTime = minTime + Math.random() * 1500;
    
    obstacleTimer.current = window.setTimeout(spawnObstacle, randomTime);
  };
  
  // Main game loop
  const gameLoop = () => {
    if (!isPlaying || !gameAreaRef.current || !playerRef.current) {
      return;
    }
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    
    // Update player position based on physics
    if (isJumping.current) {
      // Apply gravity
      playerVelocity.current += GRAVITY;
      playerY.current += playerVelocity.current;
      
      // Check if player landed back on ground
      if (playerY.current <= 0) {
        playerY.current = 0;
        isJumping.current = false;
        playerVelocity.current = 0;
        
        if (playerRef.current) {
          playerRef.current.classList.remove('jumping');
        }
      }
    }
    
    // Update player position in DOM
    if (playerRef.current) {
      playerRef.current.style.bottom = `${GROUND_HEIGHT + playerY.current}px`;
    }
    
    // Update ground animation
    if (groundRef.current) {
      const groundPos = (parseFloat(groundRef.current.style.backgroundPositionX || '0') - currentSpeed.current) % 100;
      groundRef.current.style.backgroundPositionX = `${groundPos}px`;
    }
    
    // Update obstacles and check collisions
    if (obstaclesRef.current) {
      const obstacleElements = obstaclesRef.current.querySelectorAll('.obstacle');
      const playerRect = playerRef.current.getBoundingClientRect();
      
      // Update each obstacle's position
      obstacleElements.forEach((obstacleEl, index) => {
        const typedEl = obstacleEl as HTMLElement;
        
        // Update X position
        const currentX = parseFloat(typedEl.style.left) - currentSpeed.current;
        typedEl.style.left = `${currentX}px`;
        
        // Check for collision
        const obstacleRect = typedEl.getBoundingClientRect();
        
        if (
          playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top &&
          playerRect.top < obstacleRect.bottom
        ) {
          endGame();
          return;
        }
        
        // Check if obstacle passed player for score
        if (obstacleRect.right < playerRect.left) {
          // Only increment score if we haven't counted this obstacle yet
          if (obstacles.current[index] && obstacles.current[index].x > 0) {
            obstacles.current[index].x = -1; // Mark as counted
            setScore(prevScore => prevScore + 1);
          }
        }
        
        // Remove obstacles that are out of screen
        if (currentX < -OBSTACLE_WIDTH) {
          typedEl.remove();
          obstacles.current.splice(index, 1);
        }
      });
    }
    
    // Increase speed gradually
    if (isPlaying) {
      currentSpeed.current += 0.001;
      
      // Update speed display occasionally
      if (Math.random() < 0.05) {
        setSpeed(currentSpeed.current);
      }
    }
    
    // Schedule next frame
    animationFrameId.current = requestAnimationFrame(gameLoop);
  };
  
  // Handle click events
  const handleClick = () => {
    if (gameOver) return;
    jump();
  };
  
  // Handle key events
  useEffect(() => {
    // Start spawning obstacles when game starts
    if (isPlaying && !obstacleTimer.current) {
      obstacleTimer.current = window.setTimeout(spawnObstacle, 1000);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // Prevent page scroll
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanupGame();
    };
  }, [isPlaying, gameOver]);
  
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="runner-container">
      <h2 className="runner-title">Before you leave...</h2>
      <p className="runner-description">Can you help this circle escape this simulation? It would be soo helpful...</p>
      
      <div className="game-stats">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {formatTime(time)}</div>
        <div className="speed">Speed: {speed.toFixed(1)}</div>
      </div>
      
      <div 
        className="game-area" 
        ref={gameAreaRef}
        onClick={handleClick}
      >
        <div className="player" ref={playerRef}>
          <div className="player-glow"></div>
        </div>
        
        <div className="ground" ref={groundRef}></div>
        
        <div className="obstacles-container" ref={obstaclesRef}></div>
        
        {!isPlaying && !gameOver && (
          <div className="start-screen">
            <div className="message">Click or press SPACE to start!</div>
          </div>
        )}
        
        {gameOver && (
          <div className="game-over">
            <div className="message">Game Over!</div>
            <div className="sub-message">Score: {score} in {formatTime(time)}</div>
            <button 
              className="restart-btn" 
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
                startGame();
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      
      <div className="controls-help">
        <p>Controls: Press <kbd>SPACE</kbd> to jump, or click/tap on the game area</p>
      </div>
    </div>
  );
};

export default EndlessRunner;
