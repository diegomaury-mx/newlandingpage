# Revisión Microsoft Clarity · 2026-11-20

Fuente de datos: export `Clarity_Diego_Maury_99_Recordings_11-20-2026 18 55.csv` (rango declarado 22-oct a 20-nov; las grabaciones del export van del 8 al 20 de noviembre; 98 filas legibles de 99).

## A · Integración técnica (verificado en Chrome real, producción)

| Punto | Estado |
|---|---|
| `public/js/clarity.js` carga `www.clarity.ms/tag/x7ns7c22xi` | OK |
| Script real `scripts.clarity.ms/0.8.80-beta/clarity.js` | Carga (fix CSP `c5427f5` vigente) |
| Envío de datos `j.clarity.ms/collect` | OK, varias peticiones |
| Errores CSP en consola | Ninguno |
| Duplicado vía GTM | Resuelto: `gtm.js` de GTM-NHT5827J no menciona Clarity; 1 sola carga del tag |
| Activación por página | `enableClarity` en las 11 páginas |
| Tráfico localhost en datos | 0 sesiones (97 `diegomaury.mx`, 1 `www`). El código no filtra por hostname; hoy no contamina, pero no hay gate |

## B · Datos de comportamiento (98 sesiones, 80 usuarios)

### Adquisición
- Google 34, directo 29, ChatGPT (`utm_source=chatgpt.com`) 25, Substack 5, Bing/LinkedIn/Facebook 1 c/u.
- ChatGPT manda el 100% de sus sesiones a `/eventos`. Google: 25 de 34 a `/eventos`.
- México 70, resto disperso (EE. UU. 7, Colombia 5, Ecuador 4, España 4).
- PC 68, móvil 29, tablet 1.

### Páginas de entrada
| Entrada | Sesiones | Mediana duración | Clics totales |
|---|---|---|---|
| `/eventos/` | 58 | 304 s | 46 |
| `/` | 35 | 13 s | 36 |
| `/portfolio/` | 2 | 301 s | 0 |
| `/en/events/`, `/en/`, `/en/portfolio/cava-soft/` | 1 c/u | — | — |

### Hallazgos
1. **El sitio funciona hoy como directorio de eventos, no como portafolio.** 59% de las entradas son `/eventos`; solo 3 de 98 sesiones tocan `/portfolio` o una ficha de caso.
2. **`/eventos` no deriva a nada.** 0 sesiones que entran por `/eventos` salen por otra página. El público de eventos (Google + ChatGPT) no descubre el resto del sitio.
3. **La home rebota rápido.** 16 de 35 sesiones de home duran 10 s o menos; 26 de 35 son tráfico directo (posible tráfico propio o enlaces compartidos, sin forma de confirmarlo con este export).
4. **ChatGPT es canal real** (25% de las sesiones), todo a `/eventos`.
5. **Duraciones infladas por pestañas inactivas.** 11 sesiones de entre 5:00 y 5:30 con 0 clics y 1 página: patrón de pestaña abierta, no de lectura. La mediana global (220 s) no sirve como métrica de engagement.
6. **Interacción baja:** 67 de 98 sesiones con 0 clics; 73 con una sola página. Móvil: mediana 17 s.

### Siguientes pasos sugeridos (sin ejecutar)
- Ver en Clarity las grabaciones largas con clics: `1q1yb4` (28:51, ChatGPT, 4 págs), `d3p3b1` (55:09, caso Cava Soft EN, 17 clics), `rbgi8b` (22:54, home→políticas, 20 clics), `10zgkm0` (tablet, 10 clics).
- Revisar en el dashboard los heatmaps de `/eventos` (dónde hacen clic, si usan filtros) y de `/` (scroll depth).
- Evaluar un puente desde `/eventos` hacia el resto del sitio (decisión de producto de Diego).
- Opcional: gate de hostname en `clarity.js` para que QA local nunca grabe.
