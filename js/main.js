// ========================
// NAV SCROLL & SCROLL OPTIMIZATIONS
// ========================
const nav = document.getElementById('nav');
let isScrolling = false;
let scrollEndTimeout;
function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    isScrolling = true;
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => { isScrolling = false; }, 120);
}
window.addEventListener('scroll', onScroll, { passive: true });

// ========================
// HAMBURGER MENU
// ========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ========================
// SCROLL REVEAL
// ========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================
// TYPEWRITER
// ========================
const roles = ['Developer', 'Network Engineer', 'IoT Builder', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
    const current = roles[roleIndex];
    if (!deleting) {
        typeEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(type, 1800);
            return;
        }
    } else {
        typeEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(type, deleting ? 60 : 100);
}

type();

// ========================
// DEFER HEAVY OPERATIONS
// ========================

// Move canvas init AFTER all other code
window.addEventListener('load', () => {
    initCanvas();
});

function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots = Array.from({ length: 35 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
    }));

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
            if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 135, 0.5)';
            ctx.fill();
        });
        requestAnimationFrame(drawCanvas);
    }
    drawCanvas();
}

// ========================
// CANVAS BACKGROUND
// ========================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

const isMobile = window.innerWidth < 768;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 3;

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 3;
        dots.forEach(d => {
            d.x = Math.min(d.x, canvas.width);
            d.y = Math.min(d.y, canvas.height);
        });
    }, 150);
});

const dotCount = isMobile ? 25 : 50;
const dots = Array.from({ length: dotCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * (isMobile ? 0.04 : 0.1),
    vy: (Math.random() - 0.5) * (isMobile ? 0.04 : 0.1),
    r: Math.random() * 3 + 2
}));

let rafId;
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 135, 0.8)';
        ctx.fill();
    });

    // Draw connecting lines between nearby dots
    dots.forEach((a, i) => {
        dots.slice(i + 1).forEach(b => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(0, 255, 135, ${0.06 * (1 - dist / 80)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    });

    rafId = requestAnimationFrame(drawCanvas);
}

drawCanvas();

// ========================
// SMOOTH SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});