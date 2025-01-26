import React from 'react';
import { useNavigate } from 'react-router-dom';
import finn from '../images/fin.png';
import './TitleScreen.css';

function TitleScreen() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/game');
  };

  return (
    <div className="title-container">
      <div className="title-content">
        <h1 className="game-title">FINAGOTCHI</h1>
        <div className="finn-container">
          <img src={finn} alt="Finn" className="title-finn" />
        </div>
        <button className="start-button" onClick={handleStartClick}>
          START
        </button>
      </div>
    </div>
  );
}

export default TitleScreen;