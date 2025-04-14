import React from 'react';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Quiz App</h1>
      </header>
      <section id="game" className="section">
        <Quiz />
      </section>
    </div>
  );
}

export default App;