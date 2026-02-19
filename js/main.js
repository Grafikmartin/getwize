/**
 * Getwize – Hamburger menu, Tag/Nacht, hero banner (Billard-Kreise)
 */
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
const menuOverlayBackdrop = document.getElementById('menu-overlay-backdrop');
const menuOverlayClose = document.getElementById('menu-overlay-close');
const header = document.querySelector('.header');
const themeToggle = document.getElementById('theme-toggle');

const THEME_KEY = 'getwize-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
  } catch (_e) {
    return THEME_LIGHT;
  }
}

function setTheme(dark) {
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
  } catch (_e) {}
}

function toggleTheme() {
  const nextDark = !document.documentElement.classList.contains('theme-dark');
  setTheme(nextDark);
}

function initTheme() {
  const stored = getStoredTheme();
  setTheme(stored === THEME_DARK);
  themeToggle?.addEventListener('click', toggleTheme);
}

function toggleMenu() {
  if (!header || !menuOverlay) return;
  const isOpen = header.classList.toggle('is-open');
  menuOverlay.classList.toggle('is-open', isOpen);
  menuOverlay.setAttribute('aria-hidden', String(!isOpen));
  hamburger?.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  header?.classList.remove('is-open');
  menuOverlay?.classList.remove('is-open');
  menuOverlay?.setAttribute('aria-hidden', 'true');
  hamburger?.setAttribute('aria-expanded', 'false');
}

/* ----- Banner-Kreise: Hero + Card-Banner (Billard-Bewegung, 40% Primär, 35% Sekundär, 20% Neutral, 5% Akzent) ----- */
const HERO_CIRCLES = 120;
const CARD_BANNER_CIRCLES = 60;
const COLOR_COUNTS = { primary: 48, secondary: 42, neutral: 24, accent: 6 };

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createColorQueue(total, counts) {
  const queue = [];
  const keys = Object.keys(counts);
  let n = 0;
  keys.forEach((k) => { n += counts[k]; });
  const scale = total / Math.max(1, n);
  keys.forEach((kind) => {
    const num = Math.round((counts[kind] || 0) * scale);
    for (let i = 0; i < num; i++) queue.push(kind);
  });
  while (queue.length < total) queue.push(keys[0]);
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
}

function initBannerCircles(banner, numCircles) {
  const colorQueue = createColorQueue(numCircles, COLOR_COUNTS);
  const circles = [];
  for (let i = 0; i < numCircles; i++) {
    const size = Math.round(randomBetween(10, 52));
    const el = document.createElement('div');
    el.className = 'hero-banner__circle hero-banner__circle--' + colorQueue[i];
    el.setAttribute('aria-hidden', 'true');
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    banner.appendChild(el);
    circles.push({
      el,
      size,
      x: 0,
      y: 0,
      vx: randomBetween(0.15, 0.55) * (Math.random() < 0.5 ? 1 : -1),
      vy: randomBetween(0.15, 0.55) * (Math.random() < 0.5 ? 1 : -1),
    });
  }
  let started = false;
  function placeAndStart(w, h) {
    circles.forEach((c) => {
      c.x = randomBetween(0, Math.max(0, w - c.size));
      c.y = randomBetween(0, Math.max(0, h - c.size));
    });
  }
  function tick() {
    const w = banner.offsetWidth;
    const h = banner.offsetHeight;
    if (!started && w > 0 && h > 0) {
      placeAndStart(w, h);
      started = true;
    }
    circles.forEach((c) => {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x <= 0) { c.x = 0; c.vx = Math.abs(c.vx); }
      if (c.x >= w - c.size) { c.x = w - c.size; c.vx = -Math.abs(c.vx); }
      if (c.y <= 0) { c.y = 0; c.vy = Math.abs(c.vy); }
      if (c.y >= h - c.size) { c.y = h - c.size; c.vy = -Math.abs(c.vy); }
      c.el.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px)';
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initHeroBanner() {
  const hero = document.querySelector('.hero-banner');
  if (hero) initBannerCircles(hero, HERO_CIRCLES);
  document.querySelectorAll('.banner-circles').forEach((el) => {
    initBannerCircles(el, CARD_BANNER_CIRCLES);
  });
}

const LOGO_V1_MAIN = 'logo/Farbvarianten/GW1.svg';
const LOGO_V1_CARD = 'logo/Farbvarianten/GW-S1.svg';
const LOGO_V2_MAIN = 'logo/Farbvarianten/GW2.svg';
const LOGO_V2_CARD = 'logo/Farbvarianten/GW-S2.svg';
const V_ACCENT_FALLBACK = 'logo/Farbvarianten/V-1.svg';

function setVariant(variant) {
  const v = Math.max(1, Math.min(5, Number(variant) || 1));
  const html = document.documentElement;
  html.classList.remove('variant-2', 'variant-3', 'variant-4', 'variant-5');
  if (v >= 2) html.classList.add('variant-' + v);
  const mainSrc = v === 1 ? LOGO_V1_MAIN : LOGO_V2_MAIN;
  const cardSrc = v === 1 ? LOGO_V1_CARD : LOGO_V2_CARD;
  document.querySelectorAll('.js-logo-main').forEach((img) => { img.src = mainSrc; });
  document.querySelectorAll('.js-logo-card').forEach((img) => { img.src = cardSrc; });
  const accentSrc = 'logo/Farbvarianten/V-' + v + '.svg';
  document.querySelectorAll('.js-variant-accent').forEach((img) => {
    img.src = accentSrc;
    img.onerror = function () { this.onerror = null; this.src = V_ACCENT_FALLBACK; };
  });
}

function init() {
  initTheme();
  document.querySelectorAll('.nav-variant-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-variant');
      if (v && v >= '1' && v <= '5') setVariant(Number(v));
      closeMenu();
    });
  });
  if (hamburger && menuOverlay) {
    hamburger.addEventListener('click', toggleMenu);
    menuOverlayBackdrop?.addEventListener('click', closeMenu);
    menuOverlayClose?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
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
