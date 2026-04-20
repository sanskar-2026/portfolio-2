/* ============================================================
   SANSKAR — BIOTECH PORTFOLIO SCRIPT
   ============================================================ */

// ── TYPING ANIMATION ──
const phrases = [
  "Gene Manipulation Enthusiast",
  "Genomic Sequence Explorer",
  "Tissue Culture Researcher",
  "Team Leader & Innovator",
  "Future Biotechnologist",
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById("typingText");

function type() {
  const current = phrases[phraseIdx];
  typingEl.textContent = deleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);

  if (!deleting && charIdx === current.length + 1) {
    setTimeout(() => (deleting = true), 1800);
  } else if (deleting && charIdx === 0) {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ── DNA HELIX RUNGS ──
(function buildHelixRungs() {
  const container = document.getElementById("helixRungs");
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const rung = document.createElement("div");
    const progress = i / (count - 1); // 0..1
    const angle = progress * Math.PI * 3.5;
    const yPct = progress * 100;
    const xOff = Math.sin(angle) * 28;
    const opacity = 0.3 + Math.abs(Math.sin(angle)) * 0.5;
    const colors = ["var(--accent-cyan)", "var(--accent-green)", "var(--accent-blue)"];
    const color = colors[i % colors.length];
    rung.style.cssText = `
      position:absolute;
      width:${50 + Math.abs(Math.sin(angle)) * 10}px;
      height:2px;
      top:${yPct}%;
      left:50%;
      transform:translateX(calc(-50% + ${xOff}px));
      background:${color};
      opacity:${opacity};
      border-radius:2px;
      box-shadow:0 0 6px ${color};
    `;
    container.appendChild(rung);
  }
})();

// ── CANVAS PARTICLE FIELD ──
(function initCanvas() {
  const canvas = document.getElementById("dnaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COLORS = ["#00f5d4", "#39ff14", "#0ea5e9", "#bf5af2"];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2 + 0.5;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      if (this.y < -10 || this.life <= 0) this.reset(false);
    }
    draw() {
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.strokeStyle = "#00f5d4";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── SKILL BARS ──
function buildSkillBars() {
  document.querySelectorAll(".skill-bar").forEach(bar => {
    const level = bar.dataset.level;
    const name  = bar.dataset.name;

    // Percentage label
    const pct = document.createElement("div");
    pct.className = "skill-bar-pct";
    pct.textContent = level + "%";
    bar.appendChild(pct);

    // Fill element
    const fill = document.createElement("div");
    fill.className = "skill-bar-fill";
    fill.style.width = "0%";
    bar.appendChild(fill);

    // Animate on intersection
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fill.style.width = level + "%";
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(bar);
  });
}
buildSkillBars();

// ── SCROLL REVEAL ──
(function initReveal() {
  const els = document.querySelectorAll(
    ".about-card, .skill-category, .project-card, .contact-item, .tools-row, .hero-stats"
  );
  els.forEach(el => el.classList.add("reveal"));
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ── CONTACT FORM ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const original = btn.innerHTML;
  btn.innerHTML = `<span>Message Sent! 🧬</span>`;
  btn.style.background = "var(--accent-green)";
  btn.style.color = "var(--bg-base)";
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = "";
    btn.style.color = "";
    e.target.reset();
  }, 3000);
}

// ── ACTIVE NAV LINK ──
(function activeNav() {
  const sections = document.querySelectorAll("section[id]");
  const links    = document.querySelectorAll(".nav-item");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    links.forEach(link => {
      link.style.color = link.getAttribute("href") === "#" + current
        ? "var(--accent-cyan)"
        : "";
    });
  });
})();

// ── CURSOR GLOW (Desktop) ──
if (window.innerWidth > 768) {
  const glow = document.createElement("div");
  glow.style.cssText = `
    position:fixed;width:350px;height:350px;border-radius:50%;
    pointer-events:none;z-index:0;
    background:radial-gradient(circle, rgba(0,245,212,0.04), transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.25s ease, top 0.25s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  });
}