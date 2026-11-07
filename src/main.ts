import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { arrow, bindPortfolio, portfolioMarkup } from './portfolio';
import type { createRoom } from './scene';

gsap.registerPlugin(ScrollTrigger);
// Preserve elapsed time on slower GPUs instead of prolonging the door animation.
gsap.ticker.lagSmoothing(0);
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section id="journey" aria-label="Perjalanan ke ruang karya">
    <div id="stage">
      <canvas id="room" aria-label="Ruangan tiga dimensi dengan pintu interaktif"></canvas>
      <div class="scene-vignette" aria-hidden="true"></div>
      <header class="experience-header"><a href="./" class="wordmark" aria-label="Ruang Karya, halaman awal"><svg viewBox="0 0 28 32" fill="none" aria-hidden="true"><path d="M4 29V3h20v26M10 29V9l10-2v22" stroke="currentColor" stroke-width="1.4"/><circle cx="16" cy="18" r="1" fill="currentColor"/></svg><span>ruang<span class="wordmark-light">karya</span><sup>®</sup></span></a><span class="header-center">A PERSONAL SPACE ON THE INTERNET</span><button id="skip-intro" class="skip-button">Lewati intro ${arrow}</button></header>
      <div class="intro-copy"><p class="eyebrow"><span class="tiny-line"></span> SELAMAT DATANG DI RUANG SAYA</p><h1>Setiap karya<br>punya ruang<span>.</span></h1><p>Sebuah perjalanan kecil,<br>sebelum mengenal lebih jauh.</p></div>
      <button id="open-door" class="door-button" disabled><span class="door-button-icon">${arrow}</span><span id="door-button-label">Menyiapkan ruangan</span></button>
      <div id="journey-caption" class="journey-caption" aria-live="polite" aria-atomic="true"><span id="chapter-number">01 / 09</span><h2 id="chapter-title">Di balik sebuah pintu.</h2><p id="chapter-description">Klik pintu untuk memulai perjalanan.</p></div>
      <div class="chapter-nav" aria-label="Tahapan perjalanan">${['Pintu', 'Buka', 'Mulai', 'Masuk', 'Meja', 'Duduk', 'Laptop', 'Layar', 'Karya'].map((s, i) => `<span class="chapter-dot ${i === 0 ? 'current' : ''}" title="${i + 1}. ${s}"></span>`).join('')}</div>
      <button id="scroll-hint" class="scroll-hint" hidden><span class="mouse-outline"><i></i></span><span>Scroll untuk menjelajah</span><span>↓</span></button>
      <footer class="experience-footer"><span>EXPLORE AT YOUR OWN PACE</span><span id="journey-status"><i class="status-dot"></i> RUANG KARYA / 01</span><span class="footer-index">SCROLL EXPERIENCE © ${new Date().getFullYear()}</span></footer>
      <div class="scroll-track" aria-hidden="true"><span id="scroll-progress"></span></div>
    </div>
  </section>
  <main id="portfolio" class="portfolio" data-phase="hidden" aria-label="Portofolio" inert>${portfolioMarkup()}</main>
  <div id="fallback-notice" role="status" hidden>Mode sederhana aktif. Portofolio tetap dapat dibaca.</div>`;

bindPortfolio();
const journey = document.querySelector<HTMLElement>('#journey')!;
const portfolio = document.querySelector<HTMLElement>('#portfolio')!;
const canvas = document.querySelector<HTMLCanvasElement>('#room')!;
const doorButton = document.querySelector<HTMLButtonElement>('#open-door')!;
const scrollHint = document.querySelector<HTMLButtonElement>('#scroll-hint')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let room: ReturnType<typeof createRoom> | undefined;
let trigger: ScrollTrigger | undefined;
let opened = false, opening = false, simple = false, lastChapter = -1;
let hasTravelled = false, resetting = false, resetVersion = 0;
let sceneReady = false;
const state = { progress: 0 };
const chapters = [
  ['Di balik sebuah pintu.', 'Klik pintu untuk memulai perjalanan.'],
  ['Silakan masuk.', 'Pintu menuju ruang karya sedang terbuka.'],
  ['Ambil waktu sejenak.', 'Scroll perlahan. Perjalanan dimulai dari sini.'],
  ['Ruang untuk ide.', 'Setiap sudut menyimpan sebuah kemungkinan.'],
  ['Tempat karya bermula.', 'Di sebelah kanan, sebuah meja dan rasa ingin tahu.'],
  ['Buat diri Anda nyaman.', 'Sudut pandang baru. Cerita yang sama.'],
  ['Buka kemungkinan.', 'Dari sebuah layar, ide menemukan bentuknya.'],
  ['Lebih dekat dengan karya.', 'Mari lihat apa yang ada di balik prosesnya.'],
  ['Selamat datang.', 'Sekarang, giliran karya yang bercerita.'],
];
function chapter(index: number) {
  if (index === lastChapter) return;
  lastChapter = index;
  document.querySelector('#chapter-number')!.textContent = `${String(index + 1).padStart(2, '0')} / 09`;
  document.querySelector('#chapter-title')!.textContent = chapters[index][0];
  document.querySelector('#chapter-description')!.textContent = chapters[index][1];
  document.querySelectorAll('.chapter-dot').forEach((dot, i) => { dot.classList.toggle('current', i === index); dot.classList.toggle('past', i < index); });
  document.body.dataset.chapter = String(index + 1);
}
function reveal(progress: number) {
  state.progress = progress;
  room?.update(progress);
  const phase = progress >= .9998 ? 'reading' : progress > .915 ? 'transition' : 'hidden';
  portfolio.dataset.phase = phase;
  portfolio.inert = phase !== 'reading';
  portfolio.style.opacity = String(Math.max(0, Math.min(1, (progress - .915) / .07)));
  document.body.classList.toggle('reading', phase === 'reading');
  room?.setActive(phase !== 'reading');
  document.querySelector<HTMLElement>('#scroll-progress')!.style.transform = `scaleX(${progress})`;
  document.querySelector<HTMLElement>('#journey-caption')!.style.opacity = String(1 - Math.max(0, (progress - .86) / .06));
  scrollHint.style.opacity = progress < .1 ? '1' : '0';
  chapter(progress < .04 ? 2 : progress < .33 ? 3 : progress < .54 ? 4 : progress < .66 ? 5 : progress < .79 ? 6 : progress < .99 ? 7 : 8);
}
function createJourney() {
  trigger?.kill();
  trigger = ScrollTrigger.create({
    trigger: journey,
    start: 'top top', end: 'bottom bottom',
    onUpdate: self => {
      if (!opened || resetting || simple) return;
      reveal(self.progress);
      if (self.progress > 0) hasTravelled = true;
      // Refresh and the first open both start at zero; only a return closes the door.
      if (hasTravelled && self.progress === 0 && self.direction < 0) void resetJourney(true);
    },
    onRefresh: self => { if (opened && !resetting && !simple) reveal(self.progress); },
  });
}
function enterPortfolio(focus = true) {
  if (simple) { document.querySelector<HTMLElement>('#profile-title')?.focus({ preventScroll: true }); return; }
  resetVersion++; resetting = false; hasTravelled = false;
  gsap.killTweensOf(room?.door.rotation ?? {});
  opened = true; opening = false;
  document.body.classList.remove('locked', 'opening'); document.body.classList.add('entered');
  doorButton.hidden = true; scrollHint.hidden = true;
  if (room) { room.door.rotation.y = 1.48; room.invalidate(); }
  createJourney();
  reveal(1);
  hasTravelled = true;
  window.scrollTo({ top: trigger!.end, behavior: 'instant' });
  ScrollTrigger.update();
  if (focus) document.querySelector<HTMLElement>('#profile-title')?.focus({ preventScroll: true });
}
function fallback() {
  resetVersion++; resetting = false; hasTravelled = false; opening = false;
  if (room) gsap.killTweensOf(room.door.rotation);
  simple = true;
  trigger?.kill();
  document.body.classList.remove('locked', 'opening'); document.body.classList.add('simple', 'reading');
  portfolio.dataset.phase = 'reading'; portfolio.inert = false; portfolio.style.opacity = '1';
  journey.hidden = true; room?.setActive(false);
  document.querySelector<HTMLElement>('#fallback-notice')!.hidden = false;
}
async function openDoor() {
  if (!sceneReady || opening || opened || resetting || simple) return;
  opening = true; chapter(1); document.body.classList.add('opening');
  doorButton.disabled = true;
  await gsap.to(room!.door.rotation, { y: 1.48, duration: 1.8, ease: 'power2.inOut', onUpdate: () => room!.invalidate() });
  if (simple || !opening) return;
  opened = true; opening = false;
  document.body.classList.remove('locked', 'opening'); document.body.classList.add('entered');
  doorButton.hidden = true; scrollHint.hidden = false;
  createJourney(); chapter(2);
  scrollHint.focus({ preventScroll: true });
}
doorButton.addEventListener('click', openDoor);
canvas.addEventListener('click', event => { if (!opened && room?.isDoor(event.clientX, event.clientY)) openDoor(); });
canvas.addEventListener('pointermove', event => { canvas.style.cursor = !opened && room?.isDoor(event.clientX, event.clientY) ? 'pointer' : 'default'; });
document.querySelector('#skip-intro')!.addEventListener('click', () => enterPortfolio());
document.querySelector('.a11y-skip')!.addEventListener('click', event => { event.preventDefault(); enterPortfolio(); });
scrollHint.addEventListener('click', () => window.scrollTo({ top: (trigger?.end ?? 0) * .16, behavior: 'smooth' }));
async function resetJourney(animate = false) {
  if (resetting) return;
  if (simple) { if (!reduced.matches && room) { simple = false; journey.hidden = false; document.body.classList.remove('simple'); document.querySelector<HTMLElement>('#fallback-notice')!.hidden = true; } else { window.scrollTo({ top: 0, behavior: 'smooth' }); return; } }
  const version = ++resetVersion;
  resetting = true; hasTravelled = false; contentHash = false;
  trigger?.kill(); trigger = undefined; opened = false; opening = false;
  document.body.classList.remove('reading', 'opening'); document.body.classList.add('locked');
  window.scrollTo({ top: 0, behavior: 'instant' });
  reveal(0);
  doorButton.hidden = true; doorButton.disabled = true; scrollHint.hidden = true;
  document.querySelector<HTMLElement>('#journey-caption')!.style.opacity = '1';
  if (room) {
    gsap.killTweensOf(room.door.rotation);
    room.setActive(true);
    if (animate) {
      await gsap.to(room.door.rotation, { y: 0, duration: 1.8, ease: 'power2.inOut', onUpdate: () => room?.invalidate() });
    } else { room.door.rotation.y = 0; room.invalidate(); }
  }
  // Skip or a WebGL fallback may take control while the closing tween is running.
  if (version !== resetVersion || simple) return;
  resetting = false;
  document.body.classList.remove('entered');
  document.querySelector<HTMLElement>('#journey-caption')!.style.removeProperty('opacity');
  doorButton.hidden = false; doorButton.disabled = !sceneReady;
  chapter(0); doorButton.focus({ preventScroll: true });
}
document.querySelector('#replay')!.addEventListener('click', () => void resetJourney());
// Direct links to content bypass the cinematic entry, including reloads of anchors.
let contentHash = ['#portfolio', '#pengalaman', '#tentang', '#proyek', '#kontak'].includes(location.hash);
document.body.classList.add('locked'); chapter(0);
if (reduced.matches) {
  fallback();
} else {
  import('./scene').then(({ createRoom }) => {
    room = createRoom(canvas); sceneReady = true;
    document.querySelector('#door-button-label')!.textContent = 'Klik untuk masuk'; doorButton.disabled = false;
    document.body.classList.add('scene-ready');
    if (opened) {
      // A visitor may already be reading while the lazy scene initializes.
      room.door.rotation.y = 1.48; room.update(state.progress);
      room.setActive(portfolio.dataset.phase !== 'reading');
    } else if (contentHash) {
      enterPortfolio(false); requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
    }
  }).catch(error => { console.error('The 3D room could not be initialized.', error); fallback(); });
}
reduced.addEventListener('change', event => { if (event.matches) fallback(); });
canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
window.addEventListener('hashchange', () => {
  if (['#portfolio', '#pengalaman', '#tentang', '#proyek', '#kontak'].includes(location.hash) && !opened && !simple) {
    enterPortfolio(false); requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  }
});
