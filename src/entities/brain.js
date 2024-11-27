/* src/entities/brain.js */
export class Brain {
    think() {
        // Generate random acceleration values for more complex movement
        const ax = (Math.random() - 0.5) * 0.02;
        const ay = (Math.random() - 0.5) * 0.02;
        return { ax, ay };
    }
}