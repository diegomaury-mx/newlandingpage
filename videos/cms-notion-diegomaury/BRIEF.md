---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "El contenido de diegomaury.mx vive en Notion, no en el código; el build y la publicación están gateados y automatizados por reglas reales"
destination: instagram-reels
aspect: 1080x1920
language: es
length: 40s
angle: concept
---

## Intent

Explicar a la Notion Community, con precisión técnica, cómo funciona el CMS de diegomaury.mx: el contenido vive en 4 fuentes reales de Notion (no en el código Astro), publicar exige un gate real de dos marcas (`Publicado` + `Publicable`), y un webhook firmado dispara el rebuild automático en Cloudflare Pages para 3 de esas 4 fuentes. Tono `technical`: la jerga (Astro, HMAC, Deploy Hook, Zod, la regla en mono) suma credibilidad para esta audiencia, no la resta. Sin voiceover — solo texto en pantalla. Sin venta, sin hype: es un mecanismo, no un producto que se promociona.

## Assets

- public/site-real-diegomaury-mx.jpg — captura real del hero + cinturón de logos de diegomaury.mx (Claude-in-Chrome, 21 ago 2026); el cinturón de logos es contenido 100% dinámico desde CMS Imágenes en Notion, así que esta imagen es evidencia real del CMS funcionando, no un mockup. Usar en Escena 1 o 2 (el "giro" de código → contenido real).
- public/notion-ssot-casos.jpg — captura real de la tabla del SSOT - Portafolio Proyectos en Notion (columnas title/Capa/year/logo/Datos cuantitativos, 30 filas, sidebar personal colapsado para no exponer chats/inbox privados). Usar en Escena 3 (las 4 fuentes) como evidencia de que "Casos de estudio" es una base real, no una ilustración inventada.
- El resto de las escenas (gate de publicación, flujo de auto-publish, recap) se mantienen 100% invented/faceless — no hay assets reales adicionales para esas.

## Customizations

- La Escena 4 debe mostrar el string exacto `draft = NOT (Publicado AND Publicable)` en tipografía monoespaciada, como si fuera una línea real de código (lo es: `src/services/notionLoaders.ts`).
- La cifra "27 fichas publicadas" (de 30 filas totales del SSOT) debe aparecer verbatim — verificada por SQL en vivo contra Notion el 21 ago 2026, no un placeholder.
- El flujo de auto-publish (Escena 5) debe representar solo 3 de las 4 fuentes activando el webhook — Métricas oficiales queda fuera de la suscripción. No implicar cobertura total.

## Notes

- Audio: video silencioso (sin BGM ni SFX). El OAuth de HeyGen (browser y device-code) no funciona en esta terminal remota/headless, y MusicGen local no tiene sus dependencias instaladas. Decisión del usuario (21 ago 2026): continuar sin música en vez de instalar MusicGen o resolver el login. `STORYBOARD.md` usa `music: none` + no hay `SCRIPT.md` → marcador canónico de silencio total, Step 3.1 se salta limpio.
- Fuente completa del guion y los hechos verificados: `../../video-explainer-output-2026-08-21-cms-notion/video-explainer-plan.md` y `composition-brief.md` en la raíz del repo — usar como contrato creativo completo, no repetir la entrevista de intención.
- Design system del proyecto real (no inventar otro): "Ember on Ink" V2 — bg `#0A0612`, superficie `#1A1128`, borde `#6A291B`, texto `#FAF8FC`/`#DDDBE0`/`#A8A6AC`, acento ember `#FF5C39` (un acento por escena), tipografía Plus Jakarta Sans + DM Mono (mono solo para la regla de código).
- Sin hype language, sin superlativos, sin comparación con otros CMS.
- Duración objetivo 40s es explícita del usuario, no el default de rango 20-40s.
