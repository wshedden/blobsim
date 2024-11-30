/* src/main/renderer.js */
export class Renderer {
    constructor(context) {
        this.context = context;
    }

    drawBlob(blob) {
        // Draw the blob body with a more blobby shape
        this.context.fillStyle = blob.dead ? "#808080" : blob.color; // Grey if dead, random color otherwise
        this.context.beginPath();
        this.context.moveTo(blob.x + blob.size, blob.y);

        for (let i = 0; i < Math.PI * 2; i += Math.PI / 5) {
            const offsetX = Math.cos(i) * (blob.size + Math.random() * 5);
            const offsetY = Math.sin(i) * (blob.size + Math.random() * 5);
            this.context.lineTo(blob.x + offsetX, blob.y + offsetY);
        }

        this.context.closePath();
        this.context.fill();

        // Draw the eyes
        this.drawEyes(blob);

        // Draw the smile
        this.drawSmile(blob);

        // Draw the smell radius
        this.drawSmellRadius(blob);

        // Draw the sensory organs
        this.drawSensoryOrgans(blob);
    }

    drawHighlight(blob) {
        this.context.strokeStyle = "yellow"; // Yellow color for the highlight
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.arc(blob.x, blob.y, blob.size + 5, 0, Math.PI * 2);
        this.context.stroke();
    }

    drawSensoryOrgans(blob) {
        const rayLength = 300; // Length of each ray
        const baseAngle = Math.atan2(blob.vy, blob.vx);
        const angles = [baseAngle - Math.PI / 4, baseAngle + Math.PI / 4]; // Two rays at 45 degrees to the left and right of the velocity vector

        this.context.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Green with transparency

        for (const angle of angles) {
            const rayX = blob.x + Math.cos(angle) * rayLength;
            const rayY = blob.y + Math.sin(angle) * rayLength;

            this.context.beginPath();
            this.context.moveTo(blob.x, blob.y);
            this.context.lineTo(rayX, rayY);
            this.context.stroke();
        }
    }

    drawEyes(blob) {
        const eyeOffsetX = blob.size * 0.3;
        const eyeOffsetY = blob.size * 0.3;
        const eyeRadius = blob.size * 0.1;

        // Left eye
        this.context.fillStyle = "#ffffff"; // White for the eyes
        this.context.beginPath();
        this.context.arc(blob.x - eyeOffsetX, blob.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.context.fill();

        // Right eye
        this.context.beginPath();
        this.context.arc(blob.x + eyeOffsetX, blob.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.context.fill();

        // Pupils
        const pupilRadius = eyeRadius * 0.5;
        this.context.fillStyle = "#000000"; // Black for the pupils
        this.context.beginPath();
        this.context.arc(blob.x - eyeOffsetX, blob.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        this.context.fill();
        this.context.beginPath();
        this.context.arc(blob.x + eyeOffsetX, blob.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        this.context.fill();
    }

    drawSmile(blob) {
        const smileRadius = blob.size * 0.5;
        const smileStartAngle = 0.2 * Math.PI;
        const smileEndAngle = 0.8 * Math.PI;

        this.context.strokeStyle = "#000000"; // Black for the smile
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(blob.x, blob.y, smileRadius, smileStartAngle, smileEndAngle);
        this.context.stroke();
    }

    drawSmellRadius(blob) {
        this.context.strokeStyle = "rgba(255, 255, 0, 0.5)"; // Yellow with transparency
        this.context.beginPath();
        this.context.arc(blob.x, blob.y, blob.smellRadius, 0, Math.PI * 2);
        this.context.stroke();
    }

    drawFood(food) {
        this.context.fillStyle = "#00ff00"; // Green for food
        this.context.beginPath();
        this.context.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        this.context.fill();
    }

    drawFoodValue(food, mouseX, mouseY) {
        const dx = food.x - mouseX;
        const dy = food.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < food.size) {
            this.context.fillStyle = "#ffffff"; // White for text
            this.context.font = "12px Arial";
            this.context.fillText(`Food Value: ${food.size}`, food.x + 10, food.y - 10);
        }
    }
}
