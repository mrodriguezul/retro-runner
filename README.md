# Retro Runner

A retro-style endless runner game inspired by the classic Chrome dinosaur game. Jump over obstacles, avoid hazards, and compete for the highest score!

## 🎮 Features

### Characters
- **Kangaroo** - The original runner with powerful jumps
- **Koala** - Alternative character with slightly different jump mechanics
- Character selection screen before gameplay
- Character preference saved across sessions

### Dynamic Environment
- **4-Layer Parallax Scrolling**
  - Drifting clouds (0.1x speed)
  - Varied mountain peaks with 3 different shapes and 4 color schemes
  - Mid-ground scenery with trees, houses, and bushes (0.5x speed)
  - Fast-scrolling ground layer
- Immersive depth with multiple visual layers

### Obstacles
Five different obstacle types to challenge players:
- 🌲 **Trees** - Classic tall obstacles
- 🌿 **Bushes** - Low-lying vegetation
- 💧 **Rivers** - Animated flowing water
- 🧱 **Rocks** - Irregular stone formations
- 🚧 **Fences** - Wooden barrier obstacles

### Gameplay
- Smooth jumping physics with gravity
- Progressive difficulty (speed increases over time)
- Score tracking and high score system
- Forgiving collision detection (10% hitbox margin)
- Particle effects on landing
- Collision flash feedback

### Game States
- **Character Selection** - Choose your runner
- **Start Screen** - Instructions displayed
- **Playing** - Active gameplay
- **Game Over** - Final score with restart options
  - Restart with same character
  - Change character and play again

## 🕹️ How to Play

1. **Character Selection**: Click on a character to start
2. **Jump**: Press `SPACE`, `↑ (Arrow Up)`, or click/tap the screen
3. **Avoid Obstacles**: Jump over trees, bushes, rivers, rocks, and fences
4. **Score Points**: Survive as long as possible - score increases over time
5. **Game Over**: Choose to restart or change characters

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation

1. Clone or download this repository
```bash
git clone <repository-url>
cd retro-runner
```

2. Open `index.html` in your browser, or serve it with a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

## 🛠️ Technologies Used

- **HTML5 Canvas** - Rendering graphics
- **Vanilla JavaScript** - Game logic and physics
- **CSS3** - Styling and responsive design
- **LocalStorage API** - Persisting high scores and preferences

## 📁 Project Structure

```
retro-runner/
├── index.html          # Main HTML file
├── styles.css          # Styles and layout
├── character.js        # Base Character class
├── kangaroo.js         # Kangaroo character implementation
├── koala.js            # Koala character implementation
├── obstacle.js         # Obstacle types and rendering
├── background.js       # Multi-layer parallax background
└── game.js             # Main game loop and state management
```

## 🎨 Game Architecture

### Class Hierarchy
```
Character (Base)
├── Kangaroo (Jump Force: -12)
└── Koala (Jump Force: -11.5)

ObstacleType (Enum)
├── TREE
├── BUSH
├── RIVER
├── ROCK
└── FENCE
```

### Game Loop
- **60 FPS** target with requestAnimationFrame
- Delta time calculations for consistent physics
- State machine pattern for game states
- Collision detection with AABB algorithm

## 🎯 Game Mechanics

### Physics
- **Gravity**: 0.6 units per frame
- **Jump Force**: Character-specific (Kangaroo: -12, Koala: -11.5)
- **Ground Level**: 350px
- **Initial Speed**: 6 pixels per frame
- **Speed Increase**: +0.5 every 5 seconds (max: 12)

### Scoring
- +1 point every 0.1 seconds during gameplay
- High score persists across sessions
- New high score celebration with pulsing animation

## 🔧 Customization

Want to modify the game? Here are some key variables:

**In `game.js`:**
- `gameSpeed` - Initial obstacle speed
- `config.groundLevel` - Ground position
- `obstacleSpawnInterval` - Time between obstacles

**In character files:**
- `jumpForce` - Jump strength
- Sprite dimensions and colors

**In `background.js`:**
- `cloudSpeed`, `mountainSpeed`, `midGroundSpeed` - Parallax speeds
- Mountain/cloud generation parameters

## 📱 Responsive Design

The game canvas automatically scales to fit different screen sizes while maintaining aspect ratio.

## 🏆 Credits

Inspired by the Chrome Dinosaur Game (T-Rex Runner) developed by Google.

## 📄 License

This project is open source and available for educational purposes.

---

**Enjoy playing Retro Runner! 🎮**
