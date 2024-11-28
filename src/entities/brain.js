/* src/entities/brain.js */
import { Sensory } from "./sensory.js";
import { Personalities } from "./personalities.js";

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

        switch (blob.personality) {
            case Personalities.CURIOUS:
                ax *= 1.5;
                ay *= 1.5;
                break;
            case Personalities.LAZY:
                ax *= 0.5;
                ay *= 0.5;
                break;
            case Personalities.GREEDY:
                if (senseResult.some(result => result.type === 'food')) {
                    ax *= 2;
                    ay *= 2;
                }
                break;
            case Personalities.SCARED:
                if (senseResult.some(result => result.type === 'blob')) {
                    ax *= -1;
                    ay *= -1;
                }
                break;
            case Personalities.SOCIAL:
                if (senseResult.some(result => result.type === 'blob')) {
                    ax *= 1.2;
                    ay *= 1.2;
                }
                break;
            // Add more personality-based behaviors as needed
        }

        return { ax, ay };
    }

    sense(blob, blobs, foods, canvasWidth, canvasHeight) {
        return this.sensory.sense(blob, blobs, foods, canvasWidth, canvasHeight);
    }
}