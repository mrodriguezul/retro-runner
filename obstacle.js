/**
 * Obstacle Class
 * Represents trees and bushes that the kangaroo must jump over
 */

const ObstacleType = {
    TREE: 'TREE',
    BUSH: 'BUSH',
    RIVER: 'RIVER',
    ROCK: 'ROCK',
    FENCE: 'FENCE'
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
        } else if (type === ObstacleType.RIVER) {
            this.width = 80;
            this.height = 30;
            this.y = y - this.height; // Position from ground up
        } else if (type === ObstacleType.ROCK) {
            this.width = 45;
            this.height = 45;
            this.y = y - this.height; // Position from ground up
        } else if (type === ObstacleType.FENCE) {
            this.width = 50;
            this.height = 60;
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
        } else if (this.type === ObstacleType.RIVER) {
            this.drawRiver(ctx);
        } else if (this.type === ObstacleType.ROCK) {
            this.drawRock(ctx);
        } else if (this.type === ObstacleType.FENCE) {
            this.drawFence(ctx);
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

    drawRiver(ctx) {
        // River - flowing water with waves
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Water waves (animated-looking wavy lines)
        ctx.strokeStyle = '#29b6f6';
        ctx.lineWidth = 2;
        const waveCount = 3;
        const waveHeight = this.height / waveCount;
        
        for (let i = 0; i < waveCount; i++) {
            ctx.beginPath();
            const yPos = this.y + (i * waveHeight) + waveHeight / 2;
            for (let x = 0; x <= this.width; x += 10) {
                const waveY = yPos + Math.sin((x + Date.now() * 0.005) * 0.5) * 3;
                if (x === 0) {
                    ctx.moveTo(this.x + x, waveY);
                } else {
                    ctx.lineTo(this.x + x, waveY);
                }
            }
            ctx.stroke();
        }

        // River border
        ctx.strokeStyle = '#0288d1';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawRock(ctx) {
        // Rock - irregular gray stone
        ctx.fillStyle = '#757575';
        
        // Draw rock as irregular polygon
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y); // Top center
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.3); // Upper right
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7); // Right
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height); // Bottom right
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height); // Bottom left
        ctx.lineTo(this.x, this.y + this.height * 0.6); // Left
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height * 0.2); // Upper left
        ctx.closePath();
        ctx.fill();

        // Rock highlights
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.4);
        ctx.closePath();
        ctx.fill();

        // Rock outline
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.3, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height * 0.6);
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height * 0.2);
        ctx.closePath();
        ctx.stroke();
    }

    drawFence(ctx) {
        // Wooden fence with vertical posts
        const postCount = 4;
        const postWidth = this.width / postCount;
        const postHeight = this.height;

        // Draw fence posts
        for (let i = 0; i < postCount; i++) {
            const postX = this.x + (i * postWidth);
            
            // Post
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(postX, this.y, postWidth - 4, postHeight);
            
            // Post outline
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 2;
            ctx.strokeRect(postX, this.y, postWidth - 4, postHeight);
        }

        // Horizontal beams
        ctx.fillStyle = '#a1887f';
        const beamHeight = 8;
        
        // Top beam
        ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, beamHeight);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y + this.height * 0.2, this.width, beamHeight);
        
        // Bottom beam
        ctx.fillRect(this.x, this.y + this.height * 0.6, this.width, beamHeight);
        ctx.strokeRect(this.x, this.y + this.height * 0.6, this.width, beamHeight);
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
