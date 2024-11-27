/* src/main/renderer.js */
export class Renderer {
    constructor(context) {
        this.context = context;
    }

    drawBlob(blob) {
        // Draw the blob
        this.context.fillStyle = blob.dead ? "#000000" : "#ff0000"; // Black if dead, red otherwise
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
    }
}
