/**
 * Koala Character Class
 * Playable koala character with unique sprite
 */
class Koala extends Character {
    constructor(x, y) {
        super(x, y, {
            width: 40,
            height: 45,
            gravity: 0.6,
            jumpForce: -11.5, // Slightly lower jump than kangaroo
            animationSpeed: 0.12,
            name: 'Koala'
        });
    }

    draw(ctx) {
        ctx.save();
        
        // Slight rotation when jumping
        if (this.isJumping && this.velocityY < 0) {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(-0.08);
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        }
        
        // Main body (oval shape) - gray
        ctx.fillStyle = '#7a7a7a';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 25, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chest (lighter gray/white)
        ctx.fillStyle = '#d0d0d0';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 28, 11, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#7a7a7a';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 8, 12, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Large round ears (iconic koala feature)
        ctx.fillStyle = '#6a6a6a';
        // Left ear
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y - 2, 7, 0, Math.PI * 2);
        ctx.fill();
        // Right ear
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y - 2, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ears (darker)
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y - 1, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y - 1, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout/muzzle (lighter area)
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 10, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose (large black)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 11, 3, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes (small and beady)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 24, this.y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 16.5, this.y + 5.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 24.5, this.y + 5.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Arms (stubby)
        ctx.fillStyle = '#7a7a7a';
        ctx.beginPath();
        ctx.ellipse(this.x + 10, this.y + 22, 4, 7, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 30, this.y + 22, 4, 7, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Claws on arms
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 27 + i * 2);
            ctx.lineTo(this.x + 6, this.y + 28 + i * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + 32, this.y + 27 + i * 2);
            ctx.lineTo(this.x + 34, this.y + 28 + i * 2);
            ctx.stroke();
        }
        
        // Legs (animated for running effect)
        const legOffset = Math.floor(this.animationFrame) * 2;
        
        // Back leg
        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        if (this.isJumping) {
            ctx.ellipse(this.x + 12, this.y + 40, 5, 8, 0, 0, Math.PI * 2);
        } else {
            ctx.ellipse(this.x + 12, this.y + 38 + legOffset, 5, 8, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Front leg
        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        if (this.isJumping) {
            ctx.ellipse(this.x + 28, this.y + 40, 5, 8, 0, 0, Math.PI * 2);
        } else {
            ctx.ellipse(this.x + 28, this.y + 38 - legOffset, 5, 8, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Foot pads
        ctx.fillStyle = '#4a4a4a';
        if (this.isJumping) {
            ctx.fillRect(this.x + 10, this.y + 44, 6, 3);
            ctx.fillRect(this.x + 26, this.y + 44, 6, 3);
        } else {
            ctx.fillRect(this.x + 10, this.y + 42 + legOffset, 6, 3);
            ctx.fillRect(this.x + 26, this.y + 42 - legOffset, 6, 3);
        }
        
        ctx.restore();
    }
}
