/* src/entities/blob.js */
import { Brain } from "./brain.js";
import { Personalities } from "./personalities.js";
import { Food } from "./food.js";
import {
    BLOB_DEFAULT_HEALTH,
    BLOB_DEFAULT_FOOD_RESERVES,
    BLOB_BASE_MAX_SPEED,
    BLOB_ENERGY_EXPENDITURE_RATE,
    BLOB_HEALTH_DECREASE_RATE,
    BLOB_MIN_FOOD_RESERVES
} from "../config/constants.js";

export class Blob {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0; // Velocity in x direction
        this.vy = 0; // Velocity in y direction
        this.ax = 0; // Acceleration in x direction
        this.ay = 0; // Acceleration in y direction
        this.health = BLOB_DEFAULT_HEALTH; // Health of the blob
        this.foodReserves = BLOB_DEFAULT_FOOD_RESERVES; // Food reserves of the blob
        this.size = this.calculateSize(); // Size of the blob based on food reserves
        this.brain = new Brain(); // Brain for handling movement logic
        this.baseMaxSpeed = BLOB_BASE_MAX_SPEED; // Base maximum speed of the blob
        this.dead = false; // Dead state of the blob
        this.senseResult = [{ type: 'nothing', x: this.x, y: this.y }]; // Result of the sensing
        this.color = this.getRandomColor(); // Random color for the blob
        this.personality = this.getRandomPersonality(); // Random personality for the blob
    }

    calculateSize() {
        return this.radius + this.foodReserves * 0.05; // Adjust size calculation
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getRandomPersonality() {
        const personalities = Object.values(Personalities);
        return personalities[Math.floor(Math.random() * personalities.length)];
    }

    update(deltaTime, blobs, foods, canvasWidth, canvasHeight) {
        if (this.dead) {
            return; // Do not update if the blob is dead
        }

        this.updateSize();
        this.updateMovement(deltaTime, blobs, foods, canvasWidth, canvasHeight);
        this.checkCollisions(canvasWidth, canvasHeight);
        this.manageEnergy(deltaTime);
        this.consumeFood(foods);
        this.interactWithBlobs(blobs);

        // Check if the blob is dead and convert it to food
        if (this.health === 0 && !this.dead) {
            this.dead = true;
            const food = new Food(this.x, this.y, this.size);
            foods.push(food);
        }
    }

    updateSize() {
        this.size = this.calculateSize();
    }

    updateMovement(deltaTime, blobs, foods, canvasWidth, canvasHeight) {
        const { ax, ay } = this.brain.think(this, blobs, foods, canvasWidth, canvasHeight);
        this.ax = ax;
        this.ay = ay;

        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        // Sense the environment
        this.senseResult = this.brain.sense(this, blobs, foods, canvasWidth, canvasHeight);
    }

    checkCollisions(canvasWidth, canvasHeight) {
        if (this.x - this.size < 0) {
            this.x = this.size;
            this.vx = 0;
        }
        if (this.x + this.size > canvasWidth) {
            this.x = canvasWidth - this.size;
            this.vx = 0;
        }
        if (this.y - this.size < 0) {
            this.y = this.size;
            this.vy = 0;
        }
        if (this.y + this.size > canvasHeight) {
            this.y = canvasHeight - this.size;
            this.vy = 0;
        }
    }

    manageEnergy(deltaTime) {
        const energyExpenditure = (Math.abs(this.vx) + Math.abs(this.vy)) * (this.size * BLOB_ENERGY_EXPENDITURE_RATE);
        this.foodReserves -= energyExpenditure * deltaTime;

        if (this.foodReserves < 0) {
            this.foodReserves = 0;
        }

        if (this.foodReserves < BLOB_MIN_FOOD_RESERVES) {
            this.health -= deltaTime * BLOB_HEALTH_DECREASE_RATE;
            if (this.health < 0) {
                this.health = 0;
            }
        }

        if (this.health === 0) {
            this.dead = true;
            this.vx = 0;
            this.vy = 0;
        }
    }

    consumeFood(foods) {
        foods.forEach((food, index) => {
            const dx = food.x - this.x;
            const dy = food.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + food.size) {
                this.foodReserves += food.size * 10; // Add food size to food reserves
                foods.splice(index, 1); // Remove the food from the array
            }
        });
    }

    interactWithBlobs(blobs) {
        blobs.forEach(otherBlob => {
            if (otherBlob !== this && !otherBlob.dead) {
                const dx = otherBlob.x - this.x;
                const dy = otherBlob.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.size + otherBlob.size) {
                    if (this.personality === Personalities.FRIENDLY && otherBlob.personality === Personalities.FRIENDLY) {
                        // Friendly interaction: form a group
                        this.formGroup(otherBlob);
                    } else if (this.personality === Personalities.AGGRESSIVE || otherBlob.personality === Personalities.AGGRESSIVE) {
                        // Aggressive interaction: fight
                        this.fight(otherBlob);
                    }
                }
            }
        });
    }

    formGroup(otherBlob) {
        // Logic for forming a group
        // For example, adjust velocities to move together
        const centerX = (this.x + otherBlob.x) / 2;
        const centerY = (this.y + otherBlob.y) / 2;
        this.vx = (centerX - this.x) * 0.1;
        this.vy = (centerY - this.y) * 0.1;
        otherBlob.vx = (centerX - otherBlob.x) * 0.1;
        otherBlob.vy = (centerY - otherBlob.y) * 0.1;
    }

    fight(otherBlob) {
        // Logic for fighting
        // For example, reduce health of both blobs
        this.health -= 1;
        otherBlob.health -= 1;
        if (this.health <= 0) {
            this.dead = true;
        }
        if (otherBlob.health <= 0) {
            otherBlob.dead = true;
        }
    }
}