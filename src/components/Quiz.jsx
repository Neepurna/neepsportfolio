import React, { useState, useEffect, useRef } from 'react';
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaGithub, FaNpm, FaBootstrap } from 'react-icons/fa';
import { SiTailwindcss, SiRedux, SiTypescript, SiMongodb } from 'react-icons/si';
import '../styles/Quiz.css';

const icons = [
  { icon: FaReact, name: 'react' },
  { icon: FaHtml5, name: 'html5' },
  { icon: FaCss3Alt, name: 'css3' },
  { icon: FaJs, name: 'javascript' },
  { icon: FaNodeJs, name: 'nodejs' },
  { icon: FaGithub, name: 'github' },
  { icon: FaNpm, name: 'npm' },
  { icon: FaBootstrap, name: 'bootstrap' },
  { icon: SiTailwindcss, name: 'tailwindcss' },
  { icon: SiRedux, name: 'redux' },
  { icon: SiTypescript, name: 'typescript' },
  { icon: SiMongodb, name: 'mongodb' },
];

const Quiz = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shuffledIcons, setShuffledIcons] = useState([]);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const timerRef = useRef(null);

  // Shuffle icons
  const shuffleIcons = () => {
    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    setShuffledIcons(shuffled);
    return shuffled;
  };

  // Start game
  const startGame = () => {
    const shuffled = shuffleIcons();
    setCurrentIconIndex(0);
    setCurrentIcon(shuffled[0]);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setInputValue('');
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userAnswer = inputValue.trim().toLowerCase();
    const correctAnswer = currentIcon.name.toLowerCase();
    
    if (userAnswer === correctAnswer) {
      // Correct answer
      setScore(score + 1);
      if (currentIconIndex < shuffledIcons.length - 1) {
        setCurrentIconIndex(currentIconIndex + 1);
        setCurrentIcon(shuffledIcons[currentIconIndex + 1]);
        setInputValue('');
      } else {
        // All icons guessed correctly
        clearInterval(timerRef.current);
        setGameStarted(false);
      }
    } else {
      // Wrong answer, restart game
      clearInterval(timerRef.current);
      setGameStarted(false);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="quiz-container">
      <h2>Tech Icon Quiz</h2>
      
      {!gameStarted ? (
        <div className="start-screen">
          <p>Guess the names of the technology icons to win!</p>
          <p>Your last score: {score}</p>
          <button className="start-button" onClick={startGame}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="game-screen">
          <div className="timer">Time: {timeLeft}s</div>
          <div className="score">Score: {score}/{shuffledIcons.length}</div>
          
          <div className="icon-container">
            {currentIcon && <currentIcon.icon className="glowing-icon" />}
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type icon name..."
              autoFocus
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Quiz;
