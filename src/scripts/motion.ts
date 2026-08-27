import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Scroll progress bar ---- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress') as HTMLElement | null;
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
    },
  });
}

/* ---- Hero entrance timeline ---- */
function initHeroEntrance() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const items = hero.querySelectorAll('[data-hero-item]');
  if (!items.length) return;

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(items, { opacity: 0, y: 30 });
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.2,
  });
}

/* ---- Section reveals via ScrollTrigger ---- */
function initReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReducedMotion) {
    reveals.forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  reveals.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ---- Staggered card grids ---- */
function initStaggerGrids() {
  const grids = document.querySelectorAll('[data-stagger]');
  if (!grids.length) return;

  if (prefersReducedMotion) return;

  grids.forEach((grid) => {
    const items = grid.children;
    gsap.fromTo(
      items,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ---- Skill bars ---- */
function initSkillBars() {
  const bars = document.querySelectorAll('[data-skill]');
  if (!bars.length) return;

  if (prefersReducedMotion) {
    bars.forEach((bar) => {
      (bar as HTMLElement).style.width = (bar as HTMLElement).dataset.skill + '%';
    });
    return;
  }

  bars.forEach((bar) => {
    const target = (bar as HTMLElement).dataset.skill + '%';
    gsap.fromTo(
      bar,
      { width: '0%' },
      {
        width: target,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ---- Marquee speed control ---- */
function initMarquee() {
  const track = document.querySelector('.marquee-track') as HTMLElement | null;
  if (!track) return;

  const marquee = track.closest('.marquee') as HTMLElement | null;
  if (!marquee) return;
  marquee.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  marquee.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ---- Magnetic buttons ---- */
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const magnets = document.querySelectorAll('.button, .sig-links a, .plate-links a');
  magnets.forEach((magnet) => {
    const el = magnet as HTMLElement;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* ---- Hero particle constellation ---- */
function initParticles() {
  const canvasEl = document.querySelector('[data-particles]') as HTMLCanvasElement | null;
  if (!canvasEl) return;

  const ctx2d = canvasEl.getContext('2d');
  if (!ctx2d) return;

  const canvas: HTMLCanvasElement = canvasEl;
  const ctx: CanvasRenderingContext2D = ctx2d;

  // 只在高分辨率且支持指针时启用；小屏或触摸优先设备保持轻量
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
  let raf = 0;
  let width = 0;
  let height = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let running = false;

  const palette = ['#1B5E3F', '#FCD34D', '#1B5E3F', '#FCD34D', '#1B5E3F'];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(90, Math.max(28, Math.round((width * height) / 24000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.5,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      // 让星星被指针轻轻牵动
      if (pointerX > -9999) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 && dist > 0.001) {
          const pull = (160 - dist) / 160;
          p.x += (dx / dist) * pull * 1.6;
          p.y += (dy / dist) * pull * 1.6;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }

    // 连线：距离近的星星之间用细线连成星座
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 110 * 110) {
          const alpha = 1 - Math.sqrt(distSq) / 110;
          ctx.strokeStyle = `rgba(27, 94, 63, ${(alpha * 0.22).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = palette[(Math.abs(Math.round(p.x + p.y)) % palette.length)];
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    if (reduced) {
      // 减少动效：只画一帧静态星座，不进入循环
      step();
      cancelAnimationFrame(raf);
      running = false;
      return;
    }
    raf = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    pointerX = -9999;
    pointerY = -9999;
  });

  // 用 IntersectionObserver 只在可见时运行，离开视口即暂停
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  window.addEventListener('resize', () => {
    if (running) resize();
  });
}

/* ---- Availability badge pulse ---- */
function initBadgePulse() {
  const badge = document.querySelector('[data-badge]');
  if (!badge) return;
  if (prefersReducedMotion) return;

  const dot = badge.querySelector('.badge-dot');
  if (!dot) return;
  gsap.to(dot, {
    scale: 1.4,
    opacity: 0.6,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/* ---- Initialize all ---- */
function init() {
  initScrollProgress();
  initHeroEntrance();
  initReveals();
  initStaggerGrids();
  initSkillBars();
  initMarquee();
  initMagneticButtons();
  initBadgePulse();
  initParticles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Refresh ScrollTrigger after fonts load
if (document.fonts) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
