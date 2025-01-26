import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinTab from './tabs/FinTab';
import HomeTab from './tabs/HomeTab';
import ShopTab from './tabs/ShopTab';
import './GamePage.css';

function GamePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fin');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="game-container">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <h1 className="game-title">FINAGOTCHI</h1>
      
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'fin' ? 'active' : ''}`}
            onClick={() => setActiveTab('fin')}
          >
            Fin
          </button>
          <button 
            className={`tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'fin' && <FinTab />}
          {activeTab === 'shop' && <ShopTab />}
        </div>
      </div>
    </div>
  );
}

export default GamePage;