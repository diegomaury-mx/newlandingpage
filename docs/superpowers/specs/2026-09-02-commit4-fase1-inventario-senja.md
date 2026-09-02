# Commit 4 · FASE 1 — Inventario de cobertura Senja vs. tarjetas propias

**Fecha:** 2026-09-02 · **Método:** Playwright + Chromium contra producción (`diegomaury.mx`), pierce de shadow DOM de los dos `.senja-embed`, + lectura del bloque S6b del Copy Oficial SSOT (Notion). Capturas y JSON crudo: `qa-output/lighthouse-baseline/_senja/` (gitignored).

**Resultado: HAY HUECO. STOP — no se retira nada.** La decisión de importar (F-05b) o prescindir es editorial de Diego.

---

## 1 · Tarjetas propias `.testimonial-card` (SSOT Notion, bloque S6b)

Solo existen en el **home**. Son **3**, todas de texto:

| # | Autor | Rol | Cita |
|---|---|---|---|
| P1 | Shaili Zappa | Technical Recruiter, Platzi | "Diego is a truly extraordinary person to work with. He is constantly and consistently offering new ideas. The results Diego brings to his work are always above what is expected of him." |
| P2 | Jorge Acevedo Pallares | Director de Carbono y Sustentabilidad · Agencia Mexicana de Estudios Antárticos | "Su ambición de hacerlo diferente, el pensamiento lateral en la resolución de problemas y la capacidad colaborativa de conocer y reunir a los mejores." |
| P3 | Víctor Calzadillas | Community Builder, Startup Chihuahua | "En mi tiempo de conocer a Diego, él ha liderado iniciativas de las más grandes que jamás haya visto México… Hackathon Nacional REDUX, en el cual él fue mi proveedor." |

`/portfolio` y `/en/portfolio` **no tienen ninguna tarjeta propia**: su sección de testimonios es 100% el embed de Senja.

---

## 2 · Widget Senja del home — `93ff9581-ba54-4ba8-a053-f7d0889cd4d0`

Layout "wall of love" (marquee vertical + tarjeta destacada grande, tema **claro/blanco**, badge "Collect testimonials with Senja"). **14 testimonios:**

| # | Autor | Rol | Video | Cita capturada |
|---|---|---|---|---|
| S1 | Bryan Ruiz | Creative Director \| UX/UI Product Designer | no | "Diego es sinónimo de resiliencia y de compromiso. Su capacidad para la resolución de conflictos fue clave para el éxito de los proyectos en los que colaboramos. La mente tan innovadora que posee lo ha llevado a construir y articular un ecosistema emprendedor en el sureste de México y fortalecerlo a nivel nacional e internacional." (Mar 11, 2024) |
| S2 | Sol por la educación y Ludo diin / MarySol | — | **SÍ (video)** | "Todo empezó en agosto de 2020 llevándome a buscar capacitación… @diegomaury_93 dió unos consejos para mejorar de última hora la idea para Ludodiin que lo llevó a la semifinales…" (Nov 29, 2023) — testimonio **en video** (origen Instagram reel, servido por Senja) |
| S3 | Nora Hernández | Asesora publicitaria, consultora empresarial y organizadora de eventos | no | "Diego Maury ha sido una persona capaz de lograr lo que él se propone. Es inteligente, visionario, competitivo y audaz. Preparado para el cambio." (Oct 13, 2023) |
| S4 | Martha Pamela López | Marketing & Communications | no | "Tuve la oportunidad de formar equipo con Diego y es una persona sumamente profesional y responsable. Me da gusto observar desde lejos como todo el empeño que siempre pone en sus proyectos lo ha hecho crecer y tener el reconocimiento que se merece." (Oct 13, 2023) |
| S5 | Abraham Mayo | Business Developer en @hackademymx | no | "Diego es una persona impresionante, es envidiable la capacidad que tiene de approach con las personas; forma vínculos de manera orgánica y su trabajo se siente apasionado. Su productividad me dejó también impresionado, recomiendo ampliamente a Diego para posiciones futuras." (Oct 13, 2023) |
| S6 | Shaili Zappa | Experienced Technical Recruiter… (versión larga) | no | "I supervised Diego when he was working at Platzi. Diego is a truly extraordinary person to work with… Diego worked with 50+ students throughout his time in Platzi, and he impacted them very much…" — **versión más larga que la tarjeta propia P1** |
| S7 | Adrián Piñon | Coordinador del Centro de Cultura Filantrópica | no | "Excelente persona con un sentido humano increíble, lo cual se traduce en un excelente trabajo y trato profesional al liderar el proyecto en la zona sur del país." (Oct 13, 2023) |
| S8 | Ricardo Adame | Live Event Producer | no | "Diego es un gran colega, hemos trabajado en algunos proyectos juntos, sin dudar es alguien con mucho sentido de responsabilidad, compromiso y entrega en los proyectos en los que trabaja. Es un gran aliado cuando quieres que las cosas sucedan y sucedan bien." (Oct 13, 2023) |
| S9 | Juan Diego Hinojosa Sandoval | Director del Instituto de Emprendimiento del Tec de Monterrey Campus Laguna | no | "Diego tiene un liderazgo excepcional, una enorme pasión y dedicación por su trabajo, mantiene una disciplina constante y un excelente ambiente de trabajo." (Oct 13, 2023) |
| S10 | ARMIDA VELAZQUEZ | I-Trade Mgr | no | "Hola Diego, tu taller ¡me encantó! me hizo sentido en muchas cosas que vimos a lo largo de todo el programa y la parte de los tips para un pitch exitoso me serán de mucha utilidad… ¡Muchas gracias!" (May 30, 2023) |
| S11 | Jorge Acevedo Pallares | (= P2) | no | mismo autor que la tarjeta propia P2 |
| S12 | Víctor Calzadillas | (= P3) | no | mismo autor que la tarjeta propia P3 |
| S13 | **Carlos Alberto Ortegon Ortega** | — | ? | cita **no capturada** (vive en el dashboard de Senja) |
| S14 | **Carlos Güereca** | — | ? | cita **no capturada** (vive en el dashboard de Senja) |

## 3 · Widget Senja de `/portfolio` — `43006bd7-ae94-43c7-845a-7bb612ede4a3`

Carrusel de tarjetas (tema **claro/blanco**, estrellas de rating, flechas de navegación, badge "Collect testimonials with Senja", reproductor `<video>` nativo en la tarjeta de MarySol). Subconjunto del home: **10 testimonios = S1–S10** (Bryan Ruiz, MarySol [video], Nora Hernández, Martha Pamela López, Abraham Mayo, Shaili Zappa, Adrián Piñon, Ricardo Adame, Juan Diego Hinojosa Sandoval, ARMIDA VELAZQUEZ). **No incluye** Carlos A. Ortegon, Carlos Güereca, Jorge Acevedo, Víctor Calzadillas.

---

## 4 · Diff explícito — lo NO cubierto por las tarjetas propias

Las 3 tarjetas propias cubren, por autor: Shaili Zappa (parcial: versión corta), Jorge Acevedo Pallares, Víctor Calzadillas.

**No cubierto (11 testimonios + el video):**

1. **Bryan Ruiz** (S1) — texto, no está como tarjeta propia
2. **MarySol / "Sol por la educación y Ludo diin"** (S2) — **testimonio en VIDEO**, sin equivalente propio (las tarjetas propias son solo texto)
3. **Nora Hernández** (S3)
4. **Martha Pamela López** (S4)
5. **Abraham Mayo** (S5)
6. **Adrián Piñon** (S7)
7. **Ricardo Adame** (S8)
8. **Juan Diego Hinojosa Sandoval** (S9)
9. **ARMIDA VELAZQUEZ** (S10)
10. **Carlos Alberto Ortegon Ortega** (S13) — cita por recuperar del dashboard de Senja
11. **Carlos Güereca** (S14) — cita por recuperar del dashboard de Senja
12. **Shaili Zappa versión larga** (S6) — la tarjeta propia P1 usa una cita recortada; la versión del widget es más extensa (contexto Platzi, 50+ estudiantes)

**Además:** retirar el embed de `/portfolio` (y `/en/portfolio`) deja la sección de testimonios **completamente vacía** — ahí no hay ninguna tarjeta propia que la sostenga.

---

## 5 · Consecuencia para FASE 2

Por la instrucción de SILVIA: **cualquier hueco → STOP, no se retira nada.** Hay hueco (11 testimonios de texto + 1 en video + sección de portfolio sin respaldo propio). La decisión es de Diego:

- **F-05b** — importar a una base de Notion los testimonios de Senja (texto y video) y renderizarlos con el componente propio, antes o fusionado con el Commit 4. Requiere: soporte de video en `.testimonial-card` (hoy solo texto), y decidir cuáles de los 14 se publican.
- **Prescindir** — quedarse solo con las 3 tarjetas propias en el home y **sin sección de testimonios en `/portfolio`** (o mover las 3 propias también a portfolio). Decisión editorial + de prueba social.
