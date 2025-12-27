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
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.15;
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
        
        // Update animation frame (only when running on ground)
        if (!this.isJumping) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= 2) {
                this.animationFrame = 0;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Slight rotation when jumping
        if (this.isJumping && this.velocityY < 0) {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(-0.1);
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        }
        
        // Main body (oval shape)
        ctx.fillStyle = '#c17817';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 25, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chest (lighter color)
        ctx.fillStyle = '#e8b456';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 28, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#c17817';
        ctx.beginPath();
        ctx.ellipse(this.x + 22, this.y + 5, 10, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears (long kangaroo ears)
        ctx.fillStyle = '#a0631f';
        // Left ear
        ctx.beginPath();
        ctx.ellipse(this.x + 17, this.y - 5, 3, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Right ear
        ctx.beginPath();
        ctx.ellipse(this.x + 27, this.y - 5, 3, 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ears (pink)
        ctx.fillStyle = '#ffb3d9';
        ctx.beginPath();
        ctx.ellipse(this.x + 17, this.y - 3, 1.5, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 27, this.y - 3, 1.5, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 26, this.y + 4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlight
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 27, this.y + 3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 8, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.strokeStyle = '#a0631f';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 30);
        ctx.quadraticCurveTo(this.x - 5, this.y + 35, this.x - 2, this.y + 45);
        ctx.stroke();
        
        // Arms (small)
        ctx.fillStyle = '#c17817';
        ctx.beginPath();
        ctx.ellipse(this.x + 12, this.y + 20, 3, 6, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 28, this.y + 20, 3, 6, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (animated for running effect)
        const legOffset = Math.floor(this.animationFrame) * 3;
        
        // Back leg
        ctx.fillStyle = '#a0631f';
        ctx.beginPath();
        if (this.isJumping) {
            // Extended leg when jumping
            ctx.ellipse(this.x + 10, this.y + 42, 5, 10, 0, 0, Math.PI * 2);
        } else {
            // Running animation
            ctx.ellipse(this.x + 10, this.y + 40 + legOffset, 5, 10, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Front leg
        ctx.fillStyle = '#a0631f';
        ctx.beginPath();
        if (this.isJumping) {
            // Extended leg when jumping
            ctx.ellipse(this.x + 25, this.y + 42, 5, 10, 0, 0, Math.PI * 2);
        } else {
            // Running animation (opposite phase)
            ctx.ellipse(this.x + 25, this.y + 40 - legOffset, 5, 10, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Foot pads (large kangaroo feet)
        ctx.fillStyle = '#654321';
        if (this.isJumping) {
            ctx.fillRect(this.x + 8, this.y + 48, 8, 4);
            ctx.fillRect(this.x + 23, this.y + 48, 8, 4);
        } else {
            ctx.fillRect(this.x + 8, this.y + 46 + legOffset, 8, 4);
            ctx.fillRect(this.x + 23, this.y + 46 - legOffset, 8, 4);
        }
        
        ctx.restore();
    }

    reset() {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.animationFrame = 0;
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
