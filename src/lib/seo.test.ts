import { describe, expect, it } from "vitest";
import { buildSeoMeta, buildSitemapEntry } from "./seo";

describe("buildSeoMeta", () => {
	it("builds canonical and alternate links for localized pages", () => {
		const seo = buildSeoMeta({
			title: "About",
			path: "/about",
			locale: "zh",
		});

		expect(seo.links).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rel: "canonical",
					href: "http://localhost:3000/zh/about",
				}),
				expect.objectContaining({
					rel: "alternate",
					hreflang: "en",
					href: "http://localhost:3000/about",
				}),
				expect.objectContaining({
					rel: "alternate",
					hreflang: "zh",
					href: "http://localhost:3000/zh/about",
				}),
			]),
		);
	});

	it("adds article metadata when requested", () => {
		const seo = buildSeoMeta({
			title: "Post",
			path: "/blog/post",
			type: "article",
			publishedTime: "2026-03-11T00:00:00.000Z",
			tags: ["tanstack"],
		});

		expect(seo.meta).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					property: "og:type",
					content: "article",
				}),
				expect.objectContaining({
					property: "article:published_time",
					content: "2026-03-11T00:00:00.000Z",
				}),
				expect.objectContaining({
					property: "article:tag",
					content: "tanstack",
				}),
			]),
		);
	});
});

describe("buildSitemapEntry", () => {
	it("uses localized paths for sitemap URLs", () => {
		expect(buildSitemapEntry("/docs/quick-start", "zh")).toEqual({
			url: "http://localhost:3000/zh/docs/quick-start",
			lastModified: undefined,
		});
	});
});
