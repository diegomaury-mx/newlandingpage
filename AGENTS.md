# Repository Guidelines

## Project Structure & Source Of Truth

This repository powers `diegomaury.mx`, an Astro portfolio deployed from `dist/` by GitHub Actions. Active Astro source lives in `src/`: pages in `src/pages/`, layouts in `src/layouts/`, components in `src/components/`, styles in `src/styles/`, and Notion/content utilities in `src/services/` and `src/utils/`. Static files copied directly to output live in `public/`. Legacy root HTML and `assets/` remain in the repo for reference and compatibility; check `README.md` and `CLAUDE.md` before changing them.

The canonical operational source of truth is Notion, not repo-only notes. `CHANGELOG.md` is a technical mirror; the canonical changelog is Notion's **Changelog - Portafolio D**.

## Build, Test, And Development Commands

- `npm install`: install dependencies.
- `npm run dev`: start local Astro development.
- `npm run build`: build the production site into `dist/`.
- `npm run preview`: preview the built site.
- `npm run lint`: run Stylelint and HTMLHint.
- `npm run cms:smoke`: smoke-test Notion CMS loading.
- `npm run test:a11y` / `npm run test:a11y:astro`: run Playwright accessibility checks.
- `npm run verify:visual` / `npm run verify:visual:astro`: run visual QA.

## Coding Style & Naming

Use TypeScript/ES modules for Astro-side code and vanilla CSS/JS for the frontend. Follow existing two-space indentation and local patterns. CSS class names should be lowercase BEM-style tokens such as `case-card`, `case-card__title`, or `case-card--featured`. Do not hardcode CMS-owned copy or metrics when a Notion loader owns the data.

## Notion Registration Workflow

For any relevant published change, register work in this order. Do not skip the Inbox.

1. Create an entry in **Portafolio D - Claude Inbox** with `Estado de procesamiento = Pendiente`. Minimum fields: `Payload` and `Tipo de evento`.
2. Create the canonical entry in **Changelog - Portafolio D** and link it from the Inbox property `Changelog creado`. Then mark the Inbox entry `Procesado`.
3. Create or link the corresponding task in **Tareas y Misiones** from the Changelog.

Use exact Notion property names and option values. Do not invent fields, simplify relation names, or create loose pages outside the listed databases.

## What Requires Changelog

Always create a Changelog entry for production changes to copy, data, design, structure, SEO/llms, infrastructure, documentation, or published evidence. Corrections to metrics, claims, or evidence must state the documentary source used. Record agent lessons learned with `Componente = Lecciones Aprendidas` and `Sección = General`.

Minor local experiments and drafts do not need a Changelog entry, but real follow-up work must be reflected in a task.

## Changelog Fields

Fill these properties in **Changelog - Portafolio D**:

- `Cambio`: short commit-style title.
- `Fecha`: publication date in `YYYY-MM-DD`.
- `Componente`: one of `Copy`, `Datos y evidencia`, `Diseño`, `Estructura`, `SEO / llms`, `Infraestructura`, `Documentación`, `Lecciones Aprendidas`.
- `Sección`: one or more of `Hero`, `Casos`, `Servicios`, `About`, `Testimonios`, `Editorial`, `Contacto`, `llms.txt`, `General`.
- `Razón`: why the change was made.
- `Impacto`: effect on the site or positioning.
- `Tareas y Misiones`: link the task for this changelog.

## Task Rules

Every Changelog entry gets its own task in **Tareas y Misiones**. Create it manually; Changelog task automations are disabled. Use `Nombre de tarea = Documentar cambio: <título del cambio>`, `Prioridad = Media` by default, and link it to **Portafolio D** through `Proyectos, Ideas y Locuras de Diego`.

A task belongs to only one Changelog entry. Before linking an existing task, verify its `Changelog - Portafolio D` relation is empty. Close completed same-session work as `Terminada`; use `En proceso` or `Bloqueada` only when that reflects reality.

## Documentation Rules

Project documentation lives in **Diego Maury WIKI** and is linked to **Portafolio D** through `Proyecto`. Never create documentation as loose top-level pages or task subpages. Minimum document properties: `Página`, `Proyecto`, `Etiquetas`, `Rol del documento`, and `Categoría P.A.R.A`.

If copy or published data changes, verify against the project SSOT documents and current canonical sources first. Claims without documentary support must not be published.

## CMS Sources

The site builds from four Notion CMS sources:

- **SSOT - Portafolio Proyectos**: `/portfolio/<slug>` cards and case pages.
- **Copy Oficial - diegomaury.mx (SSOT)**, `Versión Actual`: Home S1-S8, SEO, footer copy.
- **Métricas oficiales - Portafolio D**: `metrica:slug` placeholders.
- **CMS Imágenes - Portafolio D**: fixed photos/logos when slot `Estado = Listo`.

Publishing requires a rebuild. Editing Notion alone does not update the live site; push to `master` or run the GitHub Actions deploy workflow.

## Guardrails

A case appears only with `Estado publicación = Publicado`. `Capa = Insignia` also requires verified `Métrica ancla` and `Evidencia`; missing values should block publishing, not be invented. In Copy Oficial, preserve the `# S<n> ·` section heading pattern because parsers depend on it.

## Key Notion IDs

Use Data Source IDs for MCP/API writes:

- Claude Inbox: `collection://4b69a236-ede8-48a8-9354-7b5b6dd699ca`
- Changelog: `collection://652b68c7-9cf5-441c-957c-f18b055db8b8`
- Tareas y Misiones: `collection://3190fe3c-51c5-8074-a302-000b97e8a410`
- Diego Maury WIKI: `collection://20d0fe3c-51c5-805b-8134-000b3f7d5fac`
- Proyectos de Diego: `collection://fcfda06c-0b4b-4488-9c4d-9378d15614cf`

Reference guide: `8b47026a-4a82-43ba-9043-1c0424338d14`.
