# 2048 Game - React Web Application

A fully functional implementation of the popular 2048 puzzle game built with React. This version is optimized for both desktop and mobile browsers, featuring smooth animations, touch controls, and a clean, responsive design.

## Game Features

- **Classic 2048 Gameplay**: Join numbers to reach the 2048 tile
- **Cross-Platform Support**: Works seamlessly on desktop and mobile devices
- **Multiple Control Methods**:
  - Keyboard arrows (↑↓←→) and WASD keys
  - Touch gestures (swipe) for mobile devices
  - On-screen buttons for mobile users
- **Score Tracking**: Current score and best score persistence
- **Win/Lose Detection**: Modal dialogs for game completion
- **Smooth Animations**: Tile movements and score updates
- **Responsive Design**: Adapts to different screen sizes

## How to Play

### Objective
Combine tiles with the same numbers to reach the **2048 tile**!

### Controls

#### Desktop
- **Arrow Keys**: ↑ ↓ ← → to move tiles
- **WASD Keys**: W A S D as alternative movement keys
- **R Key**: Restart the game
- **New Game Button**: Click to restart anytime

#### Mobile
- **Swipe Gestures**: Swipe in any direction to move tiles
- **Touch Buttons**: Use the on-screen directional buttons
- **New Game Button**: Tap to restart

### Game Rules
1. Tiles slide in the direction you choose
2. When two tiles with the same number touch, they merge into one
3. After each move, a new tile (2 or 4) appears randomly
4. Try to reach 2048 to win!
5. Game ends when no moves are possible

## Project Structure

```
src/
├── Game.js           # Main game component (GUI)
├── Game.css          # Styling and responsive design
├── gameLogic.js      # Core game mechanics and rules
├── gameControls.js   # Input handling and utilities
├── App.js            # Root application component
└── index.js          # React DOM entry point
```

### Architecture Overview

#### `gameLogic.js` - Game Engine
- **GameLogic Class**: Handles all game mechanics
  - Grid management and initialization
  - Tile movement algorithms (left, right, up, down)
  - Score calculation and tracking
  - Win/lose condition detection
  - Local storage for best score

#### `gameControls.js` - Input Management
- **GameControls Class**: Manages user interactions
  - Keyboard event handling
  - Touch gesture recognition
  - Swipe direction detection
  - Button press handlers
- **GameUtils Object**: Utility functions
  - Score formatting
  - Tile styling helpers
  - Animation utilities

#### `Game.js` - User Interface
- **Main Game Component**: React component for UI
  - Game state management
  - Grid rendering
  - Modal dialogs (win/game over)
  - Mobile-responsive controls
  - Score display and animations

## Game Statistics

The game automatically tracks:
- **Current Score**: Points earned in current session
- **Best Score**: Highest score achieved (stored locally)
- **Win State**: Whether you've reached 2048
- **Move Count**: Internal tracking for game analysis

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd 2048-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to play the game

### Building for Production

To create a production build:
```bash
npm run build
```

The optimized build will be created in the `build` folder, ready for deployment.
