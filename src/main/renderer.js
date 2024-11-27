
/* src/main/renderer.js */
export class Renderer {
    constructor(context) {
        this.context = context;
    }

    drawBlob() {
        this.context.fillStyle = "#ff0000";
        this.context.beginPath();
        this.context.arc(400, 300, 50, 0, Math.PI * 2);
        this.context.fill();
    }
}
