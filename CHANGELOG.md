# Changelog

All notable changes to Diego Maury Platform are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — 2026-09-09

### Added

- **Quinta fuente de Diego CMS: agenda pública `/eventos` (+ `/en/events`).**
  - Colección `events` con loader (`eventsLoader` en `src/services/notionLoaders.ts`) sobre la base "📆 Meetups y Eventos" (`collection://7c2e4e81…`). Filtro: `Publicación = Publicado` Y fecha de fin/inicio `>= hoy` en `America/Mexico_City`. Sin `Enlace Oficial` no hay tarjeta. No lee el body de las páginas.
  - Whitelist Zod `.strict()` (`makeEventDataSchema` en `src/services/notionEvents.ts`), espejo de la sección 8.2 del "Pipeline de Eventos · Data Contract v2". Propiedad fuera de la lista = build roto a propósito. 16 tests nuevos.
  - `Sede` (tipo `place`) omitida en v1 (la API de Notion no la expone de forma estable).
  - Página `src/pages/eventos.astro` + `src/pages/en/events.astro` con componente `EventsAgenda.astro`: vistas Esta semana / Próximos 30 días / Próximos 60 días / Calendario + filtro Por categoría (chips), CTA "Sugerir un evento" al formulario público, estado vacío, CTA de cierre. DS V2 "Ember on Ink".
  - `Resumen` es el único campo traducido a EN (DeepL, `en.summary`, fallback ES). El resto de la data no se traduce en v1.
  - Enlazada desde el footer (ES y EN) y el sitemap. Header pendiente de QA visual.
  - `src/pages/llms.txt.ts`: sección "Eventos (agenda pública)".
  - Contrato: `docs/platform/notion-astro-contract.md` sección 5.
  - CTA "Sugerir un evento" → `https://diegomaury.notion.site/8bc145de…` (Notion Site pública del formulario).
  - **Pendiente de Diego:** (1) compartir la base con la integración "Diego CMS" — el build de producción falla hasta esto; (2) alta en la suscripción de webhooks de `notion-deploy-relay`.

## [v0.1.0] — 2026-06-27

### Architecture Decisions

- **Framework:** Astro selected as primary framework. Rationale: Islands Architecture, HTML static output, MDX support for editorial content, GitHub Pages compatible, zero-JS default.
- **Deployment:** GitHub Pages serving from `master` branch root. GitHub Actions will handle `astro build` → `/dist` in Sprint 1.
- **Content strategy:** Astro Content Collections for full decoupling of content from presentation. Content lives in `src/content/`, never inside page files.
- **Design System:** DS v2 handoff (`_ds_import/`) + DS v3 tokens (`assets/css/`) will be consolidated into a single canonical token system in Sprint 2. No DS work before Sprint 0 PRD approval.
- **CSS approach:** Design tokens via CSS custom properties. Tailwind available if needed in Sprint 1, not mandatory.
- **Analytics:** GTM-NHT5827J + Microsoft Clarity (x7ns7c22xi) preserved in all pages.

### Roles Defined

| Role | Responsible | Answers |
|------|------------|---------|
| Product Owner | Diego Maury | What is the vision and priority? |
| Product Strategist & UX Director | ChatGPT | What should we build and why? |
| Product Manager | Silvia (Notion) | What is the current state of the project? |
| Lead Software Engineer | Claude Code | How should it be implemented? |

### Workflow Approved

```
Idea
→ Strategic Analysis (ChatGPT)
→ Documentation (Silvia / Notion)
→ Approval (Diego)
→ Implementation (Claude Code)
→ UX & Conversion Review (ChatGPT)
→ Corrections
→ Release
→ Version Documentation (Silvia)
```

### Roadmap

| Sprint | Title | Owner | Status |
|--------|-------|-------|--------|
| Sprint 0 | Product Foundation | ChatGPT + Silvia + Diego | In Progress (PRD approved 2026-07-20; 7 of 8 deliverables remain) |
| Sprint 0.5 | Domain & Content Architecture | Claude Code | In Progress |
| Sprint 1 | Astro Setup + Design Tokens + Component Architecture | Claude Code | Blocked on Sprint 0 |
| Sprint 2 | Design System | Claude Code | Blocked on Sprint 1 |
| Sprint 3 | Home | Claude Code | Blocked on Sprint 2 |
| Sprint 4 | Internal Pages (7) | Claude Code | Blocked on Sprint 3 |
| Sprint 5 | Optimization | Claude Code | Blocked on Sprint 4 |

### Sprint 0 — Required Deliverables (not Claude Code's responsibility)

**Estado:** In Progress. Sprint 1 remains blocked.

- [x] PRD — approved 2026-07-20.
- [ ] Information Architecture
- [ ] Definitive Sitemap
- [ ] Navigation structure
- [ ] User Journeys
- [ ] High-level Wireframes
- [ ] Design Principles
- [ ] Domain Model approval

**Sprint 1 start gate:** all eight deliverables must be delivered and approved by Diego. PRD approval alone does not unblock Sprint 1. The Notion backlog (PRD, Product Vision, Roadmap, Sitemap draft) does not by itself represent this full gate — Product Vision and Roadmap are useful artifacts, but they don't substitute for the seven remaining criteria.

### Sprint 0.5 — Completed Deliverables

- [x] CHANGELOG.md initialized
- [x] Astro Content Collections schemas (`src/content/config.ts`)
- [x] Content architecture (`src/content/cases|projects|playbooks|insights|services/`)
- [x] README.md per content folder
- [x] SEO Model documentation (`docs/platform/seo-model.md`)
- [x] Conventions documentation (`docs/platform/conventions.md`)

### 2026-07-28 — Public pages mapping

- Added `docs/published-pages-map.md`, `docs/published-pages-map.json`, and `docs/published-pages-map.csv` mapping published URLs to repository source files. Use these artifacts to trace where a live page is authored and for validation/automation tasks.

### 2026-07-28 — Published assets report

- Added `docs/published-assets-report.json` and `docs/published-assets-report.csv` listing all assets under `public/` grouped by type (html, js, css, fonts, images, data). These files help audits, CDN syncs, and CI validation.


### Definition of Done

A sprint is considered complete only when all of the following are true:

1. All sprint objectives completed
2. Corresponding documentation updated
3. Product Owner approved all deliverables
4. UX and architecture validated by ChatGPT
5. No critical technical debt introduced
6. Version registered in this CHANGELOG

### Principles

1. La Home vende una conversación, no toda la historia.
2. Cada página responde una única pregunta.
3. La evidencia pesa más que las afirmaciones.
4. La propiedad intelectual es un activo estratégico.
5. Los sistemas son más importantes que las herramientas.
6. La IA es una capacidad transversal, no el producto.
7. El sitio debe seguir siendo válido dentro de cinco años.
8. Todo componente debe ser reutilizable.
9. Toda página debe tener un objetivo medible.
10. La simplicidad siempre vence a la complejidad innecesaria.
