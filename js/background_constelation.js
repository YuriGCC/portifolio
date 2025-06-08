const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const stars = [];
const numStars = 150;
const maxDist = 100;

let posMouse = {x : null, y: null};

for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});


window.addEventListener('mousemove', e => {
    posMouse.x = e.clientX;
    posMouse.y = e.clientY;
});

window.addEventListener('touchmove', e => {
    posMouse.x = e.touches[0].clientX;
    posMouse.y = e.touches[0].clientY;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    for (let i = 0; i < numStars; i++) {
        for (let j = i + 1; j < numStars; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + (1 - dist / maxDist) + ')';
            ctx.stroke();
          }
        }
    }

    if (posMouse.x !== null && posMouse.y !== null) {
        for (let i = 0; i < numStars; i++) {
          const star = stars[i];
          const dx = posMouse.x - star.x;
          const dy = posMouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(posMouse.x, posMouse.y);
            ctx.lineTo(star.x, star.y);
            ctx.strokeStyle = 'rgba(255,255,255,' + (1 - dist / maxDist) + ')';
            ctx.stroke();
          }
        }
    }

    requestAnimationFrame(animate);
}



animate();