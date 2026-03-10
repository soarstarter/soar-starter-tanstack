import { Routes } from "#/config/route-config";
import { websiteConfig } from "#/config/website-config";

export const docsCommonConfig = {
	title: websiteConfig.name,
	description:
		"Guides, examples, and reference material for building with the Soar Starter stack.",
	homeHref: Routes.Root,
	docsHref: Routes.Docs,
	githubUrl: websiteConfig.metadata.social?.github,
	sidebar: {
		defaultOpenLevel: 1,
	},
} as const;
