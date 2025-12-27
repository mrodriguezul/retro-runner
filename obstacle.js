/**
 * Obstacle Class
 * Represents trees and bushes that the kangaroo must jump over
 */

const ObstacleType = {
    TREE: 'TREE',
    BUSH: 'BUSH'
};

class Obstacle {
    constructor(x, y, type) {
        this.x = x;
        this.type = type;
        this.speed = 6; // Pixels per frame

        // Set dimensions based on type
        if (type === ObstacleType.TREE) {
            this.width = 60;
            this.height = 80;
            this.y = y - this.height; // Position from ground up
        } else if (type === ObstacleType.BUSH) {
            this.width = 50;
            this.height = 40;
            this.y = y - this.height; // Position from ground up
        }
    }

    update() {
        // Move obstacle left
        this.x -= this.speed;
    }

    draw(ctx) {
        if (this.type === ObstacleType.TREE) {
            this.drawTree(ctx);
        } else if (this.type === ObstacleType.BUSH) {
            this.drawBush(ctx);
        }
    }

    drawTree(ctx) {
        // Tree trunk
        ctx.fillStyle = '#6b4423';
        const trunkWidth = 20;
        const trunkHeight = 40;
        const trunkX = this.x + (this.width - trunkWidth) / 2;
        const trunkY = this.y + this.height - trunkHeight;
        ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

        // Tree crown (triangle)
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top point
        ctx.lineTo(this.x, this.y + 50); // Bottom left
        ctx.lineTo(this.x + this.width, this.y + 50); // Bottom right
        ctx.closePath();
        ctx.fill();

        // Tree crown outline
        ctx.strokeStyle = '#1b6b1b';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawBush(ctx) {
        // Bush (rounded rectangles)
        ctx.fillStyle = '#2e7d32';
        
        // Draw multiple circles to create bush shape
        const radius = this.height / 2;
        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - radius, this.y + radius, radius, 0, Math.PI * 2);
        ctx.fill();

        // Center fill
        ctx.fillRect(this.x + radius, this.y, this.width - radius * 2, this.height);

        // Bush outline
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x + this.width - radius, this.y + radius, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    isOffScreen() {
        // Check if obstacle has moved completely off the left side
        return this.x + this.width < 0;
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
