// ── Portfolio: era index activo + scroll-to ──

const eraItems    = document.querySelectorAll('.pf-index__item');
const eraButtons  = document.querySelectorAll('.pf-index__btn');
const eraSections = document.querySelectorAll('.pf-era');

function setActiveEra(eraId) {
  eraItems.forEach(item => {
    const isActive = item.dataset.era === eraId;
    item.classList.toggle('is-active', isActive);
    const btn = item.querySelector('.pf-index__btn');
    if (btn) btn.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

eraButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const eraObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveEra(entry.target.id);
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

eraSections.forEach(section => eraObserver.observe(section));
