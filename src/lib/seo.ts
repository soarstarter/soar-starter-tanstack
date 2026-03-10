import { websiteConfig } from "#/config/website-config";
import { defaultLocale, type Locale, supportedLocales } from "#/i18n";
import { localizePath } from "#/i18n/routing";

type SeoType = "article" | "website";

type BuildSeoInput = {
	title?: string;
	description?: string;
	path?: string;
	locale?: Locale;
	image?: string;
	keywords?: string[];
	noIndex?: boolean;
	type?: SeoType;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
};

function normalizeSiteUrl(siteUrl: string) {
	return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
}

function normalizePath(path: string) {
	if (!path || path === "/") {
		return "/";
	}

	return path.startsWith("/") ? path : `/${path}`;
}

function toAbsoluteUrl(value: string | undefined) {
	if (!value) {
		return undefined;
	}

	try {
		return new URL(value).toString();
	} catch {
		return new URL(
			value.replace(/^\//, ""),
			normalizeSiteUrl(siteUrl),
		).toString();
	}
}

function getTwitterHandle() {
	const twitterUrl =
		websiteConfig.metadata.social?.twitter ??
		websiteConfig.metadata.social?.facebook;

	if (!twitterUrl) {
		return undefined;
	}

	try {
		const pathname = new URL(twitterUrl).pathname.replace(/^\/+/, "");
		return pathname ? `@${pathname.replace(/^@/, "")}` : undefined;
	} catch {
		return undefined;
	}
}

function toOpenGraphLocale(locale: Locale) {
	return locale === "zh" ? "zh_CN" : "en_US";
}

function buildTitle(title: string | undefined) {
	if (!title || title === websiteConfig.name) {
		return websiteConfig.name;
	}

	return `${title} | ${websiteConfig.name}`;
}

function buildCanonicalUrl(path: string, locale: Locale) {
	const localizedPath = localizePath(normalizePath(path), locale);

	return new URL(
		localizedPath.replace(/^\//, ""),
		normalizeSiteUrl(siteUrl),
	).toString();
}

const siteUrl = websiteConfig.metadata.siteUrl;

export function buildSeoMeta({
	title,
	description = websiteConfig.metadata.description,
	path = "/",
	locale = defaultLocale,
	image = websiteConfig.metadata.ogImage,
	keywords = websiteConfig.metadata.keywords,
	noIndex = false,
	type = "website",
	publishedTime,
	modifiedTime,
	tags = [],
}: BuildSeoInput = {}) {
	const pageTitle = buildTitle(title);
	const canonicalUrl = buildCanonicalUrl(path, locale);
	const imageUrl = toAbsoluteUrl(image);
	const twitterHandle = getTwitterHandle();

	return {
		links: [
			{
				rel: "canonical",
				href: canonicalUrl,
			},
			...supportedLocales.map((supportedLocale) => ({
				rel: "alternate",
				hrefLang: supportedLocale,
				href: buildCanonicalUrl(path, supportedLocale),
			})),
			{
				rel: "alternate",
				hrefLang: "x-default",
				href: buildCanonicalUrl(path, defaultLocale),
			},
		],
		meta: [
			{
				title: pageTitle,
			},
			{
				name: "description",
				content: description,
			},
			{
				name: "application-name",
				content: websiteConfig.metadata.applicationName,
			},
			keywords.length > 0
				? {
						name: "keywords",
						content: keywords.join(", "),
					}
				: undefined,
			{
				name: "robots",
				content: noIndex ? "noindex, nofollow" : "index, follow",
			},
			{
				property: "og:type",
				content: type,
			},
			{
				property: "og:site_name",
				content: websiteConfig.metadata.applicationName,
			},
			{
				property: "og:title",
				content: pageTitle,
			},
			{
				property: "og:description",
				content: description,
			},
			{
				property: "og:url",
				content: canonicalUrl,
			},
			imageUrl
				? {
						property: "og:image",
						content: imageUrl,
					}
				: undefined,
			{
				property: "og:locale",
				content: toOpenGraphLocale(locale),
			},
			...supportedLocales
				.filter((supportedLocale) => supportedLocale !== locale)
				.map((supportedLocale) => ({
					property: "og:locale:alternate",
					content: toOpenGraphLocale(supportedLocale),
				})),
			{
				name: "twitter:card",
				content: imageUrl ? "summary_large_image" : "summary",
			},
			{
				name: "twitter:title",
				content: pageTitle,
			},
			{
				name: "twitter:description",
				content: description,
			},
			imageUrl
				? {
						name: "twitter:image",
						content: imageUrl,
					}
				: undefined,
			twitterHandle
				? {
						name: "twitter:site",
						content: twitterHandle,
					}
				: undefined,
			publishedTime
				? {
						property: "article:published_time",
						content: publishedTime,
					}
				: undefined,
			modifiedTime
				? {
						property: "article:modified_time",
						content: modifiedTime,
					}
				: undefined,
			...tags.map((tag) => ({
				property: "article:tag",
				content: tag,
			})),
		].filter(Boolean),
	};
}

export function buildSitemapEntry(
	path: string,
	locale: Locale,
	lastModified?: string,
) {
	return {
		url: buildCanonicalUrl(path, locale),
		lastModified,
	};
}
