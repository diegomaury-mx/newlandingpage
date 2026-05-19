# Diego Maury — Portafolio Profesional

Sitio estático desplegado en **[diegomaury.mx](https://diegomaury.mx)** · LIVE desde 2026-05-13

---

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks ni build system)
- Deploy: GitHub Pages vía rama `gh-pages`
- Dominio: `diegomaury.mx` con HTTPS activo

## Estructura

```
.worktrees/build/          # Fuente de deploy (gh-pages apunta aquí)
├── index.html             # Página principal — 8 secciones
├── robots.txt
├── CNAME                  # diegomaury.mx
├── assets/
│   ├── css/styles.css     # Design System v3 "Violeta Protagonista"
│   ├── fonts/             # Satoshi Variable + JetBrains Mono (local)
│   ├── js/main.js         # Nav + scroll reveal
│   └── img/isotipodm.svg
├── cases/
│   ├── heineken.html
│   ├── innovation-systems.html
│   └── redux-incmty.html
├── portfolio/
│   ├── index.html         # Galería por eras
│   ├── portfolio.css
│   └── portfolio.js
└── cv/
    └── diego-maury-cv.pdf
```

## Desarrollo local

```bash
# Servidor local desde el worktree (fuente correcta)
cd .worktrees/build
python -m http.server 8080
```

Abrir: `http://localhost:8080`

## Deploy

```bash
# Desde la raíz del repo
npx gh-pages -d .worktrees/build
```

## Design System

Tokens definidos en `.worktrees/build/assets/css/styles.css` bajo `:root`.

| Token | Hex | Uso |
|-------|-----|-----|
| `--dm-amethyst` | `#7C3FBE` | CTA primario, identidad |
| `--dm-catalyst-700` | `#2E1547` | Hero, Contacto, Footer |
| `--dm-catalyst-900` | `#120D1A` | Fondos oscuros |
| `--dm-ember` | `#FF5C39` | Tags, highlights |
| `--dm-spark` | `#E6B800` | KPIs, métricas |
| `--dm-ink` | `#0F0A1A` | Body background |
| `--dm-bone` | `#F5F5F7` | Texto sobre oscuro |

Tipografía: Satoshi (headlines) · Inter (body) · JetBrains Mono (labels)

## Secciones de index.html

1. Hero — tag Ember, headline Satoshi 800, 2 CTAs, banda de 3 métricas
2. Selected Work — 3 proyectos en layout editorial
3. Trust Strip — logos HEINEKEN, Tec, INCmty, FEMSA, HackSureste
4. Testimonials — embed Senja activo
5. Servicios — 3 tarjetas con entregables y tiempo estimado
6. About — bio + herramientas + forma de trabajo
7. Experiencia — 4 roles en timeline vertical
8. Contacto — Calendly, email, LinkedIn

## Pendiente

- Foto real en hero (actualmente placeholder "DM")
- Recolectar testimonios en Senja (embed activo)

## Contacto

Diego Maury · [diegomaury.mx](https://diegomaury.mx) · hola@diegomaury.mx
