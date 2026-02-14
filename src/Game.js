import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameLogic } from './gameLogic';
import { GameControls, GameUtils } from './gameControls';
import Confetti from './Confetti';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [, setAnimatingTiles] = useState(new Set());
  const [celebratedMilestones, setCelebratedMilestones] = useState(new Set());
  const gameLogicRef = useRef(null);
  const gameControlsRef = useRef(null);
  const scoreRef = useRef(null);
  const previousScoreRef = useRef(0);

  useEffect(() => {
    // Initialize game
    gameLogicRef.current = new GameLogic();
    setGameState(gameLogicRef.current.getGameState());

    // Initialize controls
    gameControlsRef.current = new GameControls(
      handleMove,
      handleRestart
    );

    return () => {
      if (gameControlsRef.current) {
        gameControlsRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (gameState) {
      // Animate score changes
      if (gameState.score !== previousScoreRef.current && scoreRef.current) {
        GameUtils.animateScore(scoreRef.current, gameState.score, previousScoreRef.current);
        
        // Add score animation class
        if (gameState.score > previousScoreRef.current) {
          scoreRef.current.style.animation = 'scoreIncrease 0.3s ease-in-out';
          setTimeout(() => {
            if (scoreRef.current) {
              scoreRef.current.style.animation = '';
            }
          }, 300);
        }
      }
      previousScoreRef.current = gameState.score;

      // Handle tile animations
      if (gameState.newTiles && gameState.newTiles.length > 0) {
        const newAnimatingTiles = new Set();
        gameState.newTiles.forEach(tile => {
          newAnimatingTiles.add(`${tile.row}-${tile.col}-new`);
        });
        setAnimatingTiles(newAnimatingTiles);
        
        // Clear new tile animations after animation completes
        setTimeout(() => {
          setAnimatingTiles(new Set());
        }, 200);
      }

      // Check for milestone celebrations
      checkMilestones(gameState.grid);
      
      // Check for game over
      if (gameState.gameOver && !showGameOverModal) {
        setShowGameOverModal(true);
      }
    }
  }, [gameState, showGameOverModal, celebratedMilestones]);

  const handleMove = (direction) => {
    if (gameLogicRef.current) {
      const moved = gameLogicRef.current.makeMove(direction);
      if (moved) {
        const newState = gameLogicRef.current.getGameState();
        setGameState(newState);
      }
    }
  };

  const handleRestart = () => {
    if (gameLogicRef.current) {
      gameLogicRef.current.restart();
      setGameState(gameLogicRef.current.getGameState());
      setShowGameOverModal(false);
      setShowCelebration(false);
      setCelebratedMilestones(new Set());
      setAnimatingTiles(new Set());
      previousScoreRef.current = 0;
    }
  };

  const handleContinue = () => {
    setShowCelebration(false);
  };

  const checkMilestones = (grid) => {
    // Check for milestone tiles: 2048, 4096, 8192, 16384, etc.
    let maxTile = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] > maxTile) {
          maxTile = grid[i][j];
        }
      }
    }

    // Check if it's a power of 2 and >= 2048
    if (maxTile >= 2048 && !celebratedMilestones.has(maxTile)) {
      // Verify it's a power of 2
      if ((maxTile & (maxTile - 1)) === 0) {
        setCelebratedMilestones(prev => new Set(prev).add(maxTile));
        setCelebrationMessage(`🎉 Reached ${GameUtils.formatScore(maxTile)}! 🎉`);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
      }
    }
  };

  const renderTile = (value, rowIndex, colIndex) => {
    const isEmpty = value === 0;
    const tileKey = `${rowIndex}-${colIndex}`;
    
    // Determine animation classes
    let animationClass = '';
    const isNew = gameState && GameUtils.isNewTile(rowIndex, colIndex, gameState.newTiles || []);
    const isMerged = gameState && !isEmpty && GameUtils.isMergedTile(value, gameState.mergedTiles || []);
    
    if (isNew) {
      animationClass = 'tile-new';
    } else if (isMerged) {
      animationClass = 'tile-merged';
    }
    
    const tileClass = `tile ${GameUtils.getTileClass(value)} ${animationClass}`.trim();
    
    return (
      <div 
        key={tileKey}
        className={tileClass}
        style={{
          backgroundColor: isEmpty ? '#cdc1b4' : GameUtils.getTileColor(value),
          color: GameUtils.getTextColor(value),
          fontSize: isEmpty ? '35px' : GameUtils.getTileSize(value)
        }}
      >
        {!isEmpty && value}
      </div>
    );
  };

  const renderGrid = () => {
    if (!gameState) return null;

    return gameState.grid.map((row, rowIndex) =>
      row.map((value, colIndex) => 
        renderTile(value, rowIndex, colIndex)
      )
    );
  };

  if (!gameState) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">2048</h1>
        <div className="score-container">
          <div className="score-box">
            <span className="score-label">Score</span>
            <span ref={scoreRef} className="score-value">
              {GameUtils.formatScore(gameState.score)}
            </span>
          </div>
          <div className="score-box">
            <span className="score-label">Best</span>
            <span className="score-value">
              {GameUtils.formatScore(gameState.bestScore)}
            </span>
          </div>
        </div>
      </div>

      <div className="game-info">
        <p>Join the numbers and reach the highest tile!</p>
        <button className="restart-button" onClick={handleRestart}>
          New Game
        </button>
      </div>

      <div className="game-board">
        <div className="grid-container">
          {renderGrid()}
        </div>
      </div>

      <div className="controls-info">
        <p><strong>HOW TO PLAY:</strong> Use your arrow keys or swipe to move the tiles. When two tiles with the same number touch, they merge into one!</p>
      </div>

      <div className="mobile-controls">
        <div className="control-row">
          <button 
            className="control-button" 
            onClick={() => handleMove('up')}
          >
            ↑
          </button>
        </div>
        <div className="control-row">
          <button 
            className="control-button" 
            onClick={() => handleMove('left')}
          >
            ←
          </button>
          <button 
            className="control-button" 
            onClick={() => handleMove('down')}
          >
            ↓
          </button>
          <button 
            className="control-button" 
            onClick={() => handleMove('right')}
          >
            →
          </button>
        </div>
      </div>

      {/* Celebration for milestones */}
      <Confetti isActive={showCelebration} />
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-message">
            {celebrationMessage}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOverModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Game Over!</h2>
            <p>No more moves available.</p>
            <p>Final Score: {GameUtils.formatScore(gameState.score)}</p>
            <div className="modal-buttons">
              <button onClick={handleRestart}>Try Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
