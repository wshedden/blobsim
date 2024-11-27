/* src/entities/collisionHandler.js */
export class CollisionHandler {
    handleCollisions(blobs) {
        for (let i = 0; i < blobs.length; i++) {
            for (let j = i + 1; j < blobs.length; j++) {
                const blob1 = blobs[i];
                const blob2 = blobs[j];
                const dx = blob1.x - blob2.x;
                const dy = blob1.y - blob2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = blob1.size + blob2.size;

                if (distance < minDistance) {
                    // Simple collision response: separate the blobs
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;
                    const separationX = Math.cos(angle) * overlap / 2;
                    const separationY = Math.sin(angle) * overlap / 2;

                    blob1.x += separationX;
                    blob1.y += separationY;
                    blob2.x -= separationX;
                    blob2.y -= separationY;

                    // Optionally, adjust velocities for a more realistic collision response
                    const tempVx = blob1.vx;
                    const tempVy = blob1.vy;
                    blob1.vx = blob2.vx;
                    blob1.vy = blob2.vy;
                    blob2.vx = tempVx;
                    blob2.vy = tempVy;
                }
            }
        }
    }
}