import { Routes } from "#/config/route-config";

export interface DocsMenuItem {
	title: string;
	href?: string;
	external?: boolean;
	items?: DocsMenuItem[];
}

function docsHref(path: string) {
	return `${Routes.Docs}/${path}`;
}

export function getDocsSidebarLinks(): DocsMenuItem[] {
	return [
		{
			title: "Introduction",
			items: [
				{ title: "Quick start", href: docsHref("introduction/quick-start") },
			],
		},
		{
			title: "Essentials",
			items: [
				{ title: "Markdown", href: docsHref("essentials/markdown") },
				{ title: "Code Blocks", href: docsHref("essentials/code-blocks") },
				{
					title: "Images & Embeds",
					href: docsHref("essentials/images-and-embeds"),
				},
			],
		},
		{
			title: "Components",
			items: [
				{ title: "Accordion", href: docsHref("components/accordion") },
				{ title: "Banner", href: docsHref("components/banner") },
				{ title: "Callout", href: docsHref("components/callout") },
				{ title: "Card", href: docsHref("components/card") },
				{ title: "File Tree", href: docsHref("components/file-tree") },
				{ title: "Heading", href: docsHref("components/heading") },
				{ title: "Image Zoom", href: docsHref("components/image-zoom") },
				{ title: "Inline TOC", href: docsHref("components/inline-toc") },
				{ title: "Steps", href: docsHref("components/steps") },
				{ title: "Tabs", href: docsHref("components/tabs") },
				{ title: "Type Table", href: docsHref("components/type-table") },
			],
		},
	];
}
