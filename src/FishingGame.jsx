import React, { useState, useEffect, useCallback } from 'react';
import './FishingGame.css';
import fishSprite from './fish_sprite.png';


// Game duration in seconds
const GAME_DURATION = 30;


// Define different types of fish with their properties
const FISH_TYPES = [
  { name: 'Small Fish', value: 5, difficulty: 8, timer: 5 },    // Easiest to catch, lowest value
  { name: 'Medium Fish', value: 10, difficulty: 12, timer: 4 }, // Slightly harder
  { name: 'Large Fish', value: 30, difficulty: 18, timer: 4 },  // Medium difficulty
  { name: 'Rare Fish', value: 40, difficulty: 22, timer: 3 },   // Getting harder
  { name: 'Epic Fish', value: 50, difficulty: 28, timer: 3 },   // Very hard
  { name: 'Legendary Fish', value: 100, difficulty: 28, timer: 2 }, // Hardest to catch, highest value
];


function FishingGame() {
  // State Management
  const [fishSpots, setFishSpots] = useState([]); // Array of fish currently on screen
  const [selectedFish, setSelectedFish] = useState(null); // Currently selected fish
  const [gameState, setGameState] = useState('title'); // Current game state ('title', 'selecting', 'catching', 'end')
  const [progress, setProgress] = useState(0); // Progress bar for catching fish (0-100)
  const [timeLeft, setTimeLeft] = useState(0); // Timer for catching individual fish
  const [money, setMoney] = useState(0); // Player's total money
  const [moneyPopup, setMoneyPopup] = useState(null); // Popup showing money earned from catch
  const [caughtFishId, setCaughtFishId] = useState(null); // ID of fish being caught (for animation)
  const [gameTimeLeft, setGameTimeLeft] = useState(GAME_DURATION); // Overall game timer
  const [totalCaught, setTotalCaught] = useState(0); // Total fish caught in current game
  const [isProcessingCatch, setIsProcessingCatch] = useState(false);


  // Start new game function
  const startGame = () => {
    generateFishSpots(); // Create new fish spots
    setGameState('selecting'); // Set game to selection phase
    setMoney(0); // Reset money
    setGameTimeLeft(GAME_DURATION); // Reset game timer
    setTotalCaught(0); // Reset catch counter
    setIsProcessingCatch(false);
  };


  const generateSingleFish = () => {
    const fish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    return {
      ...fish,
      id: Date.now() + Math.random(),
      position: {
        left: Math.random() * 80 + 10,
        top: Math.random() * 50 + 25,
      }
    };
  };


  const generateFishSpots = useCallback(() => {
    const newFishSpots = Array(5).fill(null).map(generateSingleFish);
    setFishSpots(newFishSpots);
  }, []);


  useEffect(() => {
    generateFishSpots();
  }, []);


  const replaceFish = (oldFishId) => {
    setFishSpots(prev => prev.map(fish =>
      fish.id === oldFishId ? generateSingleFish() : fish
    ));
  };


  // Function to select a fish to catch
  const selectFish = (fish) => {
    if (gameState !== 'selecting') return; // Only allow selection in selecting state
    setSelectedFish(fish); // Set the selected fish
    setTimeLeft(fish.timer); // Set timer based on fish type
    setGameState('catching'); // Change to catching state
    setProgress(0); // Reset progress bar
    setIsProcessingCatch(false);
  };


  // Handle successful fish catch
  const handleCatch = useCallback(() => {
    if (isProcessingCatch) return; // Prevent multiple catches
    setIsProcessingCatch(true);


    setCaughtFishId(selectedFish.id); // Mark fish as caught for animation
    setGameState('selecting'); // Return to selection state
    setTotalCaught(totalCaught + 1);
    setMoney(money + selectedFish.value);
   
    // Show money popup
    setMoneyPopup({
      value: selectedFish.value,
      position: selectedFish.position,
      id: Date.now()
    });
   
    // Clean up after catch animation
    setTimeout(() => {
      replaceFish(selectedFish.id); // Replace caught fish with new one
      setMoneyPopup(null); // Remove money popup
      setCaughtFishId(null); // Reset caught fish
      setIsProcessingCatch(false);
    }, 1000);
  }, [selectedFish, isProcessingCatch]);


  // Handle spacebar press during catching
const handleKeyPress = useCallback((event) => {
  if (gameState !== 'catching' || event.key !== ' ' || isProcessingCatch) return; // Only process spacebar in catching state
 
  event.preventDefault();
  setProgress(prev => {
	const newProgress = prev + (2.0 / selectedFish.difficulty) * 100; // Increase progress based on fish difficulty
	if (newProgress >= 100) { // If progress complete
  	setCaughtFishId(selectedFish.id); // Mark fish as caught for animation
  	setGameState('selecting'); // Return to selection state
  	setTotalCaught(prev => prev + 1);
  	setMoney(prevMoney => prevMoney + selectedFish.value);
 	 
  	// Show money popup
  	setMoneyPopup({
    	value: selectedFish.value,
    	position: selectedFish.position,
    	id: Date.now()
  	});
 	 
  	// Clean up after catch animation
  	setTimeout(() => {
    	replaceFish(selectedFish.id); // Replace caught fish with new one
    	setMoneyPopup(null); // Remove money popup
    	setCaughtFishId(null); // Reset caught fish
    	setIsProcessingCatch(false);
  	}, 1000);
 	 
  	return 0; // Reset progress
	}
	return newProgress;
  });
}, [gameState, selectedFish, replaceFish, isProcessingCatch]);

  // Effect for overall game timer
  useEffect(() => {
    if (gameState !== 'selecting' && gameState !== 'catching') return;


    const timer = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) { // When game timer runs out
          clearInterval(timer);
          setGameState('end'); // End the game
          return 0;
        }
        return prev - 1;
      });
    }, 1000);


    return () => clearInterval(timer); // Cleanup timer
  }, [gameState]);


  // Effect for individual fish catch timer
  useEffect(() => {
    if (gameState !== 'catching') return;


    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { // When catch timer runs out
          clearInterval(timer);
          setGameState('selecting'); // Return to selection state
          setIsProcessingCatch(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);


    return () => clearInterval(timer); // Cleanup timer
  }, [gameState]);


  // Effect to handle keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);


  // JSX for game interface
  return (
    <div className="fishing-game">
      {/* Title Screen */}
      {gameState === 'title' ? (
        <div className="title-screen">
          <div className="title-content">
            <h1>🎣 Fishing Game</h1>
            <div className="rules">
              <h2>How to Play:</h2>
              <ul>
                <li>You have 30 seconds to catch as many fish as possible!</li>
                <li>Click on any fish to start catching it</li>
                <li>Rapidly press SPACE BAR to fill the progress bar</li>
                <li>Fill the bar before time runs out to catch the fish</li>
                <li>Different fish have different:</li>
                <ul>
                  <li>Values ($)</li>
                  <li>Catch difficulties</li>
                  <li>Time limits</li>
                </ul>
                <li>Legendary fish are the most valuable but hardest to catch!</li>
              </ul>
            </div>
            <button className="play-button" onClick={startGame}>
              Start Fishing!
            </button>
          </div>
        </div>
      ) : gameState === 'end' ? (
        <div className="end-screen">
          <div className="end-content">
            <h1>Time's Up! 🎣</h1>
            <div className="stats">
              <div className="stat-item">
                <h2>Fish Caught</h2>
                <p>{totalCaught}</p>
              </div>
              <div className="stat-item">
                <h2>Total Money</h2>
                <p>${money}</p>
              </div>
            </div>
            <button className="play-button" onClick={startGame}>
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="money-counter">
            ${money}
          </div>
         
          <div className="game-timer">
            Time: {gameTimeLeft}s
          </div>


          <div className="game-area">
            <div className="fishing-pond">
              {fishSpots.map((fish) => (
                <div
                  key={fish.id}
                  className={`fish-spot ${caughtFishId === fish.id ? 'caught' : ''}`}
                  style={{
                    left: `${fish.position.left}%`,
                    top: `${fish.position.top}%`,
                    opacity: gameState === 'catching' && fish.id !== selectedFish?.id ? 0.5 : 1,
                  }}
                  onClick={() => gameState === 'selecting' && selectFish(fish)}
                >
                  <img
                    src={fishSprite}
                    alt={fish.name}
                    className="fish-sprite"
                  />
                </div>
              ))}


              {moneyPopup && (
                <div
                  className="money-popup"
                  style={{
                    left: `${moneyPopup.position.left}%`,
                    top: `${moneyPopup.position.top}%`
                  }}
                >
                  +${moneyPopup.value}
                </div>
              )}


              {gameState === 'catching' && (
                <div className="catching-overlay">
                  <div className="catching-ui">
                    <div className="timer">Time: {timeLeft}s</div>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="instruction">
                      SPAM SPACE BAR!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default FishingGame;