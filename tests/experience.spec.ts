import { test, expect } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';

const cvFilename = 'Rizky_Hermawan_CV_2026_07_29.pdf';
const originalCvHash = '4cbbc1923cef161fd7096ad3ab6d9be41abf6abe16b7796985bbb084c677de7c';
async function expectOriginalCvDownload(page: import('@playwright/test').Page) {
  const pending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Unduh CV', exact: true }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe(cvFilename);
  expect(await download.failure()).toBeNull();
  const bytes = await readFile((await download.path())!);
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(originalCvHash);
}

async function scrollToProgress(page: import('@playwright/test').Page, progress: number) {
  await page.evaluate(p => {
    const journey = document.querySelector<HTMLElement>('#journey')!;
    window.scrollTo({ top: (journey.offsetHeight - innerHeight) * p, behavior: 'instant' });
  }, progress);
}

test('door opens, scroll visits every chapter, portfolio works, replay resets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#open-door')).toBeEnabled({ timeout: 30000 });
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
  await page.locator('#open-door').click();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '3', { timeout: 10000 });
  for (const [p, chapter] of [[.2, 4], [.4, 5], [.6, 6], [.72, 7], [.85, 8], [1, 9]]) {
    await scrollToProgress(page, p);
    await expect(page.locator('body')).toHaveAttribute('data-chapter', String(chapter));
    if (p === .85) await page.screenshot({ path: 'output/preview/cv-laptop-screen.png' });
  }
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  await page.getByRole('button', { name: 'Lihat detail Enterprise Resource Planning', exact: true }).click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('Enterprise Resource Planning');
  await page.keyboard.press('Escape');
  await expect(page.locator('#project-dialog')).not.toBeVisible();
  await page.locator('#replay').click();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
  await expect(page.locator('#open-door')).toBeVisible();
  await expect(page.locator('#open-door')).toBeEnabled();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(errors).toEqual([]);
});

test('skip via keyboard, download original CV, anchors, and reverse scrolling', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.a11y-skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  await expect(page.locator('#profile-title')).toBeFocused();
  await page.evaluate(() => { (window as unknown as { print: () => void }).print = () => document.body.setAttribute('data-printed', 'yes'); });
  await expectOriginalCvDownload(page);
  await expect(page.locator('body')).not.toHaveAttribute('data-printed', 'yes');
  await page.getByRole('link', { name: 'Tentang', exact: true }).click();
  await expect(page).toHaveURL(/#tentang$/);
  await scrollToProgress(page, .5);
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'hidden');
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '5');
});

test('scrolling all the way back closes the door and requires another click', async ({ page }) => {
  // This full round trip includes screenshots rendered by software WebGL in CI.
  test.setTimeout(90000);
  await page.goto('/');
  await expect(page.locator('#open-door')).toBeEnabled({ timeout: 30000 });
  await page.locator('#open-door').click();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '3', { timeout: 10000 });
  // Opening alone must not trigger a reset while the camera is still at the start.
  await page.mouse.wheel(0, -200);
  await expect(page.locator('#scroll-hint')).toBeVisible();
  await scrollToProgress(page, 1);
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  for (const [p, chapter] of [[.85, 8], [.72, 7], [.6, 6], [.4, 5], [.2, 4]]) {
    await scrollToProgress(page, p);
    await expect(page.locator('body')).toHaveAttribute('data-chapter', String(chapter));
  }
  // Partial reversal must allow forward travel without another door click.
  await scrollToProgress(page, .6);
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '6');
  await scrollToProgress(page, 0);
  await expect(page.locator('#open-door')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#open-door')).toBeEnabled();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
  await expect(page.locator('body')).toHaveClass(/locked/);
  await expect(page.locator('#portfolio')).toHaveAttribute('inert', '');
  await expect(page.locator('#journey-caption')).toHaveCSS('opacity', '0', { timeout: 15000 });
  await expect(page.locator('.intro-copy')).toHaveCSS('opacity', '1', { timeout: 15000 });
  await page.screenshot({ path: 'output/preview/reset-desktop.png' });
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
  await page.locator('#open-door').click();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '3', { timeout: 10000 });
  await scrollToProgress(page, .4);
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '5');
  // A fast return is also a reset, and skip can safely interrupt door closing.
  await scrollToProgress(page, 0);
  await expect(page.locator('body')).toHaveClass(/locked/);
  await page.locator('#skip-intro').click();
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  await page.locator('#replay').click();
  await expect(page.locator('#open-door')).toBeEnabled();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
});

test.describe('mobile', () => {
test.use({ hasTouch: true, isMobile: true });
test('touch experience and portfolio do not overflow horizontally', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#open-door')).toBeEnabled({ timeout: 30000 });
  await page.locator('#open-door').tap();
  await expect(page.locator('#scroll-hint')).toBeVisible({ timeout: 10000 });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 650 }] });
  for (let y = 610; y >= 130; y -= 40) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
    await page.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '4');
  // Swipe downward from near the entry to return completely to the closed door.
  await scrollToProgress(page, .06);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 130 }] });
  for (let y = 170; y <= 650; y += 40) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
    await page.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#open-door')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#open-door')).toBeEnabled();
  await expect(page.locator('body')).toHaveAttribute('data-chapter', '1');
  await expect(page.locator('#journey-caption')).toHaveCSS('opacity', '0');
  await expect(page.locator('.intro-copy')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'output/preview/reset-mobile.png' });
  await page.locator('#open-door').tap();
  await expect(page.locator('#scroll-hint')).toBeVisible({ timeout: 10000 });
  await page.locator('#skip-intro').click();
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('#profile-title')).toBeInViewport();
  await page.getByRole('button', { name: 'Tampilkan proyek Manufacturing Planning System', exact: true }).click();
  await page.getByRole('button', { name: 'Lihat detail Manufacturing Planning System' }).click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  expect(await page.locator('#project-dialog').evaluate(el => el.getBoundingClientRect().width < innerWidth)).toBe(true);
});
});

test('reduced motion bypasses 3D and still renders portfolio on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  await expect(page.locator('#journey')).not.toBeVisible();
  await expect(page.locator('#profile-title')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('GPU failure falls back to usable HTML', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
  await expect(page.locator('#fallback-notice')).toBeVisible();
  await page.getByRole('button', { name: 'Lihat detail Enterprise Resource Planning', exact: true }).click();
  await expect(page.locator('#project-dialog')).toBeVisible();
});

test('direct content hash opens without the intro', async ({ page }) => {
  for (const [hash, heading] of [['#proyek', '#projects-title'], ['#pengalaman', '#experience-title']]) {
    await page.goto(`/${hash}`);
    await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading', { timeout: 30000 });
    await expect(page.locator(heading)).toBeInViewport();
  }
});

test.describe('GitHub Pages repository subfolder', () => {
  let server: Server;
  let port: number;
  test.beforeAll(async () => {
    const root = resolve('dist');
    const mime: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
    server = createServer(async (request, response) => {
      const url = new URL(request.url!, 'http://localhost');
      if (!url.pathname.startsWith('/portfolio-demo/')) { response.writeHead(404); response.end(); return; }
      const relative = decodeURIComponent(url.pathname.slice('/portfolio-demo/'.length)) || 'index.html';
      const path = resolve(root, relative);
      if (!path.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
      try { const data = await readFile(path); response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); response.end(data); }
      catch { response.writeHead(404); response.end(); }
    });
    await new Promise<void>(done => server.listen(0, '127.0.0.1', done));
    port = (server.address() as { port: number }).port;
  });
  test.afterAll(async () => { await new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done())); });
  test('production JS, CSS, favicon, scene load under a repository path', async ({ page }) => {
    const failures: string[] = [];
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(`http://127.0.0.1:${port}/portfolio-demo/`);
    await expect(page.locator('#open-door')).toBeEnabled({ timeout: 30000 });
    await expect(page.locator('body')).toHaveClass(/scene-ready/);
    await page.locator('#skip-intro').click();
    await expect(page.locator('#portfolio')).toHaveAttribute('data-phase', 'reading');
    await expect(page.locator('#download-cv')).toHaveAttribute('href', `./cv/${cvFilename}`);
    await expectOriginalCvDownload(page);
    expect(failures).toEqual([]);
  });
});

for (const viewport of [{ width: 1440, height: 900, label: 'desktop' }, { width: 390, height: 844, label: 'mobile' }]) {
  test(`project carousel navigation, gestures and dialog state on ${viewport.label}`, async ({ page, context }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#proyek');
    const track = page.locator('#project-track');
    const counter = page.locator('.carousel-counter');
    const dialog = page.locator('#project-dialog');
    await expect(page.getByRole('button', { name: 'Proyek sebelumnya', exact: true })).toBeDisabled();
    await track.focus();
    await track.press('ArrowRight');
    await expect(counter).toHaveText('02 / 05');
    await expect(page.locator('.project-card').first()).toHaveAttribute('inert', '');
    await track.press('End');
    await expect(counter).toHaveText('05 / 05');
    await expect(page.getByRole('button', { name: 'Proyek berikutnya', exact: true })).toBeDisabled();
    await track.press('Home');
    await expect(counter).toHaveText('01 / 05');
    await page.getByRole('button', { name: 'Tampilkan proyek Integrasi Timbangan', exact: true }).click();
    await expect(counter).toHaveText('05 / 05');
    await page.getByRole('button', { name: 'Tampilkan proyek Enterprise Resource Planning', exact: true }).click();
    await expect(counter).toHaveText('01 / 05');
    await track.scrollIntoViewIfNeeded();
    const bounds = (await track.boundingBox())!;
    if (viewport.label === 'mobile') {
      const session = await context.newCDPSession(page);
      const start = bounds.x + bounds.width - 30;
      const finish = bounds.x + 30;
      const y = bounds.y + 90;
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] });
      for (let step = 1; step <= 10; step++) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start + (finish - start) * step / 10, y }] });
        await page.waitForTimeout(20);
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await session.detach();
    } else {
      // Start on the details button: a drag must never activate its click handler.
      const button = (await page.locator('.project-details').first().boundingBox())!;
      await page.mouse.move(button.x + button.width / 2, button.y + button.height / 2);
      await page.mouse.down();
      await page.mouse.move(bounds.x + 35, button.y + button.height / 2, { steps: 16 });
      await page.mouse.up();
    }
    await expect(counter).toHaveText('02 / 05');
    await expect(dialog).not.toBeVisible();
    // Native touch momentum and scroll snap can continue after the index changes.
    await expect.poll(() => track.evaluate(el => {
      const slide = el.querySelectorAll('.project-card')[1].getBoundingClientRect();
      const bounds = el.getBoundingClientRect();
      return Math.abs(slide.left + slide.width / 2 - bounds.left - el.clientWidth / 2);
    })).toBeLessThan(2);
    const left = await track.evaluate(el => el.scrollLeft);
    const details = page.getByRole('button', { name: 'Lihat detail Manufacturing Planning System', exact: true });
    await details.click();
    await expect(page.locator('#dialog-description')).toContainText('250 mesin');
    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText('02 / 05');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(details).toBeFocused();
    expect(await track.evaluate(el => el.scrollLeft)).toBeCloseTo(left, 0);
    await page.getByRole('button', { name: 'Proyek berikutnya', exact: true }).click();
    await expect(counter).toHaveText('03 / 05');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ media: 'print' });
    await expect(track).toHaveCSS('display', 'block');
    await expect(page.locator('.carousel-controls')).toHaveCSS('display', 'none');
    await expect(page.locator('.project-card')).toHaveCount(5);
    await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
    await page.getByRole('button', { name: 'Tampilkan proyek Enterprise Resource Planning', exact: true }).click();
    for (let step = 0; step < 3; step++) await page.getByRole('button', { name: 'Proyek berikutnya', exact: true }).click();
    await expect(counter).toHaveText('04 / 05');
    await expect.poll(() => track.evaluate(el => {
      const slide = el.querySelectorAll('.project-card')[3].getBoundingClientRect();
      const bounds = el.getBoundingClientRect();
      return Math.abs(slide.left + slide.width / 2 - bounds.left - el.clientWidth / 2);
    })).toBeLessThan(2);
    await expect(counter).toHaveText('04 / 05');
  });

  test(`project dialog motion and dismissal on ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#proyek');
    const card = page.locator('.project-details').first();
    const dialog = page.locator('#project-dialog');
    await card.click();
    // Pause midway to prove a visible transition, rather than just a CSS declaration.
    const midwayOpacity = await dialog.evaluate(element => {
      const animation = element.getAnimations().find(a => a instanceof CSSAnimation && a.animationName === 'project-dialog-in')!;
      animation.pause();
      animation.currentTime = 140;
      return Number(getComputedStyle(element).opacity);
    });
    expect(midwayOpacity).toBeGreaterThan(0);
    expect(midwayOpacity).toBeLessThan(1);
    await dialog.evaluate(async element => {
      const animation = element.getAnimations().find(a => a instanceof CSSAnimation && a.animationName === 'project-dialog-in')!;
      animation.play();
      await animation.finished;
    });
    await page.screenshot({ path: `output/preview/cv-${viewport.label}-dialog.png` });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(card).toBeFocused();
    await card.press('Enter');
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Tutup detail proyek' }).click();
    await expect(dialog).not.toBeVisible();
    await card.press('Space');
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).not.toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await card.press('Enter');
    expect(await dialog.evaluate(el => el.getAnimations().length)).toBe(0);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`CV profile, project details, contacts and layout on ${viewport.label}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await expect(page).toHaveTitle('Rizky Hermawan — Fullstack & Backend Engineer');
    await expect(page.locator('.personal-brand')).toContainText('Rizky Hermawan');
    await expect(page.locator('#profile-title')).toHaveText('Rizky HermawanFullstack & Backend Engineer');
    await expect(page.locator('#experience-title')).toHaveText('Pengalaman Profesional');
    await expect(page.locator('#projects-title')).toHaveText('Proyek yang Pernah Dikerjakan');
    await expect(page.locator('#about-title')).toHaveText('Tentang Saya & Keahlian');
    await expect(page.locator('#contact-title')).toHaveText('Hubungi Saya');
    const experienceCta = page.getByRole('link', { name: 'Lihat Pengalaman', exact: true });
    await expect(experienceCta).toHaveAttribute('href', '#pengalaman');
    await experienceCta.click();
    await expect(page).toHaveURL(/#pengalaman$/);
    await expect(page.locator('#experience-title')).toBeInViewport();
    expect(await page.locator('#portfolio section[id]').evaluateAll(sections => sections.map(section => section.id))).toEqual(['pengalaman', 'proyek', 'tentang', 'kontak']);
    await expect(page.locator('#pengalaman')).toContainText('PT Kahaptex Indonesia');
    await expect(page.locator('#pengalaman')).toContainText('2022 sampai sekarang');
    await expect(page.locator('.hero-intro > p')).toHaveCount(2);
    await expect(page.locator('.hero-description').first()).toContainText('Saya Rizky Hermawan');
    await expect(page.locator('.hero-description').first()).toContainText('saya bekerja bersama tim mengembangkan ERP');
    for (const detail of ['PT Mitrahasanah Sukadamai', '2018 sampai 2022', 'Menggali kebutuhan aplikasi', 'frontend, backend, database', 'Ruby dan Cucumber', 'deployment melalui Git hooks', 'membimbing programmer', 'sesekali melakukan wawancara']) {
      await expect(page.locator('#pengalaman')).toContainText(detail);
    }
    const currentJob = page.locator('.experience-entry').first();
    await expect(currentJob.locator('li')).toHaveCount(6);
    for (const projectDetail of ['302 pengguna', '2.500 karyawan', '250 mesin', '10 sampai 15 detik', '83%', '50 komputer']) {
      await expect(currentJob).not.toContainText(projectDetail);
    }
    await expect(page.locator('.project-card')).toHaveCount(5);
    await expect(page.locator('.skill-groups')).toContainText('Grafana');
    await expect(page.locator('#kontak')).toContainText('Untuk membahas pengalaman kerja dan posisi yang relevan');
    await expect(page.locator('.education-block').first()).toContainText('Sarjana Komputer, Teknik Informatika');
    await expect(page.locator('.education-block').first()).toContainText('Lulus 2019');
    await expect(page.locator('.training-list')).toContainText('MTCNA');
    await expect(page.locator('.personal-project-link')).toHaveAttribute('href', 'https://github.com/rhermawan56/amertanala-landingpage');
    await expect(page.locator('.profile-facts')).toContainText('Pengembangan aplikasi sejak 2018');
    await expect(page.locator('.experience-entry')).toHaveCount(2);
    await expect(page.locator('.skill-groups')).toContainText('MariaDB MaxScale');
    const backend = page.locator('.skill-group').filter({ has: page.getByRole('heading', { name: 'Backend', exact: true }) });
    for (const skill of ['Ruby', 'Ruby on Rails']) await expect(backend.getByText(skill, { exact: true })).toBeVisible();
    const frontend = page.locator('.skill-group').filter({ has: page.getByRole('heading', { name: 'Frontend', exact: true }) });
    await expect(frontend.getByText('TypeScript', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/rhermawan56');
    await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/rizky-hermawan-29a15a154/');
    await expect(page.getByRole('link', { name: 'Hubungi via Email', exact: true })).toHaveAttribute('href', 'mailto:rhermawan56@gmail.com');
    await expect(page.locator('#portfolio')).not.toContainText('Nama Anda');
    await expect(page.locator('#portfolio')).not.toContainText('Template portofolio');
    await expect(page.locator('#portfolio')).not.toContainText('Punya ide menarik?');
    await expect(page.locator('#portfolio')).not.toContainText('Dari ide menjadi nyata');
    for (const title of ['Enterprise Resource Planning', 'Manufacturing Planning System', 'Human Resource & Attendance', 'Validasi Pengiriman QR', 'Integrasi Timbangan']) {
      await page.getByRole('button', { name: `Tampilkan proyek ${title}`, exact: true }).click();
      await page.getByRole('button', { name: `Lihat detail ${title}`, exact: true }).click();
      await expect(page.locator('#dialog-title')).toHaveText(title);
      const projectEvidence: Record<string, string[]> = {
        'Enterprise Resource Planning': ['302 pengguna aktif harian', '10 sampai 15 detik', 'satu master dan lima replica', 'Rekan programmer mengembangkan modul finance'],
        'Manufacturing Planning System': ['250 mesin', 'Berdasarkan pengamatan operasional'],
        'Human Resource & Attendance': ['2.500 karyawan', 'sekitar 83%'],
        'Validasi Pengiriman QR': ['100 sampai 200 surat jalan', 'Maret 2023', 'yang diketahui'],
        'Integrasi Timbangan': ['VB ke Python pada 2025', 'lebih dari 50 komputer'],
      };
      for (const detail of projectEvidence[title]) await expect(page.locator('#dialog-description')).toContainText(detail);
      if (title === 'Manufacturing Planning System') {
        await expect(page.locator('#dialog-description')).toContainText('Laravel dan MySQL');
        await expect(page.locator('#dialog-description')).not.toContainText('CodeIgniter');
      }
      await expect(page.locator('#dialog-description')).not.toContainText('Sebagai Software Engineer');
      await expect(page.locator('#dialog-description')).not.toContainText('Ilustrasi');
      await expect(page.locator('#dialog-description')).not.toContainText('Ruby');
      await expect(page.locator('#dialog-description')).not.toContainText('TypeScript');
      await expect(page.locator('#dialog-link a')).toHaveCount(0);
      await page.keyboard.press('Escape');
    }
    await page.locator('#portfolio').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const section of ['.portfolio-nav', '.hero-actions', '#proyek', '#pengalaman', '.skill-groups', '#kontak']) {
      const bounds = await page.locator(section).boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expectOriginalCvDownload(page);
    await page.screenshot({ path: `output/preview/cv-${viewport.label}-hero.png`, style: '#fallback-notice{visibility:hidden}' });
    for (const section of ['proyek', 'pengalaman', 'tentang', 'kontak']) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `output/preview/cv-${viewport.label}-${section}.png`, style: '#fallback-notice{visibility:hidden}' });
    }
  });
}
