/* src/entities/blob.js */
export class Blob {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0; // Velocity in x direction
        this.vy = 0; // Velocity in y direction
        this.ax = 0; // Acceleration in x direction
        this.ay = 0; // Acceleration in y direction
    }

    update(deltaTime) {
        // Update velocity with acceleration
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;

        // Update position with velocity
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
}