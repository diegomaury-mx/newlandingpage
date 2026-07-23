# Copy para pegar en "Copy Activo" (Notion, Portafolio D)

Pegar entre **S6 · Sistemas propios** y **S7 · Formas de trabajar conmigo**, respetando el formato del resto del documento (encabezado `#`, subtítulo `##`, separador `---` antes y después).

---

# S6b · Prueba social {toggle="true"}
	## No es autopromoción. Es lo que dicen quienes ya trabajaron conmigo.
	Colegas, supervisores y clientes con los que he trabajado directamente en programas, hackathons y operaciones.
	**Fragmentos estáticos (3, indexables):**
	- **Shaili Zappa** · Technical Recruiter, Platzi (fue su supervisora) · [linkedin.com/in/shailizappa](https://linkedin.com/in/shailizappa)
	  "Diego is a truly extraordinary person to work with. He is constantly and consistently offering new ideas... The results Diego brings to his work are always above what is expected of him."
	- **Jorge Acevedo Pallares** · Director de Carbono y Sustentabilidad, Agencia Mexicana de Estudios Antárticos
	  "Su ambición de hacerlo diferente... el pensamiento lateral en la resolución de problemas... la capacidad colaborativa de conocer y reunir a los mejores."
	- **Victor Calzadillas** · Community Builder, Startup Chihuahua
	  "En mi tiempo de conocer a Diego, el ha liderado iniciativas de las mas grandes que jamás haya visto México... Hackathon Nacional Redux, en el cual el fue mi proveedor."
	**Widget dinámico:** grid/carousel de Senja (`93ff9581-ba54-4ba8-a053-f7d0889cd4d0`), con el resto de testimonios curados desde el panel de Senja. Carga diferida (IntersectionObserver), no afecta LCP.

---

*(S7 · Formas de trabajar conmigo sigue igual, sin cambios)*

---

# S7b · Confianza directa {toggle="true"}
	## Respaldo directo antes del CTA final.
	**Widget dinámico:** tarjeta individual de Senja (`d5b4c965-596d-4cb7-81d0-ef2a0b60ab6c`), un solo testimonio (Shaili Zappa). Carga diferida (IntersectionObserver). Sin copy propio en el bloque — el contenido lo resuelve el widget.

---

## Nota sobre fuente y gobernanza

- **SSOT del verbatim de los testimonios:** página de Notion "💬 Prueba Social · Testimonios y Validación Externa (textos exactos)". Este bloque Copy Activo referencia esos textos, no los reemplaza.
- **Gestión de testimonios:** Senja (`senja.io/p/diegomaury`), no Diego CMS/Astro. Un testimonio nuevo entra primero a Notion (fuente), luego se sube a Senja (display).
- **Verificado línea por línea contra el HTML publicado:** 22 jul 2026 (rama `feature/testimonios-prueba-social` mergeada a `master`, commits `b656f09`..`81bbe12`).
- Spec completo: `docs/superpowers/specs/2026-07-22-testimonios-prueba-social-design.md`. Plan de implementación: `docs/superpowers/plans/2026-07-22-testimonios-prueba-social.md`.
