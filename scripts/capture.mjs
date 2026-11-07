import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('output/preview', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
await page.goto('http://127.0.0.1:5173/');
await page.locator('#open-door').waitFor({ state: 'visible' });
await page.waitForFunction(() => document.body.classList.contains('scene-ready'), { timeout: 30000 });
await page.waitForTimeout(1300);
await page.screenshot({ path: 'output/preview/01-door-desktop.png' });
await page.locator('#open-door').click();
await page.waitForFunction(() => document.body.dataset.chapter === '3');
await page.screenshot({ path: 'output/preview/02-door-open.png' });
for (const [progress, name] of [[.22, '03-room'], [.49, '04-desk'], [.66, '05-seated'], [.79, '06-laptop'], [.89, '07-screen'], [1, '08-portfolio']]) {
  await page.evaluate(p => window.scrollTo({ top: (document.querySelector('#journey').offsetHeight - innerHeight) * p, behavior: 'instant' }), progress);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `output/preview/${name}.png` });
}
await page.locator('#proyek').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'output/preview/09-projects.png' });
await page.locator('#kontak').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'output/preview/09-about-contact.png' });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:5173/');
await page.waitForFunction(() => document.body.classList.contains('scene-ready'));
await page.screenshot({ path: 'output/preview/10-door-mobile.png' });
await page.locator('#skip-intro').click();
await page.waitForTimeout(300);
await page.screenshot({ path: 'output/preview/11-portfolio-mobile.png' });
await browser.close();
console.log('Screenshots saved to output/preview/.');
