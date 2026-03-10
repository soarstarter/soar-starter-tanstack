import type { TOCItemType } from "fumadocs-core/toc";
import { type ComponentType, isValidElement, type ReactNode } from "react";
import type { Locale } from "#/i18n";

const POSTS_PER_PAGE = 6;

export type BlogTocItem = {
	title: string;
	url: string;
	depth: number;
};

type BlogModule = {
	default: ComponentType<Record<string, unknown>>;
	frontmatter: {
		title: string;
		description?: string;
		date: string | Date;
		author?: string;
		tags?: string[];
		image?: string;
	};
	toc?: BlogTocItem[];
};

type BlogDateValue = BlogModule["frontmatter"]["date"];
type LoadedBlogPost = {
	path: string;
	module: BlogModule;
};

function toEntryPath(path: string) {
	return path.replace(/^(\.\.\/)+content\/blog\//, "");
}

const rawBlogEntries = import.meta.glob("../../content/blog/**/*.{mdx,md}", {
	query: {
		collection: "blog",
	},
}) as Record<string, () => Promise<BlogModule>>;

export const blogEntries = Object.fromEntries(
	Object.entries(rawBlogEntries).map(([path, loadPost]) => [
		toEntryPath(path),
		loadPost,
	]),
) as Record<string, () => Promise<BlogModule>>;

export type BlogPostSummary = {
	slug: string;
	title: string;
	description?: string;
	date: string;
	author?: string;
	tags: string[];
	image?: string;
};

export type BlogPostPageData = BlogPostSummary & {
	path: string;
	toc: BlogTocItem[];
};

export type BlogPageData = {
	posts: BlogPostSummary[];
	currentPage: number;
	totalPages: number;
	selectedTag?: string;
	allTags: string[];
	totalPosts: number;
};

let blogPostsPromise: Promise<LoadedBlogPost[]> | undefined;

function normalizeCollectionPath(path: string) {
	return path.startsWith("./") ? path.slice(2) : path;
}

function slugFromPath(path: string) {
	return normalizeCollectionPath(path).replace(/\.mdx?$/, "");
}

function toDate(value: BlogDateValue) {
	return value instanceof Date ? value : new Date(value);
}

function toSummary(path: string, post: BlogModule): BlogPostSummary {
	return {
		slug: slugFromPath(path),
		title: post.frontmatter.title,
		description: post.frontmatter.description,
		date: toDate(post.frontmatter.date).toISOString(),
		author: post.frontmatter.author,
		tags: post.frontmatter.tags ?? [],
		image: post.frontmatter.image,
	};
}

function toPageData(path: string, post: BlogModule): BlogPostPageData {
	return {
		...toSummary(path, post),
		path,
		toc: toSerializableToc(post.toc ?? []),
	};
}

function toSerializableToc(items: TOCItemType[]): BlogTocItem[] {
	return items.map((item) => ({
		depth: item.depth,
		url: item.url,
		title: toTextContent(item.title),
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

async function loadAllBlogPosts() {
	if (!blogPostsPromise) {
		blogPostsPromise = Promise.all(
			Object.entries(blogEntries).map(async ([path, loadPost]) => ({
				path,
				module: await loadPost(),
			})),
		).then((posts) =>
			posts.sort(
				(left, right) =>
					toDate(right.module.frontmatter.date).getTime() -
					toDate(left.module.frontmatter.date).getTime(),
			),
		);
	}

	return blogPostsPromise;
}

function findBlogEntry(slug: string) {
	for (const [path, loadPost] of Object.entries(blogEntries)) {
		const normalizedPath = normalizeCollectionPath(path);
		if (slugFromPath(normalizedPath) === slug) {
			return {
				path: normalizedPath,
				loadPost,
			};
		}
	}

	return null;
}

export async function getBlogPageData({
	tag,
	page,
}: {
	tag?: string;
	page?: number;
} = {}): Promise<BlogPageData> {
	const allPosts = await loadAllBlogPosts();
	const filteredPosts = tag
		? allPosts.filter((post) =>
				(post.module.frontmatter.tags ?? []).includes(tag),
			)
		: allPosts;
	const totalPosts = filteredPosts.length;
	const totalPages =
		totalPosts > 0 ? Math.ceil(totalPosts / POSTS_PER_PAGE) : 0;
	const currentPage =
		totalPages > 0 ? Math.min(Math.max(page ?? 1, 1), totalPages) : 1;
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;

	return {
		posts: filteredPosts
			.slice(startIndex, startIndex + POSTS_PER_PAGE)
			.map((post) => toSummary(post.path, post.module)),
		currentPage,
		totalPages,
		selectedTag: tag,
		allTags: getAllTagsFromPosts(allPosts),
		totalPosts,
	};
}

export async function getBlogPostBySlug(
	slug: string,
): Promise<BlogPostPageData | null> {
	const entry = findBlogEntry(slug);

	if (!entry) {
		return null;
	}

	const post = await entry.loadPost();

	return toPageData(entry.path, post);
}

export async function getAllBlogPostPages(): Promise<BlogPostPageData[]> {
	const posts = await loadAllBlogPosts();

	return posts.map((post) => toPageData(post.path, post.module));
}

function getAllTagsFromPosts(posts: LoadedBlogPost[]) {
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.module.frontmatter.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return Array.from(counts.entries())
		.sort((left, right) => {
			if (right[1] !== left[1]) {
				return right[1] - left[1];
			}

			return left[0].localeCompare(right[0]);
		})
		.map(([tag]) => tag);
}

export function buildBlogListHref({
	pathname,
	tag,
	page,
}: {
	pathname: string;
	tag?: string;
	page?: number;
}) {
	const searchParams = new URLSearchParams();

	if (tag) {
		searchParams.set("tag", tag);
	}

	if ((page ?? 1) > 1) {
		searchParams.set("page", String(page));
	}

	const query = searchParams.toString();

	return query ? `${pathname}?${query}` : pathname;
}

export function formatBlogDate(date: string | Date, locale: Locale) {
	return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date instanceof Date ? date : new Date(date));
}
