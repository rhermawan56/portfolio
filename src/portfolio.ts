import { bindProjectCarousel } from './project-carousel';
import { profile } from './content';
import { cvFilename, cvUrl } from './cv';

export const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function projectArt(kind: string) {
  if (kind === 'shipping') return '<div class="device-preview"><span>LOGISTICS / VALIDATION</span><div class="shipping-phone"><div class="concept-code"><i></i><i></i><i></i></div><b>QR</b></div><div class="shipping-document"><b>SURAT JALAN</b><i></i><i></i><i></i><span>✓</span></div></div>';
  if (kind === 'weighing') return '<div class="device-preview"><span>DEVICE / INTEGRATION</span><div class="scale-platform"><div></div></div><div class="scale-display"><b>HASIL TIMBANG</b><span>DATA / API</span><i></i><i></i></div><div class="scale-cable"></div></div>';
  if (kind === 'erp') return '<div class="mini-dashboard"><div class="dashboard-side"><i></i><i></i><i></i><i></i></div><div class="dashboard-main"><b>Enterprise / ERP</b><div class="dashboard-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="dashboard-rows"><i></i><i></i><i></i></div></div></div>';
  if (kind === 'planning') return '<div class="planning-preview"><span>PRODUCTION / PLANNING</span><div class="planning-scale"><i></i><i></i><i></i><i></i><i></i></div><div class="planning-row"><b>01</b><i></i></div><div class="planning-row"><b>02</b><i></i></div><div class="planning-row"><b>03</b><i></i></div><div class="planning-row"><b>04</b><i></i></div></div>';
  return '<div class="attendance-preview"><span>HR / ATTENDANCE</span><div class="attendance-profile"><i>RH</i><div><b>FingerSpot API</b><small>INTEGRATION</small></div><em>↗</em></div><div class="attendance-calendar">' + Array.from({ length: 28 }, (_, i) => `<i class="${i % 7 < 5 ? 'day-active' : ''}"></i>`).join('') + '</div><div class="attendance-line"><i></i><i></i><i></i></div></div>';
}

export function portfolioMarkup() {
  return `<div class="portfolio-inner">
    <nav class="portfolio-nav" aria-label="Navigasi portofolio"><a href="#portfolio" class="personal-brand"><span class="monogram">${profile.initials}</span>${profile.name}<span class="brand-dot">.</span></a><div class="nav-links"><a href="#tentang">Tentang</a><a href="#proyek">Proyek</a><a href="#kontak">Kontak ${external}</a></div></nav>
    <section class="portfolio-hero" aria-labelledby="profile-title">
      <div class="hero-orbit" aria-hidden="true"><div></div><div></div><div></div></div>
      <p class="eyebrow"><span class="status-dot"></span> ${profile.role}</p>
      <h1 id="profile-title" tabindex="-1">${profile.headline.replace('\n', '<br>')}</h1>
      <div class="hero-description hero-intro">${profile.intro.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}</div>
      <p class="profile-facts"><span>${profile.experienceLabel}</span><span>${profile.location}</span></p>
      <div class="hero-actions"><a class="button primary" href="#pengalaman">Lihat Pengalaman ${arrow}</a><a class="button secondary" id="download-cv" href="${cvUrl}" download="${cvFilename}">Unduh CV <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v12m-4-4 4 4 4-4M5 18v3h14v-3" stroke="currentColor" stroke-width="1.5"/></svg></a></div>
      <div class="hero-bottom"><span>PENGALAMAN · PROYEK · KEAHLIAN</span><a href="#pengalaman">Scroll untuk melihat pengalaman <span>↓</span></a></div>
    </section>
    <section id="pengalaman" class="experience-section" aria-labelledby="experience-title"><div><p class="eyebrow">01 / PENGALAMAN PROFESIONAL</p><h2 id="experience-title">Pengalaman Profesional</h2></div><div class="experience-list">${profile.experience.map(job => `<article class="experience-entry"><div class="experience-meta"><span class="experience-period">${job.period}</span><h3>${job.company}</h3><p class="experience-role">${job.role}<br>${job.location}</p></div><ul>${job.responsibilities.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section id="proyek" class="projects-section" aria-labelledby="projects-title"><div class="section-heading"><div><p class="eyebrow">02 / PROYEK</p><h2 id="projects-title">Proyek yang Pernah Dikerjakan</h2></div><span class="section-note">Peran, kontribusi, dan teknologi.</span></div>
      <div class="project-carousel" role="region" aria-roledescription="carousel" aria-label="Proyek yang pernah dikerjakan">
        <div class="project-grid carousel-track" id="project-track" tabindex="0" aria-label="Geser proyek atau gunakan tombol panah">${profile.projects.map((p, index) => `<article class="project-card" role="group" aria-roledescription="slide" aria-label="${index + 1} dari ${profile.projects.length}: ${p.title}" ${index ? 'inert' : ''}><div class="project-art art-${p.kind}" aria-hidden="true">${projectArt(p.kind)}<span class="art-index">${p.number} / SKEMA KONSEP</span></div><div class="project-copy"><div class="project-meta"><span>${p.category}</span><span>${p.year}</span></div><h3>${p.title}</h3><p class="project-summary">${p.summary}</p><p class="project-stack">${p.stack.slice(0, 3).join(' · ')}</p><button type="button" class="button secondary project-details" data-project="${p.number}" aria-label="Lihat detail ${p.title}">Lihat detail ${external}</button></div></article>`).join('')}</div>
        <div class="carousel-controls"><div class="carousel-arrows"><button type="button" data-carousel-prev aria-label="Proyek sebelumnya" aria-controls="project-track" disabled>←</button><button type="button" data-carousel-next aria-label="Proyek berikutnya" aria-controls="project-track">→</button></div><div class="carousel-dots" aria-label="Pilih proyek">${profile.projects.map((p, i) => `<button type="button" data-carousel-index="${i}" aria-label="Tampilkan proyek ${p.title}" aria-controls="project-track" ${i === 0 ? 'aria-current="true"' : ''}><span></span></button>`).join('')}</div><p class="carousel-counter" aria-live="polite" aria-atomic="true">01 / ${String(profile.projects.length).padStart(2, '0')}</p></div>
      </div>
      <p class="project-illustration-note">Ilustrasi proyek berupa skema konsep, bukan tangkapan layar aplikasi.</p>
    </section>
    <section id="tentang" class="about-section" aria-labelledby="about-title"><div><p class="eyebrow">03 / PROFIL & KEAHLIAN</p><h2 id="about-title">Tentang Saya &amp; Keahlian</h2><div class="education-block"><p class="eyebrow">PENDIDIKAN</p><h3>${profile.education.degree}</h3><p>${profile.education.institution}<br>${profile.education.location}</p></div><div class="education-block"><p class="eyebrow">PELATIHAN &amp; SERTIFIKASI</p><ul class="training-list">${profile.training.map(item => `<li>${item}</li>`).join('')}</ul></div><div class="education-block"><p class="eyebrow">PROYEK PRIBADI</p><h3>${profile.personalProject.title}</h3><p>${profile.personalProject.description}</p><a class="personal-project-link" href="${profile.personalProject.url}" target="_blank" rel="noopener noreferrer">Repository landing page ${external}</a></div></div><div class="about-copy"><p>${profile.about}</p><div class="skill-groups">${profile.skillGroups.map(g => `<div class="skill-group"><h3>${g.title}</h3><div class="skill-list">${g.items.map(s => `<span>${s}</span>`).join('')}</div></div>`).join('')}</div></div></section>
    <section id="kontak" class="contact-section" aria-labelledby="contact-title"><p class="eyebrow">04 / KONTAK</p><h2 id="contact-title">Hubungi Saya</h2><p class="hero-description contact-location">Untuk membahas pengalaman kerja dan posisi yang relevan, hubungi saya melalui email atau LinkedIn.</p><p class="contact-location">${profile.location}</p><div class="contact-links"><a class="button primary" href="mailto:${profile.email}">Hubungi via Email ${arrow}</a><a class="text-link" href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${external}</a><a class="text-link" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${external}</a></div><a class="contact-email" href="mailto:${profile.email}">${profile.email}</a></section>
    <footer class="portfolio-footer"><a href="#portfolio">${profile.name}<span> / Ruang Karya</span></a><span>Portofolio profesional · Rizky Hermawan</span><button id="replay" type="button">Kembali ke ruangan ↗</button></footer>
    <dialog id="project-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><button class="dialog-close" aria-label="Tutup detail proyek">×</button><p class="eyebrow" id="dialog-category"></p><h2 id="dialog-title"></h2><div id="dialog-description"></div><div class="skill-list" id="dialog-stack"></div><div id="dialog-link"></div></dialog>
  </div>`;
}

export function bindPortfolio() {
  const dialog = document.querySelector<HTMLDialogElement>('#project-dialog')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  bindProjectCarousel(dialog, reducedMotion);
  let opener: HTMLButtonElement | null = null;
  const closeDialog = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (reducedMotion.matches) { dialog.close(); return; }
    dialog.classList.add('is-closing');
  };
  dialog.addEventListener('animationend', event => {
    if (event.target === dialog && event.animationName === 'project-dialog-out') dialog.close();
  });
  dialog.addEventListener('close', () => {
    // A queued close event must not reset a dialog that has already reopened.
    if (!dialog.open) {
      dialog.classList.remove('is-closing');
      opener?.focus({ preventScroll: true });
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && dialog.classList.contains('is-closing')) dialog.close();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => {
    if (dialog.open) return;
    opener = button;
    if (!reducedMotion.matches) button.closest('.project-card')!.querySelector('.project-art')!.animate(
      [{ scale: '1' }, { scale: '0.985', offset: 0.45 }, { scale: '1' }],
      { duration: 150, easing: 'ease-out' },
    );
    const project = profile.projects.find(p => p.number === button.dataset.project)!;
    document.querySelector('#dialog-category')!.textContent = project.category;
    document.querySelector('#dialog-title')!.textContent = project.title;
    const paragraphs = project.description.split(/(?<=\.)\s+(?=Mengoptimalkan|Memasang|Menguji|Menerapkan)/);
    document.querySelector('#dialog-description')!.replaceChildren(...paragraphs.map(text => {
      const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph;
    }));
    const stack = document.querySelector('#dialog-stack')!;
    stack.replaceChildren(...project.stack.map(tech => { const span = document.createElement('span'); span.textContent = tech; return span; }));
    const linkContainer = document.querySelector('#dialog-link')!;
    linkContainer.replaceChildren();
    if (project.url) { const link = document.createElement('a'); link.href = project.url; link.textContent = 'Kunjungi proyek ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer'; linkContainer.append(link); }
    dialog.classList.remove('is-closing');
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  dialog.querySelector('button')!.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(); } });
}
