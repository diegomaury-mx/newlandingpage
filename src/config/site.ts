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
			"Diseño programas, procesos y sistemas para convertir la visión en resultados tangibles.",
	},

	// ---------------------------------------------------------------------------
	// Links
	// ---------------------------------------------------------------------------

	links: {
		linkedin: "https://www.linkedin.com/in/diegomaury/",

		github: "https://github.com/diegomaury-mx",

		scheduling:
			"https://calendar.notion.so/meet/diegomaurymx/5aad3vun",

		email: "mailto:hola@diegomaury.mx",

		newsletter: "https://diegomaury.substack.com",
	},

	// ---------------------------------------------------------------------------
	// Navigation
	// ---------------------------------------------------------------------------

	navigation: [
		{
			label: "Sobre mí",
			href: "#about",
		},
		{
			label: "Portafolio",
			href: "/portfolio",
		},
		{
			label: "Cómo trabajo",
			href: "#process",
		},
		{
			label: "Contacto",
			href: "#contact",
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
				label: "Casos de estudio",
				href: "/portfolio", // TODO: actualizar cuando exista ruta propia
			},
			{
				label: "Sobre mí",
				href: "#about",
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
				href: "mailto:hola@diegomaury.mx",
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
				href: "/privacidad",
			},
			{
				label: "Términos y condiciones",
				href: "/terminos",
			},
		],
	},
} as const;