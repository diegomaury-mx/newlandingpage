// ── Nav: burger toggle + active link por scroll ──

const nav      = document.getElementById('nav');
const burger   = nav.querySelector('.nav__burger');
const navLinks = nav.querySelector('.nav__links');
const links    = nav.querySelectorAll('.nav__link');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('is-active'));
      const active = nav.querySelector(`[href="#${entry.target.id}"]`);
      if (active) active.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ── Scroll Reveal ──

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });
}
