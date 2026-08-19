/* RENUEVA DECO — Guardar reseñas nuevas en Firestore y mostrarlas automáticamente
   (solo se listan públicamente las de 3 a 5 estrellas — ver firestore.rules.txt) */

function millis(ts) {
  return ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function buildReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card is-visible';
  const filled = Math.max(0, Math.min(5, Math.round(review.calificacion || 0)));
  const stars = '★★★★★☆☆☆☆☆'.slice(5 - filled, 10 - filled);
  card.innerHTML = `
    <div class="review-stars">${stars}</div>
    <p class="review-quote">"${escapeHtml(review.comentario)}"</p>
    <div class="review-person">
      <div class="review-avatar empty-state" style="min-height:0;padding:0;"></div>
      <div><b>${escapeHtml(review.nombre)}</b><span>Cliente RENUEVA DECO</span></div>
    </div>`;
  return card;
}

/* Carrusel automático: páginas de varias reseñas a la vez, avanza a la izquierda cada 15s */
const REVIEW_SLIDE_MS = 15000;

function initReviewCarousel(shell, track, count) {
  if (count <= 1) return;
  let index = 0;
  let timer = setInterval(advance, REVIEW_SLIDE_MS);

  function advance() {
    index = (index + 1) % count;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  shell.addEventListener('mouseenter', () => clearInterval(timer));
  shell.addEventListener('mouseleave', () => { timer = setInterval(advance, REVIEW_SLIDE_MS); });
}

/* Guarda una reseña nueva (llamado desde forms.js tras un envío exitoso) */
window.saveReviewToFirestore = function (formData) {
  if (!window.firebase || !firebase.apps || !firebase.apps.length) {
    console.error('Firebase no está inicializado: revisa assets/js/firebase-config.js');
    return;
  }
  firebase.firestore().collection('reviews').add({
    nombre: (formData.get('nombre') || '').toString().slice(0, 99),
    calificacion: Number(formData.get('calificacion')) || 0,
    comentario: (formData.get('comentario') || '').toString().slice(0, 999),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch((err) => {
    console.error('No se pudo guardar la reseña en Firestore:', err);
  });
};

/* Carga y pinta las reseñas publicadas (3-5 estrellas) en cada .reviews-grid de la página */
document.addEventListener('DOMContentLoaded', () => {
  const grids = document.querySelectorAll('.reviews-grid');
  if (!grids.length || !window.firebase || !firebase.apps || !firebase.apps.length) return;

  firebase.firestore().collection('reviews')
    .where('calificacion', '>=', 3)
    .orderBy('calificacion', 'desc')
    .limit(50)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) return; // sin reseñas todavía: se quedan las tarjetas de ejemplo

      const reviews = snapshot.docs.map((doc) => doc.data());
      // Mejor calificadas primero; entre iguales, las más recientes primero
      reviews.sort((a, b) => (b.calificacion - a.calificacion) || (millis(b.timestamp) - millis(a.timestamp)));

      const REVIEWS_PER_PAGE = 6;

      grids.forEach((grid) => {
        const limit = Number(grid.dataset.reviewsLimit) || reviews.length;
        const items = reviews.slice(0, limit);

        grid.innerHTML = '';
        const shell = document.createElement('div');
        shell.className = 'reviews-shell';
        const track = document.createElement('div');
        track.className = 'reviews-track';

        let pageCount = 0;
        for (let i = 0; i < items.length; i += REVIEWS_PER_PAGE) {
          const slide = document.createElement('div');
          slide.className = 'review-slide';
          const page = document.createElement('div');
          page.className = 'review-page';
          items.slice(i, i + REVIEWS_PER_PAGE).forEach((review) => page.appendChild(buildReviewCard(review)));
          slide.appendChild(page);
          track.appendChild(slide);
          pageCount++;
        }

        shell.appendChild(track);
        grid.appendChild(shell);
        initReviewCarousel(shell, track, pageCount);
      });
    })
    .catch((err) => console.error('No se pudieron cargar las reseñas:', err));
});
