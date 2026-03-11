import { redirect } from "@tanstack/react-router";
import { Routes } from "#/config/route-config";
import {
	getLocaleFromPath,
	localizePath,
	stripLocalePrefix,
} from "#/i18n/routing";
import { authClient } from "#/lib/auth-client";

const protectedPaths = ["/dashboard", "/admin", "/setting", "/account"];

/**
 * Check if the current request has a valid session.
 * Use in `beforeLoad` of protected layout routes.
 */
export function requireAuth({ location }: { location: { pathname: string } }) {
	const normalizedPathname = stripLocalePrefix(location.pathname);
	const isProtected = protectedPaths.some(
		(path) =>
			normalizedPathname === path || normalizedPathname.startsWith(`${path}/`),
	);

	if (!isProtected) return;

	// Better Auth may store session cookies as HttpOnly, so client-side cookie
	// string inspection is not reliable for route protection.
	if (typeof window !== "undefined") {
		return authClient.getSession().then(({ data }) => {
			if (data) return;

			const callbackUrl = localizePath(
				location.pathname,
				getLocaleFromPath(location.pathname),
			);
			const loginHref = localizePath(
				Routes.AuthLogin,
				getLocaleFromPath(location.pathname),
			);
			const search = new URLSearchParams({ callbackUrl }).toString();

			throw redirect({
				href: `${loginHref}?${search}`,
			});
		});
	}
}
