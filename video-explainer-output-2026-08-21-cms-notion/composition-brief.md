# Hyperframes Composition Brief: CMS con Notion · diegomaury.mx

## Objective
Create a short explainer video that teaches a technical Notion-Community viewer what the diegomaury.mx CMS is and how it actually works: content lives in Notion, not in the Astro codebase, and publishing/build is gated and automated by real rules in the code.

## Output
- Composition directory: `video-explainer-output-2026-08-21-cms-notion/composition/`
- Rendered video: `video-explainer-output-2026-08-21-cms-notion/video-explainer.mp4`
- Format: vertical 9:16 — 1080x1920
- Duration: 40 seconds (user-specified)

## Source Material
- Project root: `C:\Users\DiegoLocal\Documents\Claude\Projects\Claude_Code\newlandingpage`
- Primary files read: `docs/platform/notion-astro-contract.md`, `src/services/notionLoaders.ts`, `CLAUDE.md` §1, live SQL query against `SSOT - Portafolio Proyectos` (Notion data source `88257bc9-e575-45e8-90df-f851f96e92f2`)
- Product name: diegomaury.mx CMS (Notion → Astro pipeline)
- One-line description: A portfolio site whose content lives entirely in Notion, not in the codebase; Astro reads it at build time and Notion webhooks trigger the rebuild.
- Key mechanism to recreate: the gate rule `draft = NOT (Publicado AND Publicable)`, and the Notion → Worker (HMAC webhook) → Cloudflare Pages Deploy Hook auto-publish flow.
- Copy that must appear verbatim (on-screen text, no voiceover):
  - "diegomaury.mx está construido con Astro."
  - "Pero el contenido no vive en el código.\nVive en Notion."
  - "4 fuentes de Notion alimentan el sitio:"
  - "Casos de estudio (27 fichas publicadas)"
  - "Copy del sitio (una página, no una base)"
  - "Métricas oficiales"
  - "Imágenes"
  - "Publicar exige dos marcas:\n\"Publicado\" y \"Publicable\"."
  - `draft = NOT (Publicado AND Publicable)` — set in mono, exact string
  - "Editas en Notion.\nEl sitio se reconstruye solo."
  - "Notion es el CMS.\nAstro es el motor."

## Creative Direction
- Tone preset: `technical`
- Creative direction: audience is Notion Community — precise, spec-forward, jargon (Astro, CMS, HMAC, Deploy Hook, Zod, mono-styled rule) reads as credibility, not noise. No hype, no persuasion — this teaches the mechanism.
- Interpretation: measured pacing, confident holds on text, clean cuts (no bouncy/playful energy), a monospace treatment for the one technical rule that appears verbatim.
- What the video teaches: diegomaury.mx's content lives in 4 real Notion sources (not generic "a CMS"); publishing is gated by a real two-checkbox rule enforced in code; Notion changes trigger an automatic Cloudflare Pages rebuild via a signed webhook for 3 of the 4 sources.
- Opening frame: "diegomaury.mx está construido con Astro." — plain context, no cold open.
- Recap / close: "Notion es el CMS.\nAstro es el motor."
- Avoid:
  - Hype language, superlatives, unattributed claims
  - Abstract filler visuals (no generic gears/network/cloud clipart)
  - Any implication that ALL 4 sources trigger the webhook — only 3 do; Métricas is excluded from the webhook subscription

## Visual Identity
Design system: **"Diego Maury Design System v2.0 — Ember on Ink"**, canonical source `019dd0ff-c961-76e9-9815-68e47ca79ab8` (Claude Design), read via DesignSync 2026-08-31. Files consulted: `v2-tokens.css`, `Manual de Marca.html`, `assets/logo-pack/README.md`, logo SVGs. Do not invent colors, weights, or radii.

### Color (exact tokens)
- `--bg` `#0A0612` (Deep Ink) — background
- `--bg-2` `#1A1128` (Deep Purple) — cards, panels, hover
- `--border` `#6A291B` (Ember Dark) — separators/borders ONLY, never text
- `--t1` `#FAF8FC` / `--t2` `#DDDBE0` / `--t3` `#A8A6AC` — text primary / secondary / tertiary
- `--ember` `#FF5C39` (Electric Ember) — the single accent
- Role/subtitle italic: `#9A8CB0` (Muted Purple)
- **DO NOT USE** `--accent-secondary` Azul Medianoche `#2F6FE0` — scoped to `index.html` of the site only, forbidden in DS pieces.

### Regla cardinal (non-negotiable)
Never two live colors in the same piece. Purple is **structure and depth, never accent**. Ember appears **exactly once per piece, on the single most important element** — here applied per scene: S2 the word "Notion.", S4 the rule-card edge bar, S5 the flow connectors, S6 the brand lockup (ember facets + tagline). Section-labels/eyebrows in ember are an accepted precedent and don't count as a second accent. No gradients. No drop-shadows, glow, blur, or decorative effects — hierarchy comes from background color, border, and spacing only. `mask-image` edge fades are the only accepted exception (not used here).

### Typography (exact scale)
- Families: Plus Jakarta Sans (300/400/500/700 + italic 400) and DM Mono (400/500). Loaded from Google Fonts; Hyperframes injects deterministic @font-face at build.
- Plus Jakarta Sans: 700 headlines, 500 subtitles/labels, 400 body. Never 800 (not in the scale).
- DM Mono: data, dates, URLs, labels/eyebrows, the tagline, and the `draft = NOT (...)` rule ONLY. **Always uppercase with wide letter-spacing** (labels ~0.16em, tagline 0.18em). Never paragraphs or long headlines.
- Role/cargo line is **Plus Jakarta italic 400**; the tagline is DM Mono, NOT italic.
- Applied sizes (1080-wide vertical): eyebrow mono 24px ls .16em `--t3`; headline PJS 700 76px; sub-headline PJS 700 60–64px; source-name PJS 500 44px; rule-code DM Mono 500 31px `--t1`; recap PJS 700 60px.
- One keyword in ember per headline maximum.

### Radii / spacing / motion
- Radii scale: xs 3 (tags) · sm 6 (buttons) · md 10 (cards/panels — used for rule-card and flow nodes) · lg 16 · pill 999.
- Spacing base 4px. When in doubt, more space.
- Ease `cubic-bezier(0.16, 1, 0.3, 1)`; base duration ~200ms; `prefers-reduced-motion` block included.

### Logo assets (from the DS logo pack, staged in `composition/assets/logos/`)
- `isotipo-dark.svg` — hexagon `#FAF8FC` + ember facets; default on dark. Never recolor the facets.
- `logo-vertical-tagline-dark.svg` — brand close (S6), inlined into the composition so the SVG `<text>` picks up the page fonts. Tagline "HAGAMOS QUE LAS COSAS PASEN" in DM Mono uppercase ls, ember.
- No rotate/skew/deform, no effects, keep master proportions, 2X min clear space.

## Storyboard
Use `video-explainer-output-2026-08-21-cms-notion/video-explainer-plan.md` as the creative contract — do not deviate from its verified facts (27/30 count, 3-of-4 webhook coverage, the two-gate rule).

Scene summary:
1. Contexto — 5s — "diegomaury.mx está construido con Astro." Clean type-forward opener, subtle Astro-code texture in background (very low opacity, on-brand ink tones only, no other brand's real UI screenshots).
2. El giro — 6s — "Pero el contenido no vive en el código.\nVive en Notion." A visual transition suggesting code giving way to a content source (abstracted, not a literal Notion screenshot unless brand-safe/simple).
3. Las 4 fuentes — 8s — 4 short lines revealed in sequence: Casos de estudio (27 fichas publicadas) / Copy del sitio (una página, no una base) / Métricas oficiales / Imágenes. Four cards/icons entering one at a time, even spacing, readable hold on each.
4. El gate de publicación — 8s — "Publicar exige dos marcas: \"Publicado\" y \"Publicable\"." then the exact rule `draft = NOT (Publicado AND Publicable)` in DM Mono, presented like a real code/config line.
5. El build automático — 8s — "Editas en Notion.\nEl sitio se reconstruye solo." A simple directional flow: Notion → (signed webhook) → Cloudflare Pages rebuild. Keep it schematic, not a literal architecture diagram with logos that aren't ours to use loosely.
6. Recap — 5s — "Notion es el CMS.\nAstro es el motor." Clean closing card.

## Audio
- Audio role: sparse professional accents — subtle background bed, present but never foreground
- Audio arc: gentle presence throughout, no build-up/drop dynamics (this is an explainer, not a hype reel); slight lift going into the recap scene 6, fade out at the end
- Music: choose an appropriate subtle/ambient track from the Hyperframes-available music library; none in this repo is pre-selected — pick one fitting "clear, technical, unhurried" and copy it into `composition/assets/music/`
- Music treatment: low volume throughout (background bed posture), fade-in over scene 1, fade-out under the final 1-2s of scene 6
- Music cue guidance: detect at composition time (`analyze_music_cues.py` or `npx hyperframes beats`) if a cue source is available; timing hints are optional — legibility of the on-screen text always wins over beat alignment
- Audio-reactive treatment: none, or at most a very subtle background warmth/glow tied to RMS — never a waveform/equalizer/particle visual
- Audio-coupled moments:
  - Scene 3 card reveals — sequential entrance, ideally snapped to the beat grid if it doesn't rush reading time (4 items across 8s is already a slow cadence — don't force all 4 onto tight beats if they don't fit)
  - Scene 4 mono rule reveal — treat as the single major/strong-cue moment of the video (the "hero fact")
  - Scene 6 recap — soft resolve, music fades under it
- SFX selection guidance: minimal — a soft UI/confirm-style tick for each of the 4 source cards in scene 3, a slightly more deliberate "lock-in" sound for the mono rule reveal in scene 4, nothing else. No transition whooshes, no cinematic hits.
- SFX analysis guidance: use `skills/video-explainer/assets/sfx/sfx-analysis.md` if present for low high-frequency-risk picks, since scene 3 repeats a similar sound 4 times.
- Exact SFX choice: Hyperframes decides exact filenames/timestamps once the animation exists.
- Audio files: copy chosen music (and any SFX Hyperframes selects) into `video-explainer-output-2026-08-21-cms-notion/composition/assets/`

## Hyperframes Instructions
Use the current `hyperframes` skill and CLI workflow. Prefer native Hyperframes conventions over anything in `/video-explainer`.

Requirements:
- Show at least one real piece of material from the subject: the exact rule `draft = NOT (Publicado AND Publicable)` counts as real project material (it's the literal gate from `notionLoaders.ts`), rendered in DM Mono.
- Keep all text readable in the final render — vertical 9:16 safe margins, short line lengths (this is a phone-width composition).
- Keep total duration at 40 seconds (user-specified — not the 20-40s default range, an explicit target).
- Include the planned music/SFX layer — audio was not disabled.
- Treat the audio notes above as guidance, not a fixed cue sheet; choose SFX after the visual animation exists.
- Treat music cue metadata as optional; ignore cues that hurt readability or accuracy.
- Use at most 1-2 strong cue locks (scene 4's mono rule reveal is the natural candidate) — never more, and never at the cost of a hype-reel feel; this must stay calm and technical, not punchy.
- No hype language anywhere — this brief and the plan already remove all superlatives; do not reintroduce any.
- Do not show or imply the webhook covers all 4 Notion sources — only 3 of 4 (Métricas oficiales is excluded).
- Run Hyperframes lint and validate before render.
