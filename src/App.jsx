import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import finnLogo from './assets/images/finn.png';
import oceanBg from './assets/images/ocean.jpg';
import './App.css';
// Home component
function Home() {
  return (
    <div className="App" style={{ backgroundImage: `url(${oceanBg})` }}>
      <div className="content">
        <h1>FINAGOTCHI</h1>
        <img 
          src={finnLogo}
          alt="Finn" 
          className="finn-image"
        />
        <Link to="/game" className="start-button">START</Link>
      </div>
    </div>
  );
}

// Beer component
function Beer({ nuggets, setNuggets }) {
  return (
    <div className="game-container">
      <Link to="/game" className="back-button">← Back</Link>
      <div className="game-content">
        <div className="party-message">Finn partied too much! -2n for beer!</div>
        <img 
          src={finnLogo}
          alt="Finn" 
          className="game-character"
        />
        <div className="status-container">
          <div className="status-row">
            <span className="status-label">Money(nugget):</span>
            <span className="money-counter">{nuggets}n</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// House component
function House({ nuggets, setNuggets }) {
  return (
    <div className="game-container">
      <Link to="/game" className="back-button">← Back</Link>
      <div className="game-content">
        <div className="bills-message">Time to pay the bills! (-1n)</div>
        <img 
          src={finnLogo}
          alt="Finn" 
          className="game-character"
        />
        <div className="status-container">
          <div className="status-row">
            <span className="status-label">Money(nugget):</span>
            <span className="money-counter">{nuggets}n</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Fish component
function Fish({ nuggets, setNuggets }) {
  return (
    <div className="game-container">
      <Link to="/game" className="back-button">← Back</Link>
      <div className="game-content">
        <div className="work-message">Finn went to go to work! +3n</div>
        <img 
          src={finnLogo}
          alt="Finn" 
          className="game-character"
        />
        <div className="status-container">
          <div className="status-row">
            <span className="status-label">Money:</span>
            <span className="money-counter">{nuggets}n</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Game component
function Game({ nuggets, setNuggets }) {
  const [showMessage, setShowMessage] = React.useState(false);
  const navigate = useNavigate();

  const handleFinnClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  const handleHomeClick = () => {
    setNuggets(prev => prev - 1);
    navigate('/house');
  };

  const handleBeerClick = () => {
    setNuggets(prev => prev - 2);
    navigate('/beer');
  };

  const handleFishClick = () => {
    setNuggets(prev => prev + 3);
    navigate('/fish');
  };

  return (
    <div className="game-container">
      <Link to="/" className="back-button">← Back</Link>
      <div className="game-content">
        <div className="button-grid">
          <button className="action-button" onClick={handleHomeClick}>🏠</button>
          <button className="action-button" onClick={handleBeerClick}>🍺</button>
          <button className="action-button" onClick={handleFishClick}>🎣</button>
        </div>
        <div className="character-container">
          {showMessage && <div className="tickle-message">hehe it tickles</div>}
          <img 
            src={finnLogo}
            alt="Finn" 
            className="game-character"
            onClick={handleFinnClick}
          />
          <div className="status-container">
            <div className="status-row">
              <span className="status-label">Mood:</span>
              <span className="mood-indicator">✨Happy✨</span>
            </div>
            <div className="status-row">
              <span className="status-label">Money(nugget):</span>
              <span className="money-counter">{nuggets}n</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component
function App() {
  const [nuggets, setNuggets] = useState(50);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={
          <Game nuggets={nuggets} setNuggets={setNuggets} />
        } />
        <Route path="/house" element={
          <House nuggets={nuggets} setNuggets={setNuggets} />
        } />
        <Route path="/beer" element={
          <Beer nuggets={nuggets} setNuggets={setNuggets} />
        } />
         <Route path="/fish" element={
          <Fish nuggets={nuggets} setNuggets={setNuggets} />
        } />
      </Routes>
    </Router>
  );
}

export default App;