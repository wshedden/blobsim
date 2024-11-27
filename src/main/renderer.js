/* src/main/renderer.js */
export class Renderer {
    constructor(context) {
        this.context = context;
    }

    drawBlob(blob) {
        // Draw the blob
        this.context.fillStyle = blob.dead ? "#808080" : "#ff0000"; // Grey if dead, red otherwise
        this.context.beginPath();
        this.context.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
        this.context.fill();

        // Draw the direction arrow if the blob is not dead
        if (!blob.dead) {
            const arrowLength = 50;
            const arrowX = blob.x + blob.vx * arrowLength;
            const arrowY = blob.y + blob.vy * arrowLength;
            this.context.strokeStyle = "#00ff00";
            this.context.beginPath();
            this.context.moveTo(blob.x, blob.y);
            this.context.lineTo(arrowX, arrowY);
            this.context.stroke();
        }

        // Draw the sensing ray
        if (!blob.dead) {
            const rayLength = 300; // Increased length of the ray cast
            const angle = Math.atan2(blob.vy, blob.vx);
            const rayX = blob.x + Math.cos(angle) * rayLength;
            const rayY = blob.y + Math.sin(angle) * rayLength;
            this.context.strokeStyle = "#ffff00"; // Yellow for the sensing ray
            this.context.beginPath();
            this.context.moveTo(blob.x, blob.y);
            this.context.lineTo(rayX, rayY);
            this.context.stroke();
        }
    }

    drawFood(food) {
        this.context.fillStyle = "#00ff00"; // Green for food
        this.context.beginPath();
        this.context.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        this.context.fill();
    }
}
