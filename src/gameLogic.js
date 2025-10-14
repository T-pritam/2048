// gameLogic.js
export function GameLogic() {
  let size = 4;
  let grid = [];
  let score = 0;
  let bestScore = 0;
  let hasWon = false;
  let gameOver = false;
  let lastMove = null;
  let newTiles = [];
  let mergedTiles = [];

  // --- Helpers defined first so they can be called anywhere ---
  function getBestScore() {
    return parseInt(localStorage.getItem('best2048Score') || '0');
  }

  function setBestScore(value) {
    if (value > bestScore) {
      bestScore = value;
      localStorage.setItem('best2048Score', value.toString());
    }
  }

  // --- Core functions ---
  const initializeGrid = () => {
    grid = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
  };

  const getEmptyCells = () => {
    const empty = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) empty.push({ row: r, col: c });
      }
    }
    return empty;
  };

  const addRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return false;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    grid[randomCell.row][randomCell.col] = value;
    newTiles.push({ row: randomCell.row, col: randomCell.col, value });
    return true;
  };

  const processRow = (row) => {
    const filtered = row.filter((n) => n !== 0);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const val = filtered[i] * 2;
        merged.push(val);
        score += val;
        mergedTiles.push({ value: val, timestamp: Date.now() });
        if (val === 2048 && !hasWon) hasWon = true;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }

    while (merged.length < size) merged.push(0);
    return merged;
  };

  const moveLeft = () => {
    let moved = false;
    for (let r = 0; r < size; r++) {
      const newRow = processRow(grid[r]);
      if (JSON.stringify(newRow) !== JSON.stringify(grid[r])) moved = true;
      grid[r] = newRow;
    }
    return moved;
  };

  const moveRight = () => {
    let moved = false;
    for (let r = 0; r < size; r++) {
      const reversed = [...grid[r]].reverse();
      const processed = processRow(reversed).reverse();
      if (JSON.stringify(processed) !== JSON.stringify(grid[r])) moved = true;
      grid[r] = processed;
    }
    return moved;
  };

  const moveUp = () => {
    let moved = false;
    for (let c = 0; c < size; c++) {
      const col = grid.map((r) => r[c]);
      const newCol = processRow(col);
      if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
      for (let r = 0; r < size; r++) grid[r][c] = newCol[r];
    }
    return moved;
  };

  const moveDown = () => {
    let moved = false;
    for (let c = 0; c < size; c++) {
      const col = grid.map((r) => r[c]);
      const newCol = processRow([...col].reverse()).reverse();
      if (JSON.stringify(newCol) !== JSON.stringify(col.reverse())) moved = true;
      for (let r = 0; r < size; r++) grid[r][c] = newCol[r];
    }
    return moved;
  };

  const canMove = () => {
    if (getEmptyCells().length > 0) return true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cur = grid[r][c];
        if (
          (c < size - 1 && cur === grid[r][c + 1]) ||
          (r < size - 1 && cur === grid[r + 1][c])
        )
          return true;
      }
    }
    return false;
  };

  const isGameOver = () => !canMove();

  const makeMove = (dir) => {
    if (gameOver) return false;
    newTiles = [];
    mergedTiles = [];
    lastMove = dir;

    let moved = false;
    switch (dir) {
      case 'left':
        moved = moveLeft();
        break;
      case 'right':
        moved = moveRight();
        break;
      case 'up':
        moved = moveUp();
        break;
      case 'down':
        moved = moveDown();
        break;
      default:
        return false;
    }

    if (moved) {
      addRandomTile();
      setBestScore(score);
      if (isGameOver()) gameOver = true;
    }

    return moved;
  };

  const restart = () => {
    score = 0;
    hasWon = false;
    gameOver = false;
    newTiles = [];
    mergedTiles = [];
    lastMove = null;
    initializeGrid();
    addRandomTile();
    addRandomTile();
  };

  const getGameState = () => ({
    grid,
    score,
    bestScore,
    hasWon,
    gameOver,
    newTiles,
    mergedTiles,
    lastMove,
  });

  // --- Initialize state ---
  bestScore = getBestScore();
  initializeGrid();
  addRandomTile();
  addRandomTile();

  // --- Public API ---
  return {
    makeMove,
    restart,
    getGameState,
  };
}
