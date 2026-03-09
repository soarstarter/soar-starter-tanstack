import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import i18n, { defaultLocale } from "#/i18n";
import { isLocale, localizePath, useCurrentLocale } from "#/i18n/routing";

export const Route = createFileRoute("/{-$locale}")({
	beforeLoad: async ({ location, params }) => {
		if (params.locale && !isLocale(params.locale)) {
			throw notFound();
		}

		if (params.locale === defaultLocale) {
			throw redirect({
				href: localizePath(location.href, defaultLocale),
				replace: true,
			});
		}

		const locale = params.locale ?? defaultLocale;

		if (i18n.resolvedLanguage !== locale) {
			await i18n.changeLanguage(locale);
		}
	},
	component: LocaleLayout,
});

function LocaleLayout() {
	const locale = useCurrentLocale();

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	return <Outlet />;
}
