import { source as createSource, loader } from "fumadocs-core/source";
import type { TOCItemType } from "fumadocs-core/toc";
import { isValidElement, type ReactNode } from "react";
import { defaultLocale, type Locale, supportedLocales } from "#/i18n";

type DocsModule = {
	frontmatter: {
		title: string;
		description?: string;
		icon?: string;
		full?: boolean;
	};
	toc?: TOCItemType[];
};

type DocsMeta = {
	title?: string;
	pages?: string[];
	description?: string;
	root?: boolean;
	defaultOpen?: boolean;
	collapsible?: boolean;
	icon?: string;
};

function toContentPath(path: string) {
	return path.replace(/^(\.\.\/)+content\/docs\//, "");
}

const rawDocPages = import.meta.glob("../../content/docs/**/*.{md,mdx}", {
	eager: true,
	query: {
		collection: "docs",
	},
}) as Record<string, DocsModule>;

const rawMetaFiles = import.meta.glob("../../content/docs/**/meta.json", {
	eager: true,
	import: "default",
}) as Record<string, DocsMeta>;

const docsSource = createSource({
	metas: Object.entries(rawMetaFiles).map(([path, data]) => ({
		data,
		path: toContentPath(path),
		type: "meta" as const,
	})),
	pages: Object.entries(rawDocPages).map(([path, module]) => ({
		data: {
			...module.frontmatter,
			toc: module.toc ?? [],
		},
		path: toContentPath(path),
		type: "page" as const,
	})),
});

export const source = loader({
	baseUrl: "/docs",
	source: docsSource,
	i18n: {
		defaultLanguage: defaultLocale,
		hideLocale: "default-locale",
		languages: [...supportedLocales],
	},
});

type SourcePage = NonNullable<ReturnType<typeof source.getPage>>;
type SourcePageData = SourcePage["data"] & {
	description?: string;
	full?: boolean;
	title?: string;
	toc?: TOCItemType[];
};

type DocsTreeNode = {
	children?: DocsTreeNode[];
	fallback?: DocsTreeNode;
	icon?: unknown;
	index?: DocsTreeNode;
	[key: string]: unknown;
};

export type DocsTocItem = {
	title: string;
	url: string;
	depth: number;
};

export type DocsPageData = {
	path: string;
	url: string;
	slugs: string[];
	locale?: string;
	title: string;
	description?: string;
	full?: boolean;
	toc: DocsTocItem[];
};

function toSerializableToc(items: TOCItemType[] = []): DocsTocItem[] {
	return items.map((item) => ({
		depth: item.depth,
		title: toTextContent(item.title),
		url: item.url,
	}));
}

function toTextContent(value: ReactNode): string {
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}

	if (Array.isArray(value)) {
		return value.map((item) => toTextContent(item)).join("");
	}

	if (isValidElement<{ children?: ReactNode }>(value)) {
		return toTextContent(value.props.children);
	}

	return "";
}

function withoutIcons<T extends DocsTreeNode>(node: T): T {
	const copy = { ...node } as T;

	delete copy.icon;

	if (copy.index) {
		copy.index = withoutIcons(copy.index);
	}

	if (copy.fallback) {
		copy.fallback = withoutIcons(copy.fallback);
	}

	if (copy.children) {
		copy.children = copy.children.map((child) => withoutIcons(child));
	}

	return copy;
}

export function getDocsPageTree(locale: Locale = defaultLocale) {
	return withoutIcons(source.getPageTree(locale) as DocsTreeNode);
}

export function getDocsPageData(
	slugs: string[],
	locale: Locale = defaultLocale,
): DocsPageData | null {
	const page = source.getPage(slugs, locale);

	if (!page) {
		return null;
	}

	const data = page.data as SourcePageData;

	return {
		description: data.description,
		full: data.full,
		locale: page.locale,
		path: page.path,
		slugs: page.slugs,
		title: data.title ?? "Documentation",
		toc: toSerializableToc(data.toc),
		url: page.url,
	};
}
