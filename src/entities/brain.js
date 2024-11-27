/* src/entities/brain.js */
export class Brain {
    think() {
        // Generate random acceleration values for faster movement
        const ax = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        const ay = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        return { ax, ay };
    }

    sense(blob, blobs, canvasWidth, canvasHeight) {
        const rayLength = 100; // Length of the ray cast
        const rayAngle = Math.atan2(blob.vy, blob.vx); // Angle of the ray cast based on velocity
        const rayX = blob.x + Math.cos(rayAngle) * rayLength;
        const rayY = blob.y + Math.sin(rayAngle) * rayLength;

        // Check for wall collision
        if (rayX < 0 || rayX > canvasWidth || rayY < 0 || rayY > canvasHeight) {
            return 'wall';
        }

        // Check for blob collision
        for (const otherBlob of blobs) {
            if (otherBlob !== blob) {
                const dx = rayX - otherBlob.x;
                const dy = rayY - otherBlob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < otherBlob.size) {
                    return 'blob';
                }
            }
        }

        return 'nothing';
    }
}