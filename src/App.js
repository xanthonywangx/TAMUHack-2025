import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TitleScreen from './components/TitleScreen';
import GamePage from './components/GamePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;