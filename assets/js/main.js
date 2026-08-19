/* RENUEVA DECO — Núcleo: navegación, scroll reveal, parallax, utilidades globales */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== Galería de producto: miniaturas que cambian la foto principal ===== */
  document.querySelectorAll('.product-thumbs').forEach(thumbs => {
    const mainImg = document.querySelector('.product-gallery-main img');
    if (!mainImg) return;
    thumbs.querySelectorAll('.product-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        if (thumb.dataset.full) mainImg.src = thumb.dataset.full;
        thumbs.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  });

  /* ===== Header: estado al hacer scroll ===== */
  const header = document.querySelector('.site-header');
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ===== Menú móvil ===== */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const willOpen = !mobileDrawer.classList.contains('is-open');
      mobileDrawer.classList.toggle('is-open', willOpen);
      navToggle.classList.toggle('is-active', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      document.body.classList.toggle('no-scroll', willOpen);
    });
    mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      const group = el.closest('[data-reveal-group]');
      const delay = el.dataset.revealDelay || (group ? (i % 6) * 0.08 : 0);
      el.style.setProperty('--reveal-delay', `${delay}s`);
      revealObserver.observe(el);
    });
  }

  /* ===== Parallax suave en formas del hero ===== */
  const heroShapes = document.querySelectorAll('.hero-shape');
  if (heroShapes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroShapes.forEach((shape, i) => {
        const factor = i % 2 === 0 ? 0.12 : -0.09;
        shape.style.transform = `translateY(${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* ===== Botón volver arriba ===== */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ===== Año dinámico en footer ===== */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});
