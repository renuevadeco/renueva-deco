/* RENUEVA DECO — Modal "Dejar una Reseña" + selector de estrellas */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  const openBtns = document.querySelectorAll('[data-open-review-modal]');
  const closeBtns = overlay.querySelectorAll('[data-close-review-modal]');

  function openModal() {
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal(); });

  /* ===== Selector de estrellas ===== */
  const starWidget = overlay.querySelector('.star-rating');
  if (!starWidget) return;

  const stars = Array.from(starWidget.querySelectorAll('button'));
  const ratingInput = document.getElementById(starWidget.dataset.input);
  let selected = 0;

  function paint(value) {
    stars.forEach(star => star.classList.toggle('is-filled', Number(star.dataset.value) <= value));
  }

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => paint(Number(star.dataset.value)));
    star.addEventListener('click', () => {
      selected = Number(star.dataset.value);
      if (ratingInput) {
        ratingInput.value = String(selected);
        const field = ratingInput.closest('.field');
        if (field) field.classList.remove('has-error');
      }
      paint(selected);
    });
  });

  starWidget.addEventListener('mouseleave', () => paint(selected));

  overlay.querySelectorAll('[data-form-reset]').forEach(btn => {
    btn.addEventListener('click', () => {
      selected = 0;
      if (ratingInput) ratingInput.value = '';
      paint(0);
    });
  });
});
