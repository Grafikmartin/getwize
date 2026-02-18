/**
 * Getwize – Hamburger menu and UI events (vanilla TypeScript)
 */

const hamburger = document.getElementById('hamburger') as HTMLButtonElement | null;
const nav = document.getElementById('nav-menu');
const header = document.querySelector('.header');

function toggleMenu(): void {
  if (!header) return;
  const isOpen = header.classList.toggle('is-open');
  hamburger?.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu(): void {
  header?.classList.remove('is-open');
  hamburger?.setAttribute('aria-expanded', 'false');
}

const HERO_CIRCLES = 120;
const COLOR_COUNTS: Record<string, number> = { primary: 48, secondary: 42, neutral: 24, accent: 6 };

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function initHeroBanner(): void {
  const banner = document.querySelector('.hero-banner');
  if (!banner) return;
  const colorQueue: string[] = [];
  Object.keys(COLOR_COUNTS).forEach((kind) => {
    for (let i = 0; i < COLOR_COUNTS[kind]; i++) colorQueue.push(kind);
  });
  for (let i = colorQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colorQueue[i], colorQueue[j]] = [colorQueue[j], colorQueue[i]];
  }
  interface Circle { el: HTMLElement; size: number; x: number; y: number; vx: number; vy: number }
  const circles: Circle[] = [];
  for (let i = 0; i < HERO_CIRCLES; i++) {
    const size = Math.round(randomBetween(14, 72));
    const el = document.createElement('div');
    el.className = 'hero-banner__circle hero-banner__circle--' + colorQueue[i];
    el.setAttribute('aria-hidden', 'true');
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    banner.appendChild(el);
    circles.push({
      el, size, x: 0, y: 0,
      vx: randomBetween(0.15, 0.55) * (Math.random() < 0.5 ? 1 : -1),
      vy: randomBetween(0.15, 0.55) * (Math.random() < 0.5 ? 1 : -1),
    });
  }
  function placeAndStart(w: number, h: number): void {
    circles.forEach((c) => {
      c.x = randomBetween(0, Math.max(0, w - c.size));
      c.y = randomBetween(0, Math.max(0, h - c.size));
    });
  }
  let started = false;
  function tick(): void {
    const w = banner.offsetWidth;
    const h = banner.offsetHeight;
    if (!started && w > 0 && h > 0) { placeAndStart(w, h); started = true; }
    circles.forEach((c) => {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x <= 0) { c.x = 0; c.vx = Math.abs(c.vx); }
      if (c.x >= w - c.size) { c.x = w - c.size; c.vx = -Math.abs(c.vx); }
      if (c.y <= 0) { c.y = 0; c.vy = Math.abs(c.vy); }
      if (c.y >= h - c.size) { c.y = h - c.size; c.vy = -Math.abs(c.vy); }
      c.el.style.transform = `translate(${c.x}px,${c.y}px)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function init(): void {
  if (hamburger && nav) {
    hamburger.addEventListener('click', toggleMenu);

    nav.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a[href^="#"]')) closeMenu();
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    });
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && lastWidth < 768) closeMenu();
      lastWidth = window.innerWidth;
    });
  }
  initHeroBanner();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
