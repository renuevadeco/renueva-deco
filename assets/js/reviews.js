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

/* Rotación automática: el bloque de hasta 6 tarjetas queda fijo, y cada 15s
   una tarjeta se desvanece y es reemplazada por la siguiente reseña de la
   lista (en círculo), hasta ir mostrando todas sin mover el bloque. */
const REVIEW_ROTATE_MS = 15000;
const REVIEW_FADE_MS = 500;

function initReviewRotation(shell, page, items) {
  const SLOTS = 6;
  if (items.length <= SLOTS) {
    items.forEach((review) => page.appendChild(buildReviewCard(review)));
    return;
  }

  const slotCards = items.slice(0, SLOTS).map((review) => {
    const card = buildReviewCard(review);
    page.appendChild(card);
    return card;
  });

  let nextIndex = SLOTS;
  let slotToSwap = 0;

  function swap() {
    const oldCard = slotCards[slotToSwap];
    oldCard.classList.add('is-swapping');
    setTimeout(() => {
      const newCard = buildReviewCard(items[nextIndex % items.length]);
      newCard.classList.add('is-swapping');
      page.replaceChild(newCard, oldCard);
      void newCard.offsetWidth; // fuerza el reflow para que la transición de entrada anime
      newCard.classList.remove('is-swapping');

      slotCards[slotToSwap] = newCard;
      nextIndex++;
      slotToSwap = (slotToSwap + 1) % SLOTS;
    }, REVIEW_FADE_MS);
  }

  let timer = setInterval(swap, REVIEW_ROTATE_MS);
  shell.addEventListener('mouseenter', () => clearInterval(timer));
  shell.addEventListener('mouseleave', () => { timer = setInterval(swap, REVIEW_ROTATE_MS); });
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

      grids.forEach((grid) => {
        const limit = Number(grid.dataset.reviewsLimit) || reviews.length;
        const items = reviews.slice(0, limit);

        grid.innerHTML = '';
        const shell = document.createElement('div');
        shell.className = 'reviews-shell';
        const page = document.createElement('div');
        page.className = 'review-page';
        shell.appendChild(page);
        grid.appendChild(shell);

        initReviewRotation(shell, page, items);
      });
    })
    .catch((err) => console.error('No se pudieron cargar las reseñas:', err));
});
