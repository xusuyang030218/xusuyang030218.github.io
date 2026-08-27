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
