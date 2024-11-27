/* src/entities/brain.js */
export class Brain {
    think() {
        // Generate random acceleration values for faster movement
        const ax = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        const ay = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        return { ax, ay };
    }
}