import * as THREE from 'three';
import { profile } from './content';

// Seeded procedural materials keep the entire experience offline-capable after build.
function random(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

export function surface(kind: 'wood' | 'plaster' | 'fabric', color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const rand = random(817 + kind.length);
  ctx.fillStyle = color; ctx.fillRect(0, 0, 512, 512);
  if (kind === 'wood') {
    for (let i = 0; i < 2400; i++) {
      const x = rand() * 512, y = rand() * 512;
      ctx.strokeStyle = `rgba(${rand() > .5 ? '216,179,132' : '15,10,6'},${rand() * .16})`;
      ctx.lineWidth = rand() * 1.2 + .2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + rand() * 8, y + 30, x - rand() * 8, y + 90, x + rand() * 5, y + 180); ctx.stroke();
    }
  } else {
    const image = ctx.getImageData(0, 0, 512, 512);
    for (let i = 0; i < image.data.length; i += 4) {
      const noise = (rand() - .5) * (kind === 'fabric' ? 22 : 13);
      for (let c = 0; c < 3; c++) image.data[i + c] += noise;
    }
    ctx.putImageData(image, 0, 0);
    if (kind === 'fabric') {
      ctx.strokeStyle = '#ffffff0b'; ctx.lineWidth = .5;
      for (let i = 0; i < 512; i += 3) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
    }
  }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  return map;
}

export function screenTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 960;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#0b0b0e'; c.fillRect(0, 0, 1536, 960);
  const glow = c.createRadialGradient(1270, 420, 30, 1270, 420, 650);
  glow.addColorStop(0, '#363044'); glow.addColorStop(.55, '#17151f'); glow.addColorStop(1, '#0b0b0e');
  c.fillStyle = glow; c.fillRect(0, 0, 1536, 960);
  c.fillStyle = '#eeeef1'; c.font = '600 27px sans-serif'; c.fillText(`${profile.initials} / ${profile.name}`, 90, 80, 800);
  c.fillStyle = '#a3a2ac'; c.font = '22px sans-serif'; c.fillText('Tentang      Proyek      Kontak ↗', 1070, 80);
  c.fillStyle = '#a99edb'; c.font = '22px sans-serif'; c.fillText(`●   ${profile.role.toUpperCase()}`, 90, 230, 1300);
  c.fillStyle = '#f4f3f7'; c.font = '600 100px sans-serif';
  const headline = profile.headline.split('\n').slice(0, 2);
  const headingSize = Math.min(100, Math.floor(1300 / Math.max(...headline.map(line => c.measureText(line).width)) * 100));
  c.font = `600 ${headingSize}px sans-serif`;
  headline.forEach((line, i) => c.fillText(line, 85, 370 + i * 110));
  c.fillStyle = '#a3a2ac';
  let lines: string[] = [], introSize = 24;
  do {
    c.font = `${introSize}px sans-serif`; lines = []; let line = '';
    for (const word of profile.intro.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (c.measureText(next).width > 1300 && line) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    if (lines.length <= 2) break;
    introSize--;
  } while (introSize >= 16);
  lines.forEach((text, i) => c.fillText(text, 90, 540 + i * 30));
  c.fillStyle = '#7267b8'; c.beginPath(); c.roundRect(90, 610, 230, 65, 10); c.fill();
  c.fillStyle = '#fff'; c.font = '22px sans-serif'; c.fillText('Lihat Pengalaman ↗', 105, 652);
  c.strokeStyle = '#44414d'; c.beginPath(); c.roundRect(340, 610, 180, 65, 10); c.stroke();
  c.fillStyle = '#eee'; c.fillText('Unduh CV  ↓', 365, 652);
  c.strokeStyle = '#28262f'; c.beginPath(); c.moveTo(90, 768); c.lineTo(1446, 768); c.stroke();
  c.fillStyle = '#92909d'; c.font = '20px monospace'; c.fillText('01 / PENGALAMAN PROFESIONAL', 90, 826);
  c.fillStyle = '#eee'; c.font = '600 42px sans-serif'; c.fillText('Pengalaman Profesional', 90, 900);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}
