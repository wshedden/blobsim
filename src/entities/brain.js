/* src/entities/brain.js */
export class Brain {
    think() {
        // Generate random acceleration values for faster movement
        const ax = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        const ay = (Math.random() - 0.5) * 0.1; // Increased from 0.02 to 0.1
        return { ax, ay };
    }

    sense(blob, blobs, canvasWidth, canvasHeight) {
        const rayLength = 300; // Increased length of the ray cast
        const rayAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // Four directions: right, down, left, up
        const results = [];

        for (const angle of rayAngles) {
            const rayX = blob.x + Math.cos(angle) * rayLength;
            const rayY = blob.y + Math.sin(angle) * rayLength;

            // Check for wall collision
            if (rayX < 0 || rayX > canvasWidth || rayY < 0 || rayY > canvasHeight) {
                results.push('wall');
                continue;
            }

            // Check for blob collision
            let collision = 'nothing';
            for (const otherBlob of blobs) {
                if (otherBlob !== blob) {
                    const dx = rayX - otherBlob.x;
                    const dy = rayY - otherBlob.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < otherBlob.size) {
                        collision = 'blob';
                        break;
                    }
                }
            }
            results.push(collision);
        }

        return results;
    }
}