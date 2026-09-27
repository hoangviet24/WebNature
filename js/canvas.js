/* --- Ambient Canvas Animation --- */
const canvas = id => document.getElementById(id);
const cvs = canvas('ambientCanvas');
const ctx = cvs.getContext('2d');

function resizeCanvas() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    size: Math.random() * 2 + 0.5,
    speedY: -Math.random() * 0.4 - 0.1,
    speedX: Math.random() * 0.3 - 0.15,
    opacity: Math.random() * 0.6 + 0.2
}));

function animateParticles() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Draw subtle sun ray gradient top-left
    const rayGradient = ctx.createRadialGradient(cvs.width * 0.3, 0, 10, cvs.width * 0.3, 0, cvs.width * 0.8);
    rayGradient.addColorStop(0, 'rgba(230, 200, 117, 0.15)');
    rayGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rayGradient;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Draw glowing floating dust particles
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = cvs.height;
        if (p.x < 0) p.x = cvs.width;
        if (p.x > cvs.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 200, 117, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(230, 200, 117, 0.8)';
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();