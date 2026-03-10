import { createFileRoute } from "@tanstack/react-router";
import { defaultLocale, supportedLocales } from "#/i18n";
import { getAllBlogPostPages } from "#/lib/blog";
import { getAllPublishedLegalPages } from "#/lib/legal";
import { buildSitemapEntry } from "#/lib/seo";
import { getAllDocsPages } from "#/lib/source";

const marketingPaths = [
	"/",
	"/about",
	"/contact",
	"/blog",
	"/ai/chat",
	"/ai/image",
	"/ai/audio",
	"/ai/video",
];

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function toUrlEntryXml(entry: { url: string; lastModified?: string }) {
	const lastMod = entry.lastModified
		? `<lastmod>${entry.lastModified}</lastmod>`
		: "";

	return `<url><loc>${escapeXml(entry.url)}</loc>${lastMod}</url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const [blogPages, legalPages] = await Promise.all([
					getAllBlogPostPages(),
					getAllPublishedLegalPages(),
				]);
				const entries = [
					...marketingPaths.flatMap((path) =>
						supportedLocales.map((locale) => buildSitemapEntry(path, locale)),
					),
					...blogPages.flatMap((page) =>
						supportedLocales.map((locale) =>
							buildSitemapEntry(`/blog/${page.slug}`, locale, page.date),
						),
					),
					...legalPages.flatMap((page) =>
						supportedLocales.map((locale) =>
							buildSitemapEntry(`/legal/${page.slug}`, locale, page.date),
						),
					),
					...getAllDocsPages().map((page) =>
						buildSitemapEntry(
							page.path,
							page.locale ?? defaultLocale,
							page.lastModified,
						),
					),
				];
				const body =
					'<?xml version="1.0" encoding="UTF-8"?>' +
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
					entries.map(toUrlEntryXml).join("") +
					"</urlset>";

				return new Response(body, {
					headers: {
						"content-type": "application/xml; charset=utf-8",
						"cache-control": "public, max-age=3600",
					},
				});
			},
		},
	},
});
