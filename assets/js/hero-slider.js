/* RENUEVA DECO — Carrusel del Hero: detecta qué fotos existen (.jpg/.jpeg/.png/.webp) y rota entre ellas */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const placeholder = slider.querySelector('.hero-slider-placeholder');
  const interval = Number(slider.dataset.interval) || 5000;
  const base = slider.dataset.base;
  const slots = Number(slider.dataset.slots) || 0;
  const exts = (slider.dataset.exts || 'jpg').split(',').map(s => s.trim()).filter(Boolean);
  if (!base || !slots) return;

  function preload(src) {
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = src;
    });
  }

  async function resolveSlot(n) {
    for (const ext of exts) {
      const src = `${base}${n}.${ext}`;
      if (await preload(src)) return src;
    }
    return null;
  }

  async function init() {
    const slotIndexes = Array.from({ length: slots }, (_, i) => i + 1);
    const results = await Promise.all(slotIndexes.map(resolveSlot));
    const loaded = results.filter(Boolean);
    if (!loaded.length) return;
    build(loaded);
  }

  function build(loaded) {
    if (placeholder) placeholder.remove();

    loaded.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'RENUEVA DECO — proyecto realizado';
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      slider.appendChild(slide);
    });

    if (loaded.length > 1) {
      const dots = document.createElement('div');
      dots.className = 'hero-slider-dots';
      loaded.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('is-active');
        dots.appendChild(dot);
      });
      slider.appendChild(dots);

      const slides = slider.querySelectorAll('.hero-slide');
      const dotEls = dots.querySelectorAll('span');
      let index = 0;

      setInterval(() => {
        slides[index].classList.remove('is-active');
        dotEls[index].classList.remove('is-active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('is-active');
        dotEls[index].classList.add('is-active');
      }, interval);
    }
  }

  init();
});
