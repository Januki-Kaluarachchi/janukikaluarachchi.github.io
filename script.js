// 1. Dynamic Typing Effect
const roles = [
    "Full-Stack Web Developer",
    "Android App Developer (Kotlin)",
    "Java & Enterprise Software Builder",
    "Software Engineering Undergraduate"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typingText");

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 1800; // Pause at full word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}
document.addEventListener("DOMContentLoaded", typeEffect);

// 2. Scroll Progress Bar & Scroll Reveal
const scrollProgress = document.getElementById("scrollProgress");
const reveals = document.querySelectorAll(".reveal");

function handleScroll() {
    // Update top progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";

    // Reveal elements on scroll
    const windowHeight = window.innerHeight;
    reveals.forEach((el, index) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", handleScroll);
handleScroll(); // Trigger on load

// 3. Spotlight Mouse Hover Effect on Cards
document.querySelectorAll(".spotlight-card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

// 4. Interactive Constellation Particle Background
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "rgba(34, 211, 238, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 85);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 - distance / 1000})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x && mouse.y) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 - distance / 600})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();