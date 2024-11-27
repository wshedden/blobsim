/* src/main/app.js */
import { Renderer } from "./renderer.js";
import { Blob } from "../entities/blob.js";
import { CollisionHandler } from "../entities/collisionHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("blobCanvas");
    const context = canvas.getContext("2d");
    const infoPanel = document.getElementById("infoPanel");
    canvas.width = 1200;
    canvas.height = 800;

    const renderer = new Renderer(context);
    const collisionHandler = new CollisionHandler();

    // Create multiple blobs
    const blobs = [
        new Blob(400, 300, 20),
        new Blob(600, 400, 20),
        new Blob(800, 500, 20)
    ];

    // Set initial velocity and acceleration for each blob
    blobs.forEach(blob => {
        blob.vx = (Math.random() - 0.5) * 0.2;
        blob.vy = (Math.random() - 0.5) * 0.2;
        blob.ax = (Math.random() - 0.5) * 0.02;
        blob.ay = (Math.random() - 0.5) * 0.02;
    });

    let selectedBlob = null;
    let infoUpdateInterval = null;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        blobs.forEach(blob => {
            blob.update(1, canvas.width, canvas.height);
        });
        collisionHandler.handleCollisions(blobs);
        blobs.forEach(blob => {
            renderer.drawBlob(blob);
        });
        requestAnimationFrame(animate);
    }

    function showBlobInfo(blob) {
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
            Dead: ${blob.dead}
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