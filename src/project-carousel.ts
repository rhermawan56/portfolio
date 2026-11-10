export function bindProjectCarousel(dialog: HTMLDialogElement, reducedMotion: MediaQueryList) {
  const track = document.querySelector<HTMLElement>('#project-track')!;
  const slides = Array.from(track.querySelectorAll<HTMLElement>('.project-card'));
  const previous = document.querySelector<HTMLButtonElement>('[data-carousel-prev]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-carousel-next]')!;
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-carousel-index]'));
  const counter = document.querySelector<HTMLElement>('.carousel-counter')!;
  let active = 0;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  let requested: { index: number; left: number } | null = null;
  let drag: { pointer: number; x: number; y: number; scroll: number; moved: boolean } | null = null;
  let suppressClick = false;

  function setActive(index: number) {
    active = index;
    slides.forEach((slide, i) => { slide.inert = i !== index; });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  function nearest() {
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    return slides.reduce((best, slide, i) => {
      const rect = slide.getBoundingClientRect();
      const current = slides[best].getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - center) < Math.abs(current.left + current.width / 2 - center) ? i : best;
    }, 0);
  }

  function select(index: number, instant = false) {
    if (dialog.open) return;
    clearTimeout(scrollTimer);
    index = Math.max(0, Math.min(slides.length - 1, index));
    const focusedSlide = document.activeElement?.closest('.project-card');
    if (focusedSlide && focusedSlide !== slides[index]) track.focus({ preventScroll: true });
    const rect = slides[index].getBoundingClientRect();
    const container = track.getBoundingClientRect();
    const left = track.scrollLeft + rect.left - container.left - (track.clientWidth - rect.width) / 2;
    requested = { index, left: Math.max(0, Math.min(track.scrollWidth - track.clientWidth, left)) };
    track.scrollTo({ left: requested.left, behavior: instant || reducedMotion.matches ? 'instant' : 'smooth' });
    setActive(index);
  }

  previous.addEventListener('click', () => select(active - 1));
  next.addEventListener('click', () => select(active + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));
  track.addEventListener('keydown', event => {
    const index = event.key === 'ArrowLeft' ? active - 1 : event.key === 'ArrowRight' ? active + 1 : event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : null;
    if (index === null || dialog.open) return;
    event.preventDefault(); select(index);
  });
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    // Keep the requested index during smooth navigation; native swipes settle first.
    scrollTimer = setTimeout(() => {
      if (dialog.open) return;
      if (requested) {
        if (Math.abs(track.scrollLeft - requested.left) < 2) {
          setActive(requested.index); requested = null;
        }
      } else setActive(nearest());
    }, 120);
  }, { passive: true });
  track.addEventListener('pointerdown', event => {
    requested = null;
    clearTimeout(scrollTimer);
    if (event.pointerType !== 'mouse' || event.button !== 0 || dialog.open) return;
    drag = { pointer: event.pointerId, x: event.clientX, y: event.clientY, scroll: track.scrollLeft, moved: false };
  });
  track.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) requested = null;
  }, { passive: true });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointer) return;
    if (!(event.buttons & 1)) { finishDrag(event); return; }
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      drag.moved = true; suppressClick = true;
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
    }
    if (!drag.moved) return;
    event.preventDefault(); track.scrollLeft = drag.scroll - dx;
  });
  function finishDrag(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const moved = drag.moved;
    drag = null;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (moved) select(nearest());
    // Pointerup is followed by click; suppress only the click from this drag.
    setTimeout(() => { suppressClick = false; }, 0);
  }
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('lostpointercapture', event => { if (drag?.pointer === event.pointerId) finishDrag(event); });
  track.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  new ResizeObserver(() => { if (!dialog.open) select(active, true); }).observe(track);
  reducedMotion.addEventListener('change', () => select(active, true));
  setActive(0);
}
