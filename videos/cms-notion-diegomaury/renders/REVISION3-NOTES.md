# Revisión 3 — video-cms-notion-revision3.mp4 (2026-08-31)

Base: revision2-video-real-cierre.mp4 (aprobado). Pase de "dirección de producción"
sobre la revisión previa (informe del usuario, 18 puntos).

## Aplicado
- **Tipografía sentence case**: sin ALL CAPS salvo `DIEGOMAURY.MX`. Headlines Plus Jakarta
  Sans 700 sentence case, jerarquía por tamaño/peso/tracking/posición. Fuentes reales
  400/500/700 (antes solo 400/500 y el 700 salía como faux-bold).
- **Grid editorial**: headlines de frame al mismo eje izquierdo (4.2cqw, ~220px).
  Screenshots/cards/logo rompen el eje. F2 y F7 con tratamiento vertical propio.
- **F2 motion causal**: gesto de edición (cursor barre C2) -> aparece en el sitio (C3) ->
  línea de correspondencia. Editar -> transformar -> publicar visible.
- **F7 payoff**: ~1.7s de aire en la tesis antes del handoff, movimiento reducido
  (solo opacidad), subtítulo bajado a escala lead.
- **F8**: fade-out final del logo.
- **SFX** (D-01 revocada): sistema mínimo — key-tick (edición), confirm-soft (validación),
  lock-in (trigger/webhook), build-pulse (proceso), success-soft (sitio actualizado),
  close-fade (cierre). Mean -36 dB (restringido). Sin BGM, sin voz.

## Pendiente de afinar (ronda de oído)
- Los SFX son tonos sintetizados (ffmpeg), funcionales no diseñados. Un transiente
  llega a -0.8 dB (casi al techo): falta loudness-match entre efectos.
- F3: eje del header (~45px) vs celdas (60px), 15px de desfase.

## Ya presente antes de este pase (no se tocó)
- F3 revela las 4 fuentes en cascada.
- F5/F6 tienen "Sitio actualizado" como bloque final del pipeline.

Check: 0 errores, contraste 42/42 AA, layout/motion 0. Render 7.0 MB · 41.5s · h264+aac.
