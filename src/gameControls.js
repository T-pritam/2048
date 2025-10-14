export function GameControls(onMove, onRestart) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  // --- Handlers ---
  const handleKeyPress = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        onMove('left');
        break;
      case 'ArrowRight':
      case 'KeyD':
        onMove('right');
        break;
      case 'ArrowUp':
      case 'KeyW':
        onMove('up');
        break;
      case 'ArrowDown':
      case 'KeyS':
        onMove('down');
        break;
      case 'KeyR':
        onRestart();
        break;
      default:
        break;
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }
  };

  const handleTouchEnd = (event) => {
    if (event.changedTouches.length === 1) {
      touchEndX = event.changedTouches[0].clientX;
      touchEndY = event.changedTouches[0].clientY;
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) return;

    if (absDeltaX > absDeltaY) {
      deltaX > 0 ? onMove('right') : onMove('left');
    } else {
      deltaY > 0 ? onMove('down') : onMove('up');
    }
  };

  const handleButtonPress = (direction) => {
    onMove(direction);
  };

  const handleRestartButton = () => {
    onRestart();
  };

  // --- Setup and Cleanup ---
  const setupEventListeners = () => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  };

  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  // Immediately set up listeners on init
  setupEventListeners();

  // Return an API that mimics class methods
  return {
    handleButtonPress,
    handleRestartButton,
    cleanup
  };
}

// Utility functions for animations and formatting
export const GameUtils = {
  formatScore(score) {
    return score.toLocaleString();
  },

  getTileClass(value) {
    if (value === 0) return 'tile-empty';
    return `tile-${value}`;
  },

  getTileColor(value) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
      4096: '#ee5a52',
      8192: '#ed4c61',
      16384: '#f2b179'
    };
    return colors[value] || '#3c3a32';
  },

  getTextColor(value) {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  },

  getTileSize(value) {
    if (value >= 1000) return '28px';
    if (value >= 100) return '32px';
    return '35px';
  },

  isNewTile(row, col, newTiles) {
    return newTiles.some(tile => tile.row === row && tile.col === col);
  },

  isMergedTile(value, mergedTiles) {
    const recentMerge = mergedTiles.find(tile => 
      tile.value === value && Date.now() - tile.timestamp < 300
    );
    return !!recentMerge;
  },

  animateScore(element, newScore, oldScore) {
    if (!element) return;
    
    const duration = 300;
    const startTime = Date.now();
    const scoreDiff = newScore - oldScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentScore = Math.floor(oldScore + scoreDiff * progress);
      element.textContent = GameUtils.formatScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
};