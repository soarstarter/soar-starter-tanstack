import type { TOCItemType } from "fumadocs-core/toc";
import {
	isValidElement,
	type ComponentType,
	type ReactNode,
} from "react";
import type { Locale } from "#/i18n";

type LegalModule = {
	default: ComponentType<Record<string, unknown>>;
	frontmatter: {
		title: string;
		description?: string;
		date: string | Date;
		published?: boolean;
	};
	toc?: TOCItemType[];
};

type LegalDateValue = LegalModule["frontmatter"]["date"];

export type LegalTocItem = {
	title: string;
	url: string;
	depth: number;
};

export type LegalPageData = {
	slug: string;
	path: string;
	title: string;
	description?: string;
	date: string;
	published: boolean;
	toc: LegalTocItem[];
};

function toEntryPath(path: string) {
	return path.replace(/^(\.\.\/)+content\/legal\//, "");
}

const rawLegalEntries = import.meta.glob("../../content/legal/**/*.{md,mdx}", {
	query: {
		collection: "legal",
	},
}) as Record<string, () => Promise<LegalModule>>;

export const legalEntries = Object.fromEntries(
	Object.entries(rawLegalEntries).map(([path, loadPage]) => [
		toEntryPath(path),
		loadPage,
	]),
) as Record<string, () => Promise<LegalModule>>;

function normalizeCollectionPath(path: string) {
	return path.startsWith("./") ? path.slice(2) : path;
}

function slugFromPath(path: string) {
	return normalizeCollectionPath(path).replace(/\.mdx?$/, "");
}

function toDate(value: LegalDateValue) {
	return value instanceof Date ? value : new Date(value);
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

function toSerializableToc(items: TOCItemType[]): LegalTocItem[] {
	return items.map((item) => ({
		depth: item.depth,
		title: toTextContent(item.title),
		url: item.url,
	}));
}

function toPageData(path: string, page: LegalModule): LegalPageData {
	return {
		slug: slugFromPath(path),
		path,
		title: page.frontmatter.title,
		description: page.frontmatter.description,
		date: toDate(page.frontmatter.date).toISOString(),
		published: page.frontmatter.published ?? true,
		toc: toSerializableToc(page.toc ?? []),
	};
}

function findLegalEntry(slug: string) {
	for (const [path, loadPage] of Object.entries(legalEntries)) {
		const normalizedPath = normalizeCollectionPath(path);
		if (slugFromPath(normalizedPath) === slug) {
			return {
				path: normalizedPath,
				loadPage,
			};
		}
	}

	return null;
}

export async function getLegalPageBySlug(
	slug: string,
): Promise<LegalPageData | null> {
	const entry = findLegalEntry(slug);

	if (!entry) {
		return null;
	}

	const page = await entry.loadPage();
	const pageData = toPageData(entry.path, page);

	if (!pageData.published) {
		return null;
	}

	return pageData;
}

export function formatLegalDate(date: string | Date, locale: Locale) {
	return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date instanceof Date ? date : new Date(date));
}
