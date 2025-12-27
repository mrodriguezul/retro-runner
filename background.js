/**
 * Background Class
 * Manages parallax scrolling layers for countryside scenery
 */

class Background {
    constructor(canvasWidth, canvasHeight, groundLevel) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundLevel = groundLevel;
        
        // Parallax layer offsets
        this.mountainOffset = 0;
        this.groundOffset = 0;
        
        // Scrolling speeds (multipliers)
        this.mountainSpeed = 0.3;
        this.groundSpeed = 1.0;
        
        // Generate mountains
        this.mountains = this.generateMountains();
    }
    
    /**
     * Generate mountain data for repeating pattern
     */
    generateMountains() {
        const mountains = [];
        const patternWidth = 1600; // Width before pattern repeats
        const numMountains = 8;
        
        for (let i = 0; i < numMountains; i++) {
            mountains.push({
                x: (patternWidth / numMountains) * i + Math.random() * 100,
                width: 100 + Math.random() * 100,
                height: 80 + Math.random() * 60,
                color: i % 2 === 0 ? '#4a6fa5' : '#5a7fb5'
            });
        }
        
        return mountains;
    }
    
    /**
     * Update parallax offsets
     */
    update(speed) {
        // Update mountain offset (slower parallax)
        this.mountainOffset -= speed * this.mountainSpeed;
        if (this.mountainOffset <= -1600) {
            this.mountainOffset += 1600;
        }
        
        // Update ground offset (matches game speed)
        this.groundOffset -= speed * this.groundSpeed;
        if (this.groundOffset <= -100) {
            this.groundOffset += 100;
        }
    }
    
    /**
     * Draw all background layers
     */
    draw(ctx) {
        this.drawSky(ctx);
        this.drawMountains(ctx);
        this.drawGround(ctx);
    }
    
    /**
     * Draw sky with gradient (sunrise effect)
     */
    drawSky(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, '#87ceeb');  // Light blue at top
        gradient.addColorStop(0.6, '#b0d4f1'); // Lighter blue
        gradient.addColorStop(1, '#ffe5b4');  // Pale yellow at horizon
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.groundLevel);
    }
    
    /**
     * Draw mountains with parallax scrolling
     */
    drawMountains(ctx) {
        const mountainY = this.groundLevel - 120; // Position mountains above ground
        
        // Draw mountains twice for seamless scrolling
        for (let repeat = 0; repeat < 2; repeat++) {
            const offsetX = this.mountainOffset + (repeat * 1600);
            
            this.mountains.forEach(mountain => {
                const x = mountain.x + offsetX;
                
                // Only draw if on screen
                if (x + mountain.width > -100 && x < this.canvasWidth + 100) {
                    this.drawMountain(ctx, x, mountainY, mountain.width, mountain.height, mountain.color);
                }
            });
        }
    }
    
    /**
     * Draw a single mountain (triangle)
     */
    drawMountain(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y - height); // Peak
        ctx.lineTo(x, y); // Bottom left
        ctx.lineTo(x + width, y); // Bottom right
        ctx.closePath();
        ctx.fill();
        
        // Mountain highlight (snow cap)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y - height);
        ctx.lineTo(x + width / 2 - 15, y - height + 30);
        ctx.lineTo(x + width / 2 + 15, y - height + 30);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draw ground with grass pattern
     */
    drawGround(ctx) {
        // Base ground color
        ctx.fillStyle = '#7cb342';
        ctx.fillRect(0, this.groundLevel, this.canvasWidth, this.canvasHeight - this.groundLevel);
        
        // Ground line
        ctx.strokeStyle = '#558b2f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, this.groundLevel);
        ctx.lineTo(this.canvasWidth, this.groundLevel);
        ctx.stroke();
        
        // Grass pattern (small lines)
        ctx.strokeStyle = '#8bc34a';
        ctx.lineWidth = 2;
        
        // Draw grass blades with scrolling
        for (let repeat = 0; repeat < 2; repeat++) {
            const offsetX = this.groundOffset + (repeat * 100);
            
            for (let i = 0; i < this.canvasWidth / 10; i++) {
                const x = (i * 10) + offsetX;
                
                if (x > -10 && x < this.canvasWidth + 10) {
                    const grassY = this.groundLevel + 5;
                    const grassHeight = 5 + Math.random() * 5;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, grassY);
                    ctx.lineTo(x + 2, grassY - grassHeight);
                    ctx.stroke();
                }
            }
        }
        
        // Darker ground bottom
        const groundGradient = ctx.createLinearGradient(0, this.groundLevel + 20, 0, this.canvasHeight);
        groundGradient.addColorStop(0, 'rgba(107, 142, 35, 0)');
        groundGradient.addColorStop(1, 'rgba(85, 107, 47, 0.5)');
        
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, this.groundLevel + 20, this.canvasWidth, this.canvasHeight - this.groundLevel - 20);
    }
    
    /**
     * Reset parallax offsets
     */
    reset() {
        this.mountainOffset = 0;
        this.groundOffset = 0;
    }
}
