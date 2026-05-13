# Portfolio UI Kit — Diego Maury

Pixel-faithful recreation of the `diegomaury.mx` portfolio. Single-page React mock built from the brand system and the portfolio spec (`newlandingpage/docs/superpowers/specs/2026-04-24-portfolio-design.md`).

## What's here

- `index.html` — entry point. Loads React + Babel + the app from `app.jsx`.
- `app.jsx` — all components: `Nav`, `Hero`, `WorkSection`, `Services`, `About`, `Contact`, `Footer`, `CaseModal`.
- `styles.css` — kit-scoped styles importing `../../colors_and_type.css` for tokens.

## Interactive behaviors (clickable mock)

- Sticky nav, smooth-scroll to sections.
- Hero CTAs and contact CTAs trigger toast messages (demo — no real form/email).
- Clicking a case row opens an in-page case-study modal with the full canonical structure (Contexto → Problema → Rol → Acciones → Resultados → Aprendizajes).
- All hover/press states match the brand: ember underline on nav, +1px lift + 0.85 opacity on buttons, +4px arrow translate on work rows, border-color step on cards.

## Coverage

Sections: Hero (with metrics band) · Selected Work (3 cases) · Servicios (3 cards) · About (bio + chips + how) · Contacto (3 cards) · Footer (tricolor bar + tagline).

## Caveats

- The HEINEKEN, Innovation Systems, and REDUX case content is reconstructed from the portfolio spec and brand-hub references. Specific numbers, dates, and phrasing should be verified against Diego's source materials before publishing.
- The portfolio site at `diegomaury.mx` was not yet implemented when the spec was written — this UI kit *is* the first pixel-realization of that spec, faithful to its tokens and copy.
- The case modal is an interactive shortcut; the production spec calls for separate `/cases/*.html` pages.
