
# Diego Maury Design System — New Landing Page

> Sistema de diseño personal y kit de componentes para proyectos de Diego Maury.

---

## Descripción
Este repositorio contiene el Design System de Diego Maury, pensado para garantizar consistencia visual y funcional en productos digitales, presentaciones y prototipos. Incluye tokens de diseño, paleta de colores, tipografías, componentes reutilizables y documentación de uso.

## Ubicación del Design System
El núcleo del sistema está en:

`Diego Maury Design System (1)/`

Utiliza este Design System como referencia para componentes, tokens y estilos en proyectos relacionados.

## Instalación y uso
1. Clona este repositorio:
	```bash
	git clone <URL-del-repo>
	```
2. Navega a la carpeta principal:
	```bash
	cd newlandingpage
	```
3. Consulta la documentación y ejemplos en `Diego Maury Design System (1)/README.md`.

## Estructura del proyecto

```
├── Diego Maury Design System (1)/   # Núcleo del sistema de diseño
│   ├── assets/                      # Imágenes, logos, íconos
│   ├── colors_and_type.css          # Tokens de color y tipografía
│   ├── fonts/                       # Archivos de fuentes
│   ├── preview/                     # Vistas previas de componentes
│   ├── ui_kits/                     # Kits de UI reutilizables
│   └── README.md                    # Documentación del sistema
├── docs/                            # Documentación adicional
├── GOVERNANCE.md                    # Gobierno y lineamientos
└── README.md                        # Este archivo
```

## Ejemplo de uso
Para usar los tokens de color en tu CSS:

```css
@import './Diego Maury Design System (1)/colors_and_type.css';

.boton-principal {
  background: var(--dm-amethyst);
  color: var(--dm-bone);
}
```

Consulta más ejemplos y componentes en el README del sistema de diseño.

## Cómo contribuir
1. Abre un issue para proponer cambios o mejoras.
2. Haz un fork y crea una rama descriptiva.
3. Realiza tus cambios siguiendo la guía de estilos y buenas prácticas.
4. Envía un pull request con una descripción clara.

## Licencia
MIT. Consulta el archivo LICENSE para más detalles.

## Contacto
Diego Maury — [LinkedIn](https://www.linkedin.com/in/diegomaury/) · diegomaury@gmail.com
