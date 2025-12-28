/**
 * Retro Runner Game - Main Game Logic
 * A Chrome Dino-style endless runner with a kangaroo
 */

// Game states
const GameState = {
    START: 'START',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
};

// Game configuration
const config = {
    canvas: {
        width: 800,
        height: 400
    },
    groundLevel: 320, // 80% of canvas height
    fps: 60
};

// Game variables
let canvas;
let ctx;
let gameState = GameState.START;
let lastTime = 0;
let kangaroo;
let restartBtn;
let obstacles = [];
let obstacleTimer = 0;
let obstacleSpawnInterval = 2000; // milliseconds
let background;
let score = 0;
let highScore = 0;
let gameTime = 0;

/**
 * Initialize the game
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    restartBtn = document.getElementById('restartBtn');

    // Create kangaroo player
    kangaroo = new Kangaroo(100, config.groundLevel - 50);
    
    // Create background with parallax layers
    background = new Background(config.canvas.width, config.canvas.height, config.groundLevel);
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('retroRunnerHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore, 10);
    }

    // Setup input handlers
    setupInput();

    // Start game loop
    requestAnimationFrame(gameLoop);
}

/**
 * Setup keyboard and button input handlers
 */
function setupInput() {
    // Keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault(); // Prevent page scroll
            handleJump();
        }
    });

    // Restart button
    restartBtn.addEventListener('click', () => {
        resetGame();
    });
}

/**
 * Handle jump input
 */
function handleJump() {
    if (gameState === GameState.START) {
        // First jump starts the game
        gameState = GameState.PLAYING;
        kangaroo.jump();
    } else if (gameState === GameState.PLAYING) {
        kangaroo.jump();
    }
}

/**
 * Main game loop
 */
function gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update and render
    update(deltaTime);
    render();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

/**
 * Update game state
 */
function update(deltaTime) {
    if (gameState === GameState.PLAYING) {
        kangaroo.update();
        
        // Update game time and score
        gameTime += deltaTime;
        score = Math.floor(gameTime / 100); // Score based on time survived
        
        // Update background parallax
        background.update(6); // Match obstacle speed
        
        // Update obstacles
        updateObstacles(deltaTime);
        
        // Spawn new obstacles
        spawnObstacles(deltaTime);
        
        // Check collisions
        checkCollisions();
    }
}

/**
 * Render the game
 */
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with parallax layers
    background.draw(ctx);

    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw(ctx));
    
    // Draw kangaroo
    kangaroo.draw(ctx);
    
    // Draw score if playing
    if (gameState === GameState.PLAYING) {
        drawScore();
    }

    // Draw UI based on game state
    if (gameState === GameState.START) {
        drawStartScreen();
    } else if (gameState === GameState.GAME_OVER) {
        drawGameOverScreen();
    }
}

/**
 * Draw start screen
 */
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 56px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('RETRO RUNNER', canvas.width / 2, canvas.height / 2 - 60);
    
    ctx.fillStyle = '#fff';
    ctx.font = '28px "Courier New"';
    ctx.fillText('Press SPACE to Jump and Start!', canvas.width / 2, canvas.height / 2 + 10);
    
    // Show high score if exists
    if (highScore > 0) {
        ctx.font = '20px "Courier New"';
        ctx.fillStyle = '#f39c12';
        ctx.fillText('HIGH SCORE: ' + highScore, canvas.width / 2, canvas.height / 2 + 50);
    }
    
    // Small instructions
    ctx.font = '16px "Courier New"';
    ctx.fillStyle = '#bdc3c7';
    ctx.fillText('Jump over trees and bushes!', canvas.width / 2, canvas.height - 40);
}

/**
 * Draw game over screen
 */
function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 56px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60);
    
    // Display final score
    ctx.fillStyle = '#fff';
    ctx.font = '32px "Courier New"';
    ctx.fillText('SCORE: ' + score, canvas.width / 2, canvas.height / 2);
    
    // Check if new high score
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 24px "Courier New"';
        ctx.fillText('★ NEW HIGH SCORE! ★', canvas.width / 2, canvas.height / 2 + 40);
    } else if (highScore > 0) {
        ctx.fillStyle = '#95a5a6';
        ctx.font = '24px "Courier New"';
        ctx.fillText('High Score: ' + highScore, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    // Restart instruction
    ctx.fillStyle = '#bdc3c7';
    ctx.font = '18px "Courier New"';
    ctx.fillText('Click RESTART GAME to play again', canvas.width / 2, canvas.height / 2 + 80);

    // Show restart button
    restartBtn.classList.remove('hidden');
}

/**
 * Reset game to initial state
 */
function resetGame() {
    gameState = GameState.START;
    kangaroo.reset();
    obstacles = [];
    obstacleTimer = 0;
    background.reset();
    score = 0;
    gameTime = 0;
    restartBtn.classList.add('hidden');
}

/**
 * Spawn obstacles at random intervals
 */
function spawnObstacles(deltaTime) {
    obstacleTimer += deltaTime;
    
    if (obstacleTimer >= obstacleSpawnInterval) {
        // Random obstacle type
        const types = [ObstacleType.TREE, ObstacleType.BUSH];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Create new obstacle at right edge of canvas
        const obstacle = new Obstacle(canvas.width, config.groundLevel, randomType);
        obstacles.push(obstacle);
        
        // Reset timer with random interval (1.5 - 3 seconds)
        obstacleTimer = 0;
        obstacleSpawnInterval = 1500 + Math.random() * 1500;
    }
}

/**
 * Update all obstacles and remove off-screen ones
 */
function updateObstacles(deltaTime) {
    // Update each obstacle
    obstacles.forEach(obstacle => obstacle.update());
    
    // Remove off-screen obstacles (cleanup)
    obstacles = obstacles.filter(obstacle => !obstacle.isOffScreen());
}

/**
 * Check for collisions between kangaroo and obstacles
 */
function checkCollisions() {
    const kangarooBox = kangaroo.getHitbox();
    
    for (let obstacle of obstacles) {
        const obstacleBox = obstacle.getHitbox();
        
        // AABB collision detection
        if (kangarooBox.x < obstacleBox.x + obstacleBox.width &&
            kangarooBox.x + kangarooBox.width > obstacleBox.x &&
            kangarooBox.y < obstacleBox.y + obstacleBox.height &&
            kangarooBox.y + kangarooBox.height > obstacleBox.y) {
            // Collision detected - game over
            gameState = GameState.GAME_OVER;
            
            // Update and save high score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('retroRunnerHighScore', highScore.toString());
            }
            break;
        }
    }
}

/**
 * Draw current score
 */
function drawScore() {
    ctx.save();
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 28px "Courier New"';
    ctx.textAlign = 'right';
    ctx.fillText('SCORE: ' + score, canvas.width - 20, 40);
    
    // Draw high score below current score
    if (highScore > 0) {
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 20px "Courier New"';
        ctx.fillText('HIGH: ' + highScore, canvas.width - 20, 65);
    }
    ctx.restore();
}

// Start the game when page loads
window.addEventListener('load', init);
