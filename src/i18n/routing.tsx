import {
	Link,
	useLocation,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { defaultLocale, type Locale, supportedLocales } from "#/i18n";

function splitPathSuffix(path: string) {
	const hashIndex = path.indexOf("#");
	const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
	const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
	const queryIndex = withoutHash.indexOf("?");
	const search = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
	const pathname =
		queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

	return { pathname, search, hash };
}

function normalizePathname(pathname: string) {
	if (!pathname || pathname === "/") {
		return "/";
	}

	const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const trimmed = normalized.replace(/\/+$/, "");

	return trimmed || "/";
}

export function isLocale(value: string | null | undefined): value is Locale {
	return supportedLocales.includes(value as Locale);
}

export function getLocaleFromPath(path: string) {
	const { pathname } = splitPathSuffix(path);
	const locale = normalizePathname(pathname).split("/")[1];

	return isLocale(locale) ? locale : defaultLocale;
}

export function stripLocalePrefix(path: string) {
	const { pathname, search, hash } = splitPathSuffix(path);
	const normalizedPathname = normalizePathname(pathname);
	const segments = normalizedPathname.split("/").filter(Boolean);

	if (segments.length > 0 && isLocale(segments[0])) {
		const strippedPathname =
			segments.length === 1 ? "/" : `/${segments.slice(1).join("/")}`;
		return `${strippedPathname}${search}${hash}`;
	}

	return `${normalizedPathname}${search}${hash}`;
}

export function localizePath(path: string, locale: Locale) {
	const strippedPath = stripLocalePrefix(path);
	const { pathname, search, hash } = splitPathSuffix(strippedPath);
	const normalizedPathname = normalizePathname(pathname);

	if (locale === defaultLocale) {
		return `${normalizedPathname}${search}${hash}`;
	}

	const localizedPathname =
		normalizedPathname === "/"
			? `/${locale}/`
			: `/${locale}${normalizedPathname}`;

	return `${localizedPathname}${search}${hash}`;
}

export function useCurrentLocale() {
	const { pathname } = useLocation();

	return getLocaleFromPath(pathname);
}

export function useLocalePath() {
	const locale = useCurrentLocale();

	return (path: string) => localizePath(path, locale);
}

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
	href: string;
	locale?: Locale;
};

export function LocaleLink({
	href,
	locale,
	children,
	...props
}: LocaleLinkProps) {
	const currentLocale = useCurrentLocale();
	const targetLocale = locale ?? currentLocale;

	if (href.startsWith("#")) {
		return (
			<Link to={href} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<Link to={localizePath(href, targetLocale)} {...props}>
			{children}
		</Link>
	);
}

export function useLocaleRouter() {
	const navigate = useNavigate();
	const router = useRouter();
	const currentLocale = useCurrentLocale();

	return {
		path: (href: string, locale = currentLocale) => localizePath(href, locale),
		push: (href: string, options?: { locale?: Locale }) =>
			navigate({ href: localizePath(href, options?.locale ?? currentLocale) }),
		replace: (href: string, options?: { locale?: Locale }) =>
			navigate({
				href: localizePath(href, options?.locale ?? currentLocale),
				replace: true,
			}),
		invalidate: () => router.invalidate(),
	};
}
