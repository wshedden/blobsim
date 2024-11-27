/* src/main/app.js */
import { Renderer } from "./renderer.js";
import { Blob } from "../entities/blob.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("blobCanvas");
    const context = canvas.getContext("2d");
    const infoPanel = document.getElementById("infoPanel");
    canvas.width = 1200;
    canvas.height = 800;

    const renderer = new Renderer(context);
    const blob = new Blob(400, 300, 50);

    // Set initial velocity and acceleration
    blob.vx = 0.1;
    blob.vy = 0.1;
    blob.ax = 0.01;
    blob.ay = 0.01;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        blob.update(1); // Update blob with a fixed deltaTime
        renderer.drawBlob(blob);
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
            Health: ${blob.health}<br>
            Food Reserves: ${blob.foodReserves.toFixed(2)}
        `;
    }

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const distance = Math.sqrt((mouseX - blob.x) ** 2 + (mouseY - blob.y) ** 2);
        if (distance <= blob.size) {
            showBlobInfo(blob);
        }
    });

    animate();
});