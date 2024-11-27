/* src/entities/brain.js */
import { Sensory } from "./sensory.js";

export class Brain {
    constructor() {
        this.sensory = new Sensory();
    }

    think() {
        const ax = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        const ay = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        return { ax, ay };
    }

    sense(blob, blobs, foods, canvasWidth, canvasHeight) {
        return this.sensory.sense(blob, blobs, foods, canvasWidth, canvasHeight);
    }
}