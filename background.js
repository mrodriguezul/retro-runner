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
        this.midGroundOffset = 0;
        this.groundOffset = 0;
        this.cloudOffset = 0;
        
        // Scrolling speeds (multipliers)
        this.cloudSpeed = 0.1;
        this.mountainSpeed = 0.3;
        this.midGroundSpeed = 0.5;
        this.groundSpeed = 1.0;
        
        // Generate scenery elements
        this.clouds = this.generateClouds();
        this.mountains = this.generateMountains();
        this.midGroundObjects = this.generateMidGround();
    }
    
    /**
     * Generate clouds for sky
     */
    generateClouds() {
        const clouds = [];
        const patternWidth = 1600;
        const numClouds = 6;
        
        for (let i = 0; i < numClouds; i++) {
            clouds.push({
                x: (patternWidth / numClouds) * i + Math.random() * 150,
                y: 30 + Math.random() * 100,
                width: 60 + Math.random() * 40,
                height: 25 + Math.random() * 15,
                puffs: Math.floor(3 + Math.random() * 3) // Number of cloud puffs
            });
        }
        
        return clouds;
    }
    
    /**
     * Generate mountain data for repeating pattern
     */
    generateMountains() {
        const mountains = [];
        const patternWidth = 1600;
        const numMountains = 10;
        
        const mountainTypes = ['sharp', 'rounded', 'jagged'];
        const mountainColors = ['#4a6fa5', '#5a7fb5', '#3d5a8c', '#6a8fc5'];
        
        for (let i = 0; i < numMountains; i++) {
            mountains.push({
                x: (patternWidth / numMountains) * i + Math.random() * 80,
                width: 80 + Math.random() * 120,
                height: 60 + Math.random() * 80,
                type: mountainTypes[Math.floor(Math.random() * mountainTypes.length)],
                color: mountainColors[Math.floor(Math.random() * mountainColors.length)]
            });
        }
        
        return mountains;
    }
    
    /**
     * Generate mid-ground objects (trees, houses, bushes)
     */
    generateMidGround() {
        const objects = [];
        const patternWidth = 1600;
        const numObjects = 8;
        
        const objectTypes = ['tree', 'house', 'bush'];
        
        for (let i = 0; i < numObjects; i++) {
            const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
            objects.push({
                x: (patternWidth / numObjects) * i + Math.random() * 100,
                type: type,
                size: 0.7 + Math.random() * 0.5 // Scale multiplier
            });
        }
        
        return objects;
    }
    
    /**
     * Update parallax offsets
     */
    update(speed) {
        // Update cloud offset (very slow)
        this.cloudOffset -= speed * this.cloudSpeed;
        if (this.cloudOffset <= -1600) {
            this.cloudOffset += 1600;
        }
        
        // Update mountain offset (slower parallax)
        this.mountainOffset -= speed * this.mountainSpeed;
        if (this.mountainOffset <= -1600) {
            this.mountainOffset += 1600;
        }
        
        // Update mid-ground offset (medium speed)
        this.midGroundOffset -= speed * this.midGroundSpeed;
        if (this.midGroundOffset <= -1600) {
            this.midGroundOffset += 1600;
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
        this.drawClouds(ctx);
        this.drawMountains(ctx);
        this.drawMidGround(ctx);
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
     * Draw clouds drifting across sky
     */
    drawClouds(ctx) {
        // Draw clouds twice for seamless scrolling
        for (let repeat = 0; repeat < 2; repeat++) {
            const offsetX = this.cloudOffset + (repeat * 1600);
            
            this.clouds.forEach(cloud => {
                const x = cloud.x + offsetX;
                
                // Only draw if on screen
                if (x + cloud.width > -100 && x < this.canvasWidth + 100) {
                    this.drawCloud(ctx, x, cloud.y, cloud.width, cloud.height, cloud.puffs);
                }
            });
        }
    }
    
    /**
     * Draw a single cloud with multiple puffs
     */
    drawCloud(ctx, x, y, width, height, puffs) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        const puffWidth = width / puffs;
        for (let i = 0; i < puffs; i++) {
            const puffX = x + (i * puffWidth);
            const puffY = y + (Math.sin(i) * height * 0.2);
            const radius = puffWidth / 2 + (i === Math.floor(puffs / 2) ? 5 : 0); // Center puff is bigger
            
            ctx.beginPath();
            ctx.arc(puffX + radius, puffY + height / 2, radius, 0, Math.PI * 2);
            ctx.fill();
        }
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
                    this.drawMountain(ctx, x, mountainY, mountain.width, mountain.height, mountain.color, mountain.type);
                }
            });
        }
    }
    
    /**
     * Draw a single mountain with varied shapes
     */
    drawMountain(ctx, x, y, width, height, color, type) {
        ctx.fillStyle = color;
        ctx.beginPath();
        
        if (type === 'sharp') {
            // Sharp triangular peak
            ctx.moveTo(x + width / 2, y - height);
            ctx.lineTo(x, y);
            ctx.lineTo(x + width, y);
        } else if (type === 'rounded') {
            // Rounded mountain top
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + width / 4, y - height * 0.7, x + width / 2, y - height);
            ctx.quadraticCurveTo(x + width * 0.75, y - height * 0.7, x + width, y);
        } else if (type === 'jagged') {
            // Jagged peaks
            ctx.moveTo(x, y);
            ctx.lineTo(x + width * 0.3, y - height * 0.6);
            ctx.lineTo(x + width * 0.5, y - height);
            ctx.lineTo(x + width * 0.7, y - height * 0.7);
            ctx.lineTo(x + width, y);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Mountain highlight (snow cap)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y - height);
        ctx.lineTo(x + width / 2 - 15, y - height + 25);
        ctx.lineTo(x + width / 2 + 15, y - height + 25);
        ctx.closePath();
        ctx.fill();
        
        // Shadow on left side
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height);
        ctx.lineTo(x + width / 3, y);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draw mid-ground layer (trees, houses, bushes)
     */
    drawMidGround(ctx) {
        const midGroundY = this.groundLevel - 20; // Just above ground level
        
        // Draw mid-ground objects twice for seamless scrolling
        for (let repeat = 0; repeat < 2; repeat++) {
            const offsetX = this.midGroundOffset + (repeat * 1600);
            
            this.midGroundObjects.forEach(obj => {
                const x = obj.x + offsetX;
                
                // Only draw if on screen
                if (x > -100 && x < this.canvasWidth + 100) {
                    if (obj.type === 'tree') {
                        this.drawMidGroundTree(ctx, x, midGroundY, obj.size);
                    } else if (obj.type === 'house') {
                        this.drawMidGroundHouse(ctx, x, midGroundY, obj.size);
                    } else if (obj.type === 'bush') {
                        this.drawMidGroundBush(ctx, x, midGroundY, obj.size);
                    }
                }
            });
        }
    }
    
    /**
     * Draw small tree in mid-ground
     */
    drawMidGroundTree(ctx, x, y, scale) {
        const width = 15 * scale;
        const height = 35 * scale;
        
        // Tree trunk
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x - 3 * scale, y - 12 * scale, 6 * scale, 12 * scale);
        
        // Tree foliage (triangle)
        ctx.fillStyle = '#558b2f';
        ctx.beginPath();
        ctx.moveTo(x, y - height);
        ctx.lineTo(x - width / 2, y - 15 * scale);
        ctx.lineTo(x + width / 2, y - 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Darker shade
        ctx.fillStyle = '#33691e';
        ctx.beginPath();
        ctx.moveTo(x, y - height);
        ctx.lineTo(x - width / 4, y - 20 * scale);
        ctx.lineTo(x, y - 15 * scale);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draw small house in mid-ground
     */
    drawMidGroundHouse(ctx, x, y, scale) {
        const width = 25 * scale;
        const height = 20 * scale;
        
        // House body
        ctx.fillStyle = '#d84315';
        ctx.fillRect(x - width / 2, y - height, width, height);
        
        // Roof
        ctx.fillStyle = '#bf360c';
        ctx.beginPath();
        ctx.moveTo(x, y - height - 10 * scale);
        ctx.lineTo(x - width / 2 - 3 * scale, y - height);
        ctx.lineTo(x + width / 2 + 3 * scale, y - height);
        ctx.closePath();
        ctx.fill();
        
        // Window
        ctx.fillStyle = '#ffe082';
        ctx.fillRect(x - 5 * scale, y - height / 2 - 3 * scale, 6 * scale, 6 * scale);
        
        // Door
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(x - 10 * scale, y - 10 * scale, 8 * scale, 10 * scale);
    }
    
    /**
     * Draw small bush in mid-ground
     */
    drawMidGroundBush(ctx, x, y, scale) {
        const width = 20 * scale;
        const height = 12 * scale;
        
        ctx.fillStyle = '#689f38';
        
        // Multiple circles for bushy appearance
        ctx.beginPath();
        ctx.arc(x - width / 4, y - height / 2, height / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + width / 4, y - height / 2, height / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y - height / 1.5, height / 2, 0, Math.PI * 2);
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
        this.cloudOffset = 0;
        this.mountainOffset = 0;
        this.midGroundOffset = 0;
        this.groundOffset = 0;
    }
}
