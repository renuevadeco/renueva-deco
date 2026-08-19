/* RENUEVA DECO — Filtros de portafolio (home, portafolio.html) + filtro inicial vía ?cat= en la URL */
document.addEventListener('DOMContentLoaded', () => {
  const filterBars = document.querySelectorAll('.filter-bar');
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get('cat');

  filterBars.forEach(bar => {
    const targetGridSelector = bar.dataset.target;
    const grid = targetGridSelector ? document.querySelector(targetGridSelector) : bar.nextElementSibling;
    if (!grid) return;

    const chips = bar.querySelectorAll('.filter-chip');
    const items = grid.querySelectorAll('.portfolio-item');
    const themeHost = bar.closest('[data-kids-filter]');

    function selectFilter(value) {
      const chip = Array.from(chips).find(c => c.dataset.filter === value);
      if (!chip) return;
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      items.forEach(item => {
        const match = value === 'all' || item.dataset.category === value;
        item.classList.toggle('is-hidden', !match);
      });
      if (themeHost) {
        themeHost.classList.toggle('theme-kids', value === themeHost.dataset.kidsFilter);
      }
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => selectFilter(chip.dataset.filter));
    });

    if (initialCat && Array.from(chips).some(c => c.dataset.filter === initialCat)) {
      selectFilter(initialCat);
    }
  });
});
