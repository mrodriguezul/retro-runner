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
let gameSpeed = 6; // Base speed for obstacles
let particles = []; // Landing dust particles
let collisionFlash = 0; // Red flash on collision
let newHighScorePulse = 0; // Pulse animation for new high score

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
    
    // Touch and click support for mobile
    canvas.addEventListener('click', () => {
        handleJump();
    });
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        handleJump();
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
        
        // Difficulty progression - increase speed every 500 points
        gameSpeed = 6 + Math.min(Math.floor(score / 500) * 0.5, 4); // Cap at speed 10
        
        // Decrease spawn interval as difficulty increases
        const minSpawnInterval = Math.max(1200, 2000 - Math.floor(score / 500) * 200);
        
        // Update background parallax
        background.update(gameSpeed);
        
        // Update obstacles
        updateObstacles(deltaTime);
        
        // Spawn new obstacles
        spawnObstacles(deltaTime, minSpawnInterval);
        
        // Check collisions
        checkCollisions();
        
        // Create landing particles
        updateParticles(deltaTime);
    }
    
    // Update visual effects
    if (collisionFlash > 0) {
        collisionFlash -= deltaTime;
    }
    
    if (newHighScorePulse > 0) {
        newHighScorePulse -= deltaTime;
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
    
    // Draw particles
    particles.forEach(particle => particle.draw(ctx));
    
    // Draw kangaroo
    kangaroo.draw(ctx);
    
    // Collision flash effect
    if (collisionFlash > 0) {
        ctx.fillStyle = `rgba(231, 76, 60, ${Math.min(collisionFlash / 300, 0.4)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
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
        // Pulse animation for new high score
        const pulse = Math.abs(Math.sin(newHighScorePulse / 200)) * 0.3 + 1;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 + 40);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 24px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('★ NEW HIGH SCORE! ★', 0, 0);
        ctx.restore();
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
    gameSpeed = 6; // Reset speed
    particles = []; // Clear particles
    collisionFlash = 0;
    newHighScorePulse = 0;
    restartBtn.classList.add('hidden');
}

/**
 * Spawn obstacles at random intervals
 */
function spawnObstacles(deltaTime, minSpawnInterval) {
    obstacleTimer += deltaTime;
    
    if (obstacleTimer >= obstacleSpawnInterval) {
        // Random obstacle type
        const types = [ObstacleType.TREE, ObstacleType.BUSH];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Create new obstacle at right edge of canvas with current speed
        const obstacle = new Obstacle(canvas.width, config.groundLevel, randomType);
        obstacle.speed = gameSpeed; // Apply current game speed
        obstacles.push(obstacle);
        
        // Reset timer with random interval (respecting minimum)
        obstacleTimer = 0;
        obstacleSpawnInterval = minSpawnInterval + Math.random() * 800;
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
            collisionFlash = 500; // Trigger red flash
            
            // Update and save high score
            if (score > highScore) {
                highScore = score;
                newHighScorePulse = 3000; // Start pulse animation
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

/**
 * Particle class for dust effects
 */
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 3;
        this.velocityY = -Math.random() * 2 - 1;
        this.life = 500; // milliseconds
        this.maxLife = 500;
        this.size = Math.random() * 3 + 2;
    }
    
    update(deltaTime) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.1; // Gravity
        this.life -= deltaTime;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(139, 139, 139, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

/**
 * Update and clean up particles
 */
function updateParticles(deltaTime) {
    // Update all particles
    particles.forEach(particle => particle.update(deltaTime));
    
    // Remove dead particles
    particles = particles.filter(particle => !particle.isDead());
}

/**
 * Create landing dust particles
 */
function createLandingParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x + Math.random() * 30, y + 50));
    }
}

// Start the game when page loads
window.addEventListener('load', init);
