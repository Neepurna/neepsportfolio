import { useEffect, useRef, useState } from 'react';
import './Quiz.css';

// Tech icons for the quiz
const icons = [
  { icon: '/icons/react.svg', name: 'react' },
  { icon: '/icons/javascript.svg', name: 'javascript' },
  
  { icon: '/icons/node-js.svg', name: 'nodejs' },
  { icon: '/icons/python.svg', name: 'python' },
  
  { icon: '/icons/Github.svg', name: 'github' },
  { icon: '/icons/blender.svg', name: 'blender' },
  
  { icon: '/icons/unity.svg', name: 'unity' },
  { icon: '/icons/firebase.svg', name: 'firebase' },
  { icon: '/icons/solidity.svg', name: 'solidity' },
];

const Quiz = () => {
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [currentIcon, setCurrentIcon] = useState<{icon: string, name: string} | null>(null);
  const [shuffledIcons, setShuffledIcons] = useState<Array<{icon: string, name: string}>>([]);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showContact, setShowContact] = useState(false);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shuffle icons
  const shuffleIcons = () => {
    return [...icons].sort(() => Math.random() - 0.5);
  };

  // Reset game
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setScore(0);
    setTime(0);
    setGameOver(false);
    setAnswer('');
    
    const newShuffledIcons = shuffleIcons();
    setShuffledIcons(newShuffledIcons);
    setCurrentIconIndex(0);
    setCurrentIcon(newShuffledIcons[0]);
  };

  // Start game
  const startGame = () => {
    resetGame();
    setIsPlaying(true);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    
    // Focus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // End game
  const endGame = (success = false) => {
    setIsPlaying(false);
    if (!success) setGameOver(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Handle answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentIcon) return;
    
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentIcon.name.toLowerCase();
    
    if (userAnswer === correctAnswer) {
      // Correct answer
      const newScore = score + 1;
      setScore(newScore);
      setAnswer('');
      
      // Move to next icon or end game if all icons were guessed
      if (currentIconIndex < shuffledIcons.length - 1) {
        const nextIndex = currentIconIndex + 1;
        setCurrentIconIndex(nextIndex);
        setCurrentIcon(shuffledIcons[nextIndex]);
      } else {
        // All icons correctly guessed
        endGame(true);
      }
    } else {
      // Wrong answer
      endGame();
    }
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Function to handle sharing high score
  const handleShareHighScore = () => {
    const subject = encodeURIComponent(`My Quiz High Score: ${score} icons in ${formatTime(time)}`);
    const body = encodeURIComponent(`Hi there,\n\nI just scored ${score} out of ${shuffledIcons.length} on your tech quiz in ${formatTime(time)}!\n\nLet's connect!\n\n`);
    window.open(`mailto:neepurna@gmail.com?subject=${subject}&body=${body}`);
    setShowContact(true);
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Before you leave...</h2>
      <p className="quiz-description">Can you name these tech icons? It would be soo helpful...</p>
      
      <div className="game-stats">
        <div className="score">Score: {score}/{shuffledIcons.length}</div>
        <div className="timer">Time: {formatTime(time)}</div>
      </div>
      
      <div className="quiz-area">
        {!isPlaying && !gameOver && (
          <div className="start-screen">
            <div className="message">Ready to test your tech knowledge?</div>
            <button 
              className="start-btn" 
              onClick={startGame}
            >
              Start Quiz
            </button>
          </div>
        )}
        
        {isPlaying && currentIcon && (
          <div className="quiz-gameplay">
            <div className="icon-display">
              <img 
                src={currentIcon.icon} 
                alt="Tech icon to guess" 
                className="glowing-icon"
              />
              {/* Removed hint text from here */}
            </div>
            
            <form onSubmit={handleSubmit} className="answer-form">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type the icon name..."
                ref={inputRef}
                autoComplete="off"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        
        {gameOver && (
          <div className="game-over">
            <div className="message">Game Over!</div>
            <div className="sub-message">Score: {score} in {formatTime(time)}</div>
            {score > 0 && (
              <button 
                className="share-btn" 
                onClick={handleShareHighScore}
              >
                Send High Score
              </button>
            )}
            <button 
              className="restart-btn" 
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              Try Again
            </button>
          </div>
        )}
        
        {!isPlaying && !gameOver && score > 0 && (
          <div className="game-complete">
            <div className="completion-layout">
              <div className="result-container">
                <div className="sub-message">
                  You got all {score} icons in {formatTime(time)}!
                </div>
                <div className="success-buttons">
                  <button 
                    className="share-btn" 
                    onClick={handleShareHighScore}
                  >
                    Send High Score
                  </button>
                  <button 
                    className="restart-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame();
                    }}
                  >
                    Play Again
                  </button>
                </div>
              </div>
              <img 
                src="/Cartoon-Characters/Great-Job.png" 
                alt="Great Job!" 
                className="celebration-image"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="contact-prompt">
        Send me your highscore screenshot at <a href="mailto:neepurna@gmail.com">neepurna@gmail.com</a>. Let's have a chat!
      </div>
      
      <div className="controls-help">
        <p>Hint: Just scroll up to my <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            const skillsSection = document.querySelector('.skills-section');
            if (skillsSection) {
              skillsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >Skills & Technologies</a> section if you get stuck</p>
      </div>

      {showContact && (
        <div className="contact-message">
          <p>Thanks for playing! Let's have a chat!</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
