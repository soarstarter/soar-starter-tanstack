import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { TOCItemType } from "fumadocs-core/toc";
import { createClientLoader } from "fumadocs-mdx/runtime/browser";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/page";
import type { ComponentType } from "react";
import { docsCommonConfig } from "#/config/docs-common-config";
import { defaultLocale, type Locale } from "#/i18n";
import { buildSeoMeta } from "#/lib/seo";

type DocsModule = {
	default: ComponentType<Record<string, unknown>>;
	frontmatter: {
		title: string;
		description?: string;
		icon?: string;
		full?: boolean;
	};
	toc?: TOCItemType[];
};

function toEntryPath(path: string) {
	return path.replace(/^(\.\.\/)+content\/docs\//, "");
}

const rawDocsEntries = import.meta.glob(
	"../../../../../content/docs/**/*.{md,mdx}",
	{
		query: {
			collection: "docs",
		},
	},
) as Record<string, () => Promise<DocsModule>>;

const docsEntries = Object.fromEntries(
	Object.entries(rawDocsEntries).map(([path, loadDoc]) => [
		toEntryPath(path),
		loadDoc,
	]),
) as Record<string, () => Promise<DocsModule>>;

const docsContentLoader = createClientLoader(docsEntries, {
	component: (loaded) => {
		const MDX = loaded.default;

		return <MDX components={defaultMdxComponents} />;
	},
	id: "docs",
});

const getDocsPage = createServerFn({ method: "GET" })
	.inputValidator((input: { locale?: Locale; slugs?: string[] }) => ({
		locale: input.locale ?? defaultLocale,
		slugs: input.slugs ?? [],
	}))
	.handler(async ({ data }) => {
		const { getDocsPageData } = await import("#/lib/source");

		return getDocsPageData(data.slugs, data.locale);
	});

function parseSplat(splat: string | undefined) {
	if (!splat) {
		return [];
	}

	return splat.split("/").filter(Boolean);
}

export const Route = createFileRoute("/{-$locale}/_docs/docs/$")({
	loader: async ({ params }) => {
		const page = await getDocsPage({
			data: {
				locale: (params.locale as Locale | undefined) ?? defaultLocale,
				slugs: parseSplat(params._splat),
			},
		});

		if (!page) {
			throw notFound();
		}

		return page;
	},
	head: ({ loaderData }) => ({
		...buildSeoMeta({
			title: loaderData.title,
			description: loaderData.description ?? docsCommonConfig.description,
			path:
				loaderData.slugs.length > 0
					? `/docs/${loaderData.slugs.join("/")}`
					: "/docs",
			locale: (loaderData.locale as Locale | undefined) ?? defaultLocale,
		}),
	}),
	component: DocsContentPage,
});

function DocsContentPage() {
	const page = Route.useLoaderData();

	return (
		<DocsPage toc={page.toc as TOCItemType[]} full={page.full}>
			<DocsTitle>{page.title}</DocsTitle>
			<DocsDescription>{page.description}</DocsDescription>
			<DocsBody>{docsContentLoader.useContent(page.path)}</DocsBody>
		</DocsPage>
	);
}
