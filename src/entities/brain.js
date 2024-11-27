/* src/entities/brain.js */
import { Sensory } from "./sensory.js";

export class Brain {
    constructor() {
        this.sensory = new Sensory();
    }

    think(blob, blobs, foods, canvasWidth, canvasHeight) {
        const senseResult = this.sensory.sense(blob, blobs, foods, canvasWidth, canvasHeight);
        let ax = (Math.random() - 0.5) * 0.1; // Default random acceleration
        let ay = (Math.random() - 0.5) * 0.1; // Default random acceleration

        // If food is sensed, adjust acceleration towards the food
        if (senseResult.some(result => result.type === 'food')) {
            const food = foods.find(f => {
                const dx = f.x - blob.x;
                const dy = f.y - blob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 300; // Within sensing range
            });

            if (food) {
                const dx = food.x - blob.x;
                const dy = food.y - blob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                ax = (dx / distance) * 0.1; // Adjust acceleration towards food
                ay = (dy / distance) * 0.1; // Adjust acceleration towards food
            }
        }

        return { ax, ay };
    }

    sense(blob, blobs, foods, canvasWidth, canvasHeight) {
        return this.sensory.sense(blob, blobs, foods, canvasWidth, canvasHeight);
    }
}