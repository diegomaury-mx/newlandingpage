export const site = {
	// ---------------------------------------------------------------------------
	// Site
	// ---------------------------------------------------------------------------

	title: "Diego Maury · Strategic Program Director",

	description:
		"Strategic Program Director: diseño programas, procesos y sistemas que convierten la estrategia en ejecución y capacidad organizacional.",

	url: "https://diegomaury.mx",

	language: "es-MX",

	// ---------------------------------------------------------------------------
	// Brand
	// ---------------------------------------------------------------------------

	brand: {
		name: "Diego Maury",

		logo: "/assets/img/isotipo-ember.svg",

		tagline:
			"Strategic Program Director. Hagamos que las cosas pasen.",
	},

	// ---------------------------------------------------------------------------
	// Links
	// ---------------------------------------------------------------------------

	links: {
		linkedin: "https://www.linkedin.com/in/diegomaury/",

		github: "https://github.com/diegomaury-mx",

		scheduling:
			"https://calendar.notion.so/meet/diegomaurymx/5aad3vun",

		email: "mailto:dm@diegomaury.mx",

		newsletter: "https://diegomaury.substack.com",
	},

	// ---------------------------------------------------------------------------
	// Navigation
	// ---------------------------------------------------------------------------

	navigation: [
	{
		label: "Sobre mí",
		href: "/#s2-quien-soy",
	},
	{
		label: "Portafolio",
		href: "/portfolio",
	},
	{
		label: "Cómo trabajo",
		href: "/#s5-como-trabajo",
	},
	{
		label: "Contacto",
		href: "/#s8-siguiente-paso",
	},
],

	// ---------------------------------------------------------------------------
	// Footer
	// ---------------------------------------------------------------------------

	footer: {
		explore: [
			{
				label: "Portafolio",
				href: "/portfolio",
			},
			{
				label: "Docencia",
				href: "/docencia",
			},
			{
				label: "Casos de estudio",
				href: "/portfolio", // TODO: actualizar cuando exista ruta propia
			},
			{
				label: "Sobre mí",
				href: "/#s2-quien-soy",
			},
			{
				label: "Newsletter",
				href: "https://diegomaury.substack.com",
			},
			{
				label: "LinkedIn",
				href: "https://www.linkedin.com/in/diegomaury/",
			},
		],

		contact: [
			{
				label: "Correo electrónico",
				href: "mailto:dm@diegomaury.mx",
			},
			{
				label: "LinkedIn",
				href: "https://www.linkedin.com/in/diegomaury/",
			},
			{
				label: "Agendar conversación",
				href: "https://calendar.notion.so/meet/diegomaurymx/5aad3vun",
			},
		],

		location: "Ciudad de México, México",

		copyright: `© ${new Date().getFullYear()} Diego Maury. Todos los derechos reservados.`,

		legal: [
			{
				label: "Política de privacidad",
				href: "/politicas-privacidad.html",
			},
			{
				label: "Términos y condiciones",
				href: "/terminos-y-condiciones.html",
			},
		],
	},
} as const;