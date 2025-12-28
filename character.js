/**
 * Base Character Class
 * Abstract class for all playable characters (Kangaroo, Koala, etc.)
 * Provides shared physics, animation, and collision logic
 */
class Character {
    constructor(x, y, config = {}) {
        // Position and dimensions
        this.x = x;
        this.y = y;
        this.width = config.width || 40;
        this.height = config.height || 50;
        
        // Physics properties
        this.velocityY = 0;
        this.gravity = config.gravity || 0.6;
        this.jumpForce = config.jumpForce || -12;
        this.isJumping = false;
        this.groundY = y; // Remember original ground position
        this.wasJumping = false; // Track previous jump state for landing detection
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = config.animationSpeed || 0.15;
        
        // Character metadata
        this.name = config.name || 'Character';
    }

    /**
     * Make the character jump
     */
    jump() {
        // Only allow jump if character is on the ground
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }

    /**
     * Update physics and animation
     */
    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        if (this.y >= this.groundY) {
            // Landing detected - create dust particles
            if (this.wasJumping && typeof createLandingParticles === 'function') {
                createLandingParticles(this.x, this.y);
            }
            
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
        
        // Track jump state for landing detection
        this.wasJumping = this.isJumping;
        
        // Update animation frame (only when running on ground)
        if (!this.isJumping) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= 2) {
                this.animationFrame = 0;
            }
        }
    }

    /**
     * Draw the character (to be overridden by subclasses)
     */
    draw(ctx) {
        // This should be implemented by each character subclass
        console.warn('Character.draw() should be overridden by subclass');
    }

    /**
     * Reset character to initial state
     */
    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.wasJumping = false;
        this.animationFrame = 0;
    }

    /**
     * Get hitbox for collision detection
     * Reduced by 10% for forgiving gameplay
     */
    getHitbox() {
        const margin = 0.1;
        return {
            x: this.x + (this.width * margin),
            y: this.y + (this.height * margin),
            width: this.width * (1 - 2 * margin),
            height: this.height * (1 - 2 * margin)
        };
    }

    /**
     * Draw a preview of the character (for selection screen)
     * Can be overridden for custom preview
     */
    drawPreview(ctx, x, y, scale = 1.5) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        this.draw(ctx);
        ctx.restore();
    }
}
