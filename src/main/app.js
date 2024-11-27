/* src/main/app.js */
import { Renderer } from "./renderer.js";
import { Blob } from "../entities/blob.js";
import { CollisionHandler } from "../entities/collisionHandler.js";
import { Food } from "../entities/food.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("blobCanvas");
    const context = canvas.getContext("2d");
    const infoPanel = document.getElementById("infoPanel");
    const mostFoodBlobPanel = document.getElementById("mostFoodBlob"); // New element for the blob with the most food
    canvas.width = 1200;
    canvas.height = 800;

    const renderer = new Renderer(context);
    const collisionHandler = new CollisionHandler();

    // Create multiple blobs
    const blobs = [];
    for (let i = 0; i < 20; i++) { // Increase the number of blobs
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 20;
        const blob = new Blob(x, y, radius);
        blob.vx = (Math.random() - 0.5) * 0.4; // Increase speed
        blob.vy = (Math.random() - 0.5) * 0.4; // Increase speed
        blob.ax = (Math.random() - 0.5) * 0.04; // Increase acceleration
        blob.ay = (Math.random() - 0.5) * 0.04; // Increase acceleration
        blobs.push(blob);
    }

    // Create an array to hold food items
    const foods = [];

    // Function to add a random food item
    function addRandomFood() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const food = new Food(x, y);
        foods.push(food);
    }

    // Add initial food items
    for (let i = 0; i < 50; i++) { // Increase the number of initial food items
        addRandomFood();
    }

    // Add food items periodically
    setInterval(addRandomFood, 5000); // Add a food item every 5 seconds

    let selectedBlob = null;
    let infoUpdateInterval = null;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        blobs.forEach(blob => {
            blob.update(1, blobs, foods, canvas.width, canvas.height);
        });
        collisionHandler.handleCollisions(blobs);
        blobs.forEach(blob => {
            renderer.drawBlob(blob);
        });
        foods.forEach(food => {
            renderer.drawFood(food);
        });

        // Update the blob with the most food stored
        updateMostFoodBlob(blobs);

        requestAnimationFrame(animate);
    }

    function showBlobInfo(blob) {
        const senseResult = blob.senseResult.map(result => `${result.type} at (${result.x.toFixed(2)}, ${result.y.toFixed(2)})`).join(', ');
        infoPanel.innerHTML = `
            <strong>Blob Info</strong><br>
            X: ${blob.x.toFixed(2)}<br>
            Y: ${blob.y.toFixed(2)}<br>
            Radius: ${blob.radius}<br>
            Size: ${blob.size.toFixed(2)}<br>
            VX: ${blob.vx.toFixed(2)}<br>
            VY: ${blob.vy.toFixed(2)}<br>
            AX: ${blob.ax.toFixed(2)}<br>
            AY: ${blob.ay.toFixed(2)}<br>
            Health: ${blob.health.toFixed(2)}<br>
            Food Reserves: ${blob.foodReserves.toFixed(2)}<br>
            Dead: ${blob.dead}<br>
            Sense Result: ${senseResult}
        `;
    }

    function updateMostFoodBlob(blobs) {
        const mostFoodBlob = blobs.reduce((maxBlob, blob) => (blob.foodReserves > maxBlob.foodReserves ? blob : maxBlob), blobs[0]);
        mostFoodBlobPanel.innerHTML = `
            <strong>Blob with Most Food</strong><br>
            X: ${mostFoodBlob.x.toFixed(2)}<br>
            Y: ${mostFoodBlob.y.toFixed(2)}<br>
            Radius: ${mostFoodBlob.radius}<br>
            Size: ${mostFoodBlob.size.toFixed(2)}<br>
            Food Reserves: ${mostFoodBlob.foodReserves.toFixed(2)}<br>
        `;
    }

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        blobs.forEach(blob => {
            const distance = Math.sqrt((mouseX - blob.x) ** 2 + (mouseY - blob.y) ** 2);
            if (distance <= blob.size) {
                selectedBlob = blob;
                showBlobInfo(blob);

                // Clear any existing interval
                if (infoUpdateInterval) {
                    clearInterval(infoUpdateInterval);
                }

                // Set interval to update info panel every 200 milliseconds
                infoUpdateInterval = setInterval(() => {
                    if (selectedBlob) {
                        showBlobInfo(selectedBlob);
                    }
                }, 200);
            }
        });

        if (!selectedBlob) {
            if (infoUpdateInterval) {
                clearInterval(infoUpdateInterval);
                infoUpdateInterval = null;
            }
            infoPanel.innerHTML = ''; // Clear the info panel
        }
    });

    animate();
});