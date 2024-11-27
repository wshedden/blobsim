/* src/entities/blob.js */
import { Brain } from "./brain.js";

export class Blob {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0; // Velocity in x direction
        this.vy = 0; // Velocity in y direction
        this.ax = 0; // Acceleration in x direction
        this.ay = 0; // Acceleration in y direction
        this.health = 100; // Health of the blob
        this.foodReserves = 50; // Food reserves of the blob
        this.size = this.calculateSize(); // Size of the blob based on food reserves
        this.brain = new Brain(); // Brain for handling movement logic
        this.maxSpeed = 2; // Maximum speed of the blob
    }

    calculateSize() {
        return this.radius + this.foodReserves * 0.5; // Adjust size calculation
    }

    update(deltaTime) {
        // Update velocity and acceleration using the brain
        const { ax, ay } = this.brain.think();
        this.ax = ax;
        this.ay = ay;

        // Update velocity with acceleration
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;

        // Cap the maximum speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        // Update position with velocity
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Update size based on food reserves
        this.size = this.calculateSize();

        // Calculate energy expenditure based on size and velocity
        const energyExpenditure = (Math.abs(this.vx) + Math.abs(this.vy)) * (this.size * 0.005);
        this.foodReserves -= energyExpenditure * deltaTime;

        // Ensure food reserves do not go below zero
        if (this.foodReserves < 0) {
            this.foodReserves = 0;
        }

        // Remove speedFactor adjustment
        // const speedFactor = 1 + (50 - this.foodReserves) * 0.02;
        // this.vx *= speedFactor;
        // this.vy *= speedFactor;
    }
}