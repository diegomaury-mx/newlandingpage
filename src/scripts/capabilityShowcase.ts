/**
 * Interacciones del "Capability Showcase Grid" de la seccion Soporte de
 * /portfolio (y /en/portfolio): filtro exclusivo por capacidad, expansion
 * in-line por tarjeta y "cargar mas". Locale-agnostico: los textos de CTA y
 * del boton de carga viven en data-* del markup, no aqui.
 *
 * Degradacion sin JS: el SSR renderiza todas las tarjetas y descripciones
 * visibles; este script las colapsa al iniciar y toma el control.
 */
export function initShowcase(): void {
  const root = document.querySelector<HTMLElement>('section.support');
  if (!root) return;
  const grid = root.querySelector<HTMLElement>('.showcase-grid');
  if (!grid) return;

  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('.chip'));
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.showcase-card'));
  const moreBtn = root.querySelector<HTMLButtonElement>('.showcase-more');
  const remainingEl = moreBtn?.querySelector<HTMLElement>('[data-remaining]') ?? null;
  const initial = Number.parseInt(grid.dataset.initial ?? '', 10) || 9;
  const ctaOpen = grid.dataset.ctaOpen ?? 'Cerrar';
  const ctaClosed = grid.dataset.ctaClosed ?? 'Leer más +';

  let filter = '';
  let visible = initial;

  const matches = (card: HTMLElement): boolean => {
    if (!filter) return true;
    return `|${card.dataset.caps ?? ''}|`.includes(`|${filter}|`);
  };

  const apply = (): void => {
    let shown = 0;
    for (const card of cards) {
      const lead = card.querySelector<HTMLElement>('.showcase-card__lead');
      if (matches(card) && shown < visible) {
        card.hidden = false;
        shown += 1;
        if (lead) lead.textContent = filter || card.dataset.defaultLead || '';
      } else {
        card.hidden = true;
      }
    }
    const inFilter = cards.filter(matches).length;
    const rest = inFilter - Math.min(visible, inFilter);
    if (moreBtn) {
      moreBtn.hidden = rest <= 0;
      if (remainingEl) remainingEl.textContent = String(Math.max(rest, 0));
    }
  };

  const setCard = (card: HTMLElement, open: boolean): void => {
    card.setAttribute('aria-expanded', open ? 'true' : 'false');
    card.classList.toggle('is-open', open);
    const desc = card.querySelector<HTMLElement>('.showcase-card__desc');
    const link = card.querySelector<HTMLElement>('.showcase-card__link');
    const cta = card.querySelector<HTMLElement>('.showcase-card__cta');
    if (desc) desc.hidden = !open;
    if (link) link.hidden = !open;
    if (cta) cta.textContent = open ? ctaOpen : ctaClosed;
  };

  for (const card of cards) {
    setCard(card, false);
    const toggle = () => setCard(card, card.getAttribute('aria-expanded') !== 'true');
    card.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('.showcase-card__link')) return;
      toggle();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggle();
      }
    });
  }

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      filter = chip.dataset.cap || '';
      visible = initial;
      for (const other of chips) {
        const on = other === chip;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      apply();
    });
  }

  moreBtn?.addEventListener('click', () => {
    visible += initial;
    apply();
  });

  apply();
}
