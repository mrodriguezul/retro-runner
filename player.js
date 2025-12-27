/**
 * Kangaroo Player Class
 * Handles player physics, jumping, and rendering
 */
class Kangaroo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.velocityY = 0;
        this.gravity = 0.6;
        this.jumpForce = -12;
        this.isJumping = false;
        this.groundY = y; // Remember original ground position
    }

    jump() {
        // Only allow jump if kangaroo is on the ground
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    draw(ctx) {
        // Draw simple kangaroo as a colored rectangle for now
        // Body
        ctx.fillStyle = '#8B4513'; // Brown color
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x + 20, this.y - 15, 20, 20);

        // Eye
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 30, this.y - 10, 4, 4);

        // Legs (simple rectangles)
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 5, this.y + 40, 10, 10);
        ctx.fillRect(this.x + 25, this.y + 40, 10, 10);
    }

    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
    }

    // Get hitbox for collision detection
    getHitbox() {
        // Reduce hitbox by 20% for forgiving gameplay
        const margin = 0.1;
        return {
            x: this.x + (this.width * margin),
            y: this.y + (this.height * margin),
            width: this.width * (1 - 2 * margin),
            height: this.height * (1 - 2 * margin)
        };
    }
}
