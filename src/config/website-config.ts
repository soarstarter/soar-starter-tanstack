import type { WebsiteConfig } from "#/types";

export const websiteConfig: WebsiteConfig = {
	name: "Soar Starter",
	description:
		"Production-ready SaaS starter built with TanStack Start, Better Auth, and Tailwind CSS.",
	metadata: {
		title: "Soar Starter",
		description:
			"Production-ready SaaS starter built with TanStack Start, Better Auth, and Tailwind CSS.",
		applicationName: "Soar Starter",
		siteUrl: "http://localhost:3000",
		ogImage: "/og.png",
		keywords: ["TanStack Start", "SaaS", "Better Auth", "Tailwind CSS"],
		social: {
			github: "https://github.com/your-username",
			twitter: "https://twitter.com/your-username",
			linkedin: "https://www.linkedin.com/in/your-username",
			facebook: "https://www.facebook.com/your-username",
			instagram: "https://www.instagram.com/your-username",
			tiktok: "https://www.tiktok.com/@your-username",
			telegram: "https://t.me/your-username",
		},
	},
	mail: {
		provider: "resend",
		fromEmail: "Soar Starter <noreply@mail.soarstarter.com>",
		supportEmail: "contact@soarstarter.com",
	},
};
