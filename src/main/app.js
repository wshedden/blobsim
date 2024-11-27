/* src/main/app.js */
import { Renderer } from "./renderer.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("blobCanvas");
    const context = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 800;
    const renderer = new Renderer(context);
    renderer.drawBlob();
});