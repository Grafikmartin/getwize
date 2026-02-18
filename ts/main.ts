/**
 * Getwize – Hamburger menu and UI events (vanilla TypeScript)
 */

const hamburger = document.getElementById('hamburger') as HTMLButtonElement | null;
const menuOverlay = document.getElementById('menu-overlay');
const menuOverlayBackdrop = document.getElementById('menu-overlay-backdrop');
const menuOverlayClose = document.getElementById('menu-overlay-close');
const header = document.querySelector('.header');
const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement | null;

const THEME_KEY = 'getwize-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

function getStoredTheme(): string {
  try {
    return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
  } catch {
    return THEME_LIGHT;
  }
}

function setTheme(dark: boolean): void {
  const html = document.documentElement;
  if (dark) {
    html.classList.add('theme-dark');
    themeToggle?.setAttribute('aria-label', 'Zu Tagmodus wechseln');
    themeToggle?.setAttribute('title', 'Tagmodus');
  } else {
    html.classList.remove('theme-dark');
    themeToggle?.setAttribute('aria-label', 'Zu Nachtmodus wechseln');
    themeToggle?.setAttribute('title', 'Nachtmodus');
  }
  try {
    localStorage.setItem(THEME_KEY, dark ? THEME_DARK : THEME_LIGHT);
  } catch {}
}

function toggleTheme(): void {
  const nextDark = !document.documentElement.classList.contains('theme-dark');
  setTheme(nextDark);
}

function initTheme(): void {
  setTheme(getStoredTheme() === THEME_DARK);
  themeToggle?.addEventListener('click', toggleTheme);
}

function toggleMenu(): void {
  if (!header || !menuOverlay) return;
  const isOpen = header.classList.toggle('is-open');
  menuOverlay.classList.toggle('is-open', isOpen);
  menuOverlay.setAttribute('aria-hidden', String(!isOpen));
  hamburger?.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu(): void {
  header?.classList.remove('is-open');
  menuOverlay?.classList.remove('is-open');
  menuOverlay?.setAttribute('aria-hidden', 'true');
  hamburger?.setAttribute('aria-expanded', 'false');
}

const LOGO_V1_MAIN = 'logo/Farbvarianten/GW1.svg';
const LOGO_V1_CARD = 'logo/Farbvarianten/GW-S1.svg';
const LOGO_V2_MAIN = 'logo/Farbvarianten/GW2.svg';
const LOGO_V2_CARD = 'logo/Farbvarianten/GW-S2.svg';

function setVariant(variant: number): void {
  const isV2 = variant === 2;
  const html = document.documentElement;
  if (isV2) html.classList.add('variant-2');
  else html.classList.remove('variant-2');
  const mainSrc = isV2 ? LOGO_V2_MAIN : LOGO_V1_MAIN;
  const cardSrc = isV2 ? LOGO_V2_CARD : LOGO_V1_CARD;
  document.querySelectorAll<HTMLImageElement>('.js-logo-main').forEach((img) => { img.src = mainSrc; });
  document.querySelectorAll<HTMLImageElement>('.js-logo-card').forEach((img) => { img.src = cardSrc; });
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
  initTheme();
  document.querySelectorAll('.nav-variant-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-variant');
      if (v === '1' || v === '2') setVariant(Number(v));
      closeMenu();
    });
  });
  if (hamburger && menuOverlay) {
    hamburger.addEventListener('click', toggleMenu);
    menuOverlayBackdrop?.addEventListener('click', closeMenu);
    menuOverlayClose?.addEventListener('click', closeMenu);
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
