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

/**
 * Initialize the game
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    restartBtn = document.getElementById('restartBtn');

    // Create kangaroo player
    kangaroo = new Kangaroo(100, config.groundLevel - 50);

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
    }
}

/**
 * Render the game
 */
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky background
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(0, config.groundLevel, canvas.width, canvas.height - config.groundLevel);

    // Draw ground line
    ctx.strokeStyle = '#558b2f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, config.groundLevel);
    ctx.lineTo(canvas.width, config.groundLevel);
    ctx.stroke();

    // Draw kangaroo
    kangaroo.draw(ctx);

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

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('RETRO RUNNER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px "Courier New"';
    ctx.fillText('Press SPACE to Jump and Start!', canvas.width / 2, canvas.height / 2 + 20);
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
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    // Show restart button
    restartBtn.classList.remove('hidden');
}

/**
 * Reset game to initial state
 */
function resetGame() {
    gameState = GameState.START;
    kangaroo.reset();
    restartBtn.classList.add('hidden');
}

// Start the game when page loads
window.addEventListener('load', init);
