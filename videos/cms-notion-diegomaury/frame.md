---
version: alpha
name: Ember on Ink — Frame (video / frame layer)
description: >
  Video-first companion to Diego Maury's real production design system ("Ember on Ink" V2),
  hand-authored from the live tokens — NOT a remixed third-party preset. The unit is the frame
  (1080x1920 primary for this project). Atoms are the real site's: Deep Ink background, a single
  Electric Ember accent per frame, hairline borders (never drop-shadows/glow/gradients except the
  two approved exceptions), Plus Jakarta Sans for all display/body + DM Mono for labels/code/units,
  the real radius scale (0/3/6/10/16/pill), the real spacing scale, and the real isotipo-ember
  brand mark. Composition is free; these atoms are sacred.
unit: the frame — 1080×1920 primary (this project is vertical-only)
principle: atoms are sacred (site tokens) · composition is free · never invent a color/radius/font not listed here

colors:
  bg:        "#0A0612"   # Deep Ink — base ground, always
  bg-2:      "#1A1128"   # Surface — cards, panels, the code-surface base
  border:    "#6A291B"   # Hairline borders and separators
  t1:        "#FAF8FC"   # Primary text/headline
  t2:        "#DDDBE0"   # Secondary text
  t3:        "#A8A6AC"   # Tertiary/supporting text
  ember:     "#FF5C39"   # Electric Ember — the ONE accent per frame, never a headline color
  ember-cta: "#BF452B"   # Ember darkened — the only valid solid-fill use of ember (meets 4.5:1 AA)

borders: { hairline: "1px solid {colors.border}", hairline-soft: "1px solid {colors.border}@50%" }
shadows:
  none: "none"
  elevated: "0 20px 50px -18px rgba(0,0,0,0.6)"
  # OVERRIDE 2026-08-22: for the "CMS con Notion" reel specifically, Diego asked to bring back
  # the floating-card depth treatment from the project's prior iteration (video-v2.mp4, built
  # with faceless-explainer) while keeping this version's real script/screenshots/timing. This
  # is a deliberate, scoped exception to the site's real "hairline only, no shadow" rule — it
  # applies ONLY to this video asset's card/panel/chip surfaces, never to the live site's CSS.
  # Use `elevated` alongside the hairline border (never instead of it) on any raised surface.

typography:
  # Plus Jakarta Sans: all display + body + UI. DM Mono: labels/kickers/units/code — uppercase for
  # labels (0.16em tracking), never for paragraphs.
  body:        { fontFamily: "Plus Jakarta Sans", cqw: 1.5,  weight: 400, lineHeight: 1.5 }
  lead:        { fontFamily: "Plus Jakarta Sans", cqw: 2.08, weight: 400, lineHeight: 1.5 }
  card-title:  { fontFamily: "Plus Jakarta Sans", cqw: 2.3,  weight: 500, lineHeight: 1.25, tracking: "-0.005em" }
  button:      { fontFamily: "Plus Jakarta Sans", cqw: 1.46, weight: 500, lineHeight: 1.0 }
  label-mono:  { fontFamily: "DM Mono", cqw: 1.35, weight: 500, tracking: "0.16em", upper: true }
  role-mono:   { fontFamily: "DM Mono", cqw: 1.1,  weight: 500, tracking: "0.04em" }
  code:        { fontFamily: "DM Mono", cqw: 1.67, weight: 400, lineHeight: 1.6 }
  number-unit: { fontFamily: "DM Mono", cqw: 2.08, weight: 500, lineHeight: 1.0 }
  # Display ramp — Plus Jakarta Sans, weight 400/500 body-adjacent, 700 for hero-scale only
  # (D4: any headline whose clamp maximum exceeds ~48px uses weight 300; the rest of the scale
  # tops out at 700 — this project's hero lines sit in the headline/display tier below, weight 500).
  headline:    { fontFamily: "Plus Jakarta Sans", cqw: 4.6, weight: 500, lineHeight: 1.06, tracking: "-0.01em" }
  display:     { fontFamily: "Plus Jakarta Sans", cqw: 6.5, weight: 300, lineHeight: 1.02, tracking: "-0.015em" }

spacing:
  space-1: "0.42cqw"   # 4px @960 reference — scale by canvas
  space-2: "0.83cqw"   # 8px
  space-3: "1.25cqw"   # 12px
  space-4: "1.67cqw"   # 16px
  space-6: "2.5cqw"    # 24px
  space-8: "3.33cqw"   # 32px
  space-10: "4.17cqw"  # 40px
  slide-pad: "4.2cqw"
  radius-0: "0px"
  radius-xs: "3px"    # badges/tags
  radius-sm: "6px"    # buttons/inputs
  radius-md: "10px"   # cards/panels
  radius-lg: "16px"   # modales/hero cards
  radius-pill: "9999px"

components:
  ember-bar-top:
    rule: "absolute top:0 left:0 right:0 height:3px background:{colors.ember}"
    description: "The real site's top accent bar — a 3px ember rule along a card/panel's top edge. One of the few sanctioned uses of ember as a solid fill (it is a rule, not a headline)."
  ember-bar-left:
    rule: "absolute left:0 top:0 bottom:0 width:3px background:{colors.ember} border-radius:2px"
    description: "Same motif, vertical — a 3px ember rule down a panel's left edge."
  card-hairline:
    backgroundColor: "{colors.bg-2}"
    border: "{borders.hairline}"
    rounded: "{spacing.radius-md}"
    shadow: "none — {shadows.elevated} only in the scoped 2026-08-22 v2-parity override above"
    typography: "{typography.card-title} + {typography.body}"
    description: "The real card surface: bg-2 fill, 1px hairline border in {colors.border}, radius-md (10px). No shadow, no gradient, ever, EXCEPT this reel's scoped override, which adds {shadows.elevated} on top of the same hairline border (never a shadow-only surface)."
  label-mono-tag:
    typography: "{typography.label-mono}"
    color: "{colors.t3} (or {colors.ember} for label-ember variant)"
    description: "The real site's eyebrow/kicker: DM Mono, uppercase, 0.16em tracking, small size. No ✱ mark or other invented glyph — the real site uses plain mono labels only."
  lockup:
    layout: "flex row, gap {spacing.space-3}, a 1px {colors.border} vertical divider between name and role"
    typography: "name = 15px Plus Jakarta Sans 700 uppercase 0.005em; role = {typography.role-mono} in {colors.t2}"
    description: "The real site's identity lockup pattern (used for brand/name + role pairs) — reuse this shape whenever a frame needs to pair a name/label with a role/descriptor, e.g. a station name + its function."
  code-surface:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.t1} (DM Mono); the single ember accent may land on ONE token inside (e.g. an operator)"
    border: "{borders.hairline}"
    rounded: "{spacing.radius-md}"
    description: "The real site's dark code/mono surface — same bg-2 fill as any other card (this system has no separate third 'navy' surface), same hairline, same radius-md. The code itself is DM Mono."
  brand-mark:
    asset: "public/brand/isotipo-ember.svg (icon) or public/brand/logo-horizontal-dark.svg (lockup)"
    description: "The REAL brand mark — use verbatim, never redrawn or approximated. Use the isotipo alone at small sizes (nav/footer scale); the horizontal lockup when a fuller brand moment is wanted (e.g. the recap frame)."
  notion-mark:
    asset: "public/brand/notion-icon.svg"
    description: "Notion's own official glyph (simple-icons, open-source, monochrome path). Recolor via CSS fill (currentColor) to {colors.t1} on dark, or {colors.ember} for the one accent moment. Use this glyph instead of the plain word 'Notion' whenever a compact, recognizable mark reads better than text — e.g. a station node, a source-card icon, a small inline reference. Do not invent a colorful Notion logo variant; this is the correct monochrome brand-safe mark for a dark UI."
---

# Ember on Ink — Frame (video / frame layer)

## Overview

This is Diego Maury's real, live production design system, transcribed directly from
`src/styles/variables.css` and `CLAUDE.md` — not a third-party preset remixed onto brand colors.
Three rules make the whole system: **Deep Ink is the ground, ember is the scarce voltage (one
moment per frame, never a headline, never two in one frame), and every surface elevates by a 1px
hairline border in `{colors.border}` — never a drop-shadow, glow, or gradient.** The two approved
exceptions (from the real site's hard rules): image overlays for legibility, and
`mask-image`/`-webkit-mask-image` linear-gradient edge fades for legibility-driven crops (e.g. a
logo belt fade) — never a decorative background gradient.

**Typography is exactly two families.** Plus Jakarta Sans carries every display, body, and UI
moment. DM Mono carries labels, kickers, units, and code/technical text — always uppercase with
0.16em tracking when used as a label, never for paragraphs. Weights are restricted to {300, 400,
500, 700} — nothing else exists in this system's scale. A headline whose clamp maximum would exceed
~48px uses weight 300 (per the real site's D4 rule); everything else in this video sits well under
that threshold and uses 400/500.

**Radii are a fixed scale**: 0 / 3px (badges, tags) / 6px (buttons, inputs) / 10px (cards, panels) /
16px (modals, hero cards) / pill (9999px, fully-rounded chips only). Never an arbitrary radius
outside this scale.

**Real recurring motifs to reuse** (from the actual site, not invented for video):
- The **ember-bar** (a 3px solid ember rule along a card's top or left edge) — the real site's
  sanctioned way to let ember read as a small structural accent without becoming a second voltage
  moment.
- **label-mono** tags — DM Mono uppercase eyebrows, exactly as used for section labels/kickers on
  the real site. No spike glyph, no invented mark.
- The **lockup** pattern (name + hairline divider + mono role) — reuse this shape for any
  name/role or label/descriptor pairing (e.g. a diagram node's name + its function).
- The real **isotipo-ember** brand mark (`public/brand/isotipo-ember.svg`) and the horizontal
  lockup (`public/brand/logo-horizontal-dark.svg`) — use the actual SVGs, never redraw them.
- The real **Notion glyph** (`public/brand/notion-icon.svg`, official monochrome mark) — use it
  in place of the plain word "Notion" wherever a compact recognizable icon reads better than text.

## The Frame

### Frame Craft Bar

- **Squint** — exactly one ember accent visible per frame (a word, a bar, an icon fill — never
  two, never a headline).
- **Trinity** — Deep Ink ground, cream/t1 text, ember exactly once; bg-2 surfaces for any raised
  panel/card; no third color invented.
- **Type** — Plus Jakarta Sans for all reading/display text; DM Mono uppercase 0.16em for every
  label/kicker; DM Mono (non-upper) for code, units, and numeric figures.

- **Canvas**: 1080×1920 (9:16) for this project — no other ratio needed.
- **Safe area**: `slide-pad` ~4.2cqw; content stays inside it. Caption band keep-out (bottom ~17%)
  still applies per the workflow's own rule even though captions are disabled — keep all content
  in the top ~83% for consistency.

## Colors

`{colors.bg}` is the ground on every frame, always. `{colors.bg-2}` is used for any card, panel, or
code-surface — the ONLY other fill in the system (no third dark tone, no navy, no separate "tile"
step — this system does not have that half-step the code-editorial preset used). Text is `{colors.t1}`
primary / `{colors.t2}` secondary / `{colors.t3}` tertiary — never pure white, never a cool gray.
`{colors.ember}` is the scarce accent: exactly one moment per frame (a word, an icon fill, an
ember-bar rule, or a coral-lit connector) — never a full headline, never a card fill, never two
moments in the same frame. `{colors.ember-cta}` is reserved for the rare case of ember-as-solid-fill
with light text on top (matches AA contrast) — not needed unless a frame includes an explicit
button-like element.

## Typography

Plus Jakarta Sans for everything read as prose/display (`body`, `lead`, `card-title`, `button`,
`headline`, `display`). DM Mono for everything indexical (`label-mono` uppercase 0.16em tracking,
`role-mono`, `code`, `number-unit`). Never swap these roles. Never introduce a third family.
Sentence case for display text (not uppercase, not title case) — matches the real site's headline
convention. Weight ceiling is 700 except at true hero display scale (>48px clamp max), which drops
to weight 300 per the real site's D4 rule.

## Depth & Surface

**Hairline only** on the real site. Every raised surface (`card-hairline`, `code-surface`)
elevates with a 1px `{colors.border}` hairline — nothing else. No drop-shadow, no glow, no
gradient fill on any content surface. The two approved exceptions: a dimming overlay on a real
photographic image for text legibility, and a `mask-image` linear-gradient edge fade for a
legibility crop (e.g. fading the edge of a logo belt or a wide diagram) — never a decorative
background gradient.

**Scoped override for this reel (2026-08-22):** every raised surface additionally carries
`{shadows.elevated}` on top of its hairline border — floating-card depth, ported back from this
project's prior iteration at Diego's request. This is local to this video asset only; it does not
change the live site's CSS or any other HyperFrames project.

## Shapes

0 / 3px / 6px / 10px / 16px / pill (9999px, chips only). Never an arbitrary radius.

## Components

- **ember-bar-top / ember-bar-left** — the 3px ember structural rule.
- **card-hairline** — bg-2 fill, hairline border, radius-md (10px), no shadow.
- **label-mono-tag** — DM Mono uppercase 0.16em eyebrow/kicker, t3 (or ember for one emphasis use).
- **lockup** — name + hairline divider + mono role, reusable for any name/descriptor pairing.
- **code-surface** — bg-2 fill (same as any card — no separate navy tone), hairline, radius-md, DM Mono text, one ember accent token allowed inside.
- **brand-mark** — the real isotipo-ember.svg / logo-horizontal-dark.svg, used verbatim.
- **notion-mark** — the real notion-icon.svg, recolored via `fill: currentColor`, used in place of the word "Notion" where a compact icon reads better.

## Composition Rules

### Do

- Stand every frame on `{colors.bg}` (Deep Ink); raise any card/panel/code-surface on `{colors.bg-2}` with a hairline border only.
- Use Plus Jakarta Sans for all reading text, DM Mono uppercase for every label/kicker.
- Ration ember to exactly one moment per frame — a word, an icon, an ember-bar, or one connector segment.
- Use the real brand mark and the real Notion glyph verbatim — never redraw, recolor outside the palette, or invent a substitute icon.
- Use the site's own recurring motifs (ember-bar, label-mono, lockup) instead of inventing new decorative devices.

### Don't

- No drop-shadows, glows, gradients (except the two named legibility exceptions), or a "tile"/half-step surface color that doesn't exist in this system.
- No spike glyphs, coral-callout bands, or any invented mark not listed above.
- No third color beyond bg / bg-2 / border / t1 / t2 / t3 / ember / ember-cta.
- No radius outside the fixed scale.
- No plain-text "Notion" label when the real Notion glyph would read more effectively as a compact mark.

## Known Gaps

- Font files: `assets/fonts/PlusJakartaSans-400.woff2` and `assets/fonts/DMMono-500.woff2` are staged as real local `.woff2` files (extracted from a prior build in this same project) — reference them via `@font-face` `src: url("assets/fonts/<file>.woff2") format("woff2")` in every frame, root-relative (not `../../`). Only weights 400 (sans) and 500 (mono) are available; do not request 300/700 unless additional font files are staged.
- This system's real "code surface" has no separate navy tone (unlike the prior code-editorial-derived frame.md) — any code/mono panel uses the same `{colors.bg-2}` as any other card, kept apart visually only by its hairline border and DM Mono content.
