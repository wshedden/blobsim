/* src/entities/sensory.js */
export class Sensory {
    sense(blob, blobs, foods, canvasWidth, canvasHeight) {
        const rayLength = 300; // Length of the ray cast
        const stepSize = 5; // Step size for iterating along the ray
        const results = [];

        // Calculate the angles of the rays based on the blob's velocity
        const baseAngle = Math.atan2(blob.vy, blob.vx);
        const angles = [baseAngle - Math.PI / 4, baseAngle + Math.PI / 4]; // Two rays at 45 degrees to the left and right of the velocity vector

        for (const angle of angles) {
            let rayX = blob.x;
            let rayY = blob.y;

            for (let i = 0; i < rayLength; i += stepSize) {
                rayX += Math.cos(angle) * stepSize;
                rayY += Math.sin(angle) * stepSize;

                // Check for wall collision
                if (rayX < 0 || rayX > canvasWidth || rayY < 0 || rayY > canvasHeight) {
                    results.push({ type: 'wall', x: rayX, y: rayY });
                    break;
                }

                // Check for blob collision
                let collision = { type: 'nothing', x: rayX, y: rayY };
                for (const otherBlob of blobs) {
                    if (otherBlob !== blob) {
                        const dx = rayX - otherBlob.x;
                        const dy = rayY - otherBlob.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < otherBlob.size) {
                            collision = { type: 'blob', x: rayX, y: rayY };
                            break;
                        }
                    }
                }

                if (collision.type === 'blob') {
                    results.push(collision);
                    break;
                }

                // Check for food collision
                for (const food of foods) {
                    const dx = rayX - food.x;
                    const dy = rayY - food.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < food.size) {
                        collision = { type: 'food', x: rayX, y: rayY };
                        break;
                    }
                }

                if (collision.type === 'food') {
                    results.push(collision);
                    break;
                }
            }

            if (results.length === 0) {
                results.push({ type: 'nothing', x: rayX, y: rayY });
            }
        }

        return results;
    }
}