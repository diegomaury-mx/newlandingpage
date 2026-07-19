# Changelog

All notable changes to Diego Maury Platform are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

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
