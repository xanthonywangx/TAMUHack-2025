import React, { useState, useEffect } from 'react';
import finn from '../../images/fin.png';
import './FinTab.css';

function FinTab() {
  const [showGreeting, setShowGreeting] = useState(false);
  
  // Initialize state from localStorage or use default values
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('finStats');
    return savedStats ? JSON.parse(savedStats) : {
      mood: 100,
      hungry: 100,
      stress: 0,
      money: 100
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finStats', JSON.stringify(stats));
  }, [stats]);

  // Update stats every second with interrelated effects
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prevStats => {
        let moodChange = -0.6;  // Base mood decrease
        let stressChange = 0.2;  // Base stress increase
        let hungryChange = -0.6; // Base hungry decrease

        // Hungry affects mood and stress
        if (prevStats.hungry < 50) {
          moodChange -= 0.3;     // Extra mood decrease when hungry
          stressChange += 0.4;   // Extra stress increase when hungry
        }

        // High stress affects mood
        if (prevStats.stress > 70) {
          moodChange -= 0.2;     // Extra mood decrease when stressed
        }

        // Low mood affects stress
        if (prevStats.mood < 30) {
          stressChange += 0.3;   // Extra stress increase when unhappy
        }

        const newStats = {
          ...prevStats,
          mood: Math.max(0, prevStats.mood + moodChange),
          hungry: Math.max(0, prevStats.hungry + hungryChange),
          stress: Math.min(100, prevStats.stress + stressChange)
        };

        // Save to localStorage
        localStorage.setItem('finStats', JSON.stringify(newStats));
        return newStats;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinnClick = () => {
    setShowGreeting(true);
    setTimeout(() => {
      setShowGreeting(false);
    }, 3000);
  };

  const handleFeed = () => {
    setStats(prevStats => ({
      ...prevStats,
      hungry: Math.min(100, prevStats.hungry + 30),
      mood: Math.min(100, prevStats.mood + 5),
      stress: Math.max(0, prevStats.stress - 5),
      money: Math.max(0, prevStats.money - 2)
    }));
  };

  const handlePlay = () => {
    setStats(prevStats => {
      // Playing while hungry increases stress more
      const stressChange = prevStats.hungry < 50 ? -10 : -20;
      
      return {
        ...prevStats,
        mood: Math.min(100, prevStats.mood + 30),
        hungry: Math.max(0, prevStats.hungry - 10),
        stress: Math.max(0, prevStats.stress + stressChange),
        money: Math.max(0, prevStats.money - 2)
      };
    });
  };

  const handleWork = () => {
    setStats(prevStats => {
      // Working while stressed or hungry is less effective
      const moneyEarned = (prevStats.stress > 70 || prevStats.hungry < 50) ? 2 : 3;
      const moodChange = (prevStats.hungry < 50) ? -15 : -10;
      
      return {
        ...prevStats,
        mood: Math.max(0, prevStats.mood + moodChange),
        hungry: Math.max(0, prevStats.hungry - 15),
        stress: Math.min(100, prevStats.stress + 15),
        money: prevStats.money + moneyEarned
      };
    });
  };

  // Optional: Add a reset button
  const handleReset = () => {
    const defaultStats = {
      mood: 100,
      hungry: 100,
      stress: 0,
      money: 100
    };
    setStats(defaultStats);
    localStorage.setItem('finStats', JSON.stringify(defaultStats));
  };

  return (
    <div className="fin-container">
      <div className="stats-container">
        <div className="money-display">
          <span className="money-amount">n{Math.floor(stats.money)}</span>
        </div>
        <div className="status-bars">
          <div className="status-item">
            <label>Mood</label>
            <div className="progress-bar">
              <div 
                className="progress-fill mood" 
                style={{ width: `${Math.floor(stats.mood)}%` }}
              >
                {Math.floor(stats.mood)}%
              </div>
            </div>
          </div>
          <div className="status-item">
            <label>Hungry</label>
            <div className="progress-bar">
              <div 
                className="progress-fill hungry" 
                style={{ width: `${Math.floor(stats.hungry)}%` }}
              >
                {Math.floor(stats.hungry)}%
              </div>
            </div>
          </div>
          <div className="status-item">
            <label>Stress</label>
            <div className="progress-bar">
              <div 
                className="progress-fill stress" 
                style={{ width: `${Math.floor(stats.stress)}%` }}
              >
                {Math.floor(stats.stress)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="finn-wrapper">
        <img 
          src={finn} 
          alt="Finn" 
          className="game-finn" 
          onClick={handleFinnClick}
        />
        {showGreeting && (
          <div className="greeting-bubble">
            Hey I'm Finn!
          </div>
        )}
      </div>
      
      <div className="button-container">
        <button 
          className="game-button" 
          onClick={handleFeed}
          disabled={stats.money < 2}
        >
          Feed
        </button>
        <button 
          className="game-button" 
          onClick={handlePlay}
          disabled={stats.money < 2}
        >
          Play
        </button>
        <button 
          className="game-button" 
          onClick={handleWork}
        >
          Work
        </button>
      </div>
      
      {/* Optional: Add a reset button */}
      <button 
        className="reset-button" 
        onClick={handleReset}
      >
        Reset Game
      </button>
    </div>
  );
}

export default FinTab;