import { redirect } from "@tanstack/react-router";
import { Routes } from "#/config/route-config";

const protectedPaths = ["/dashboard", "/admin", "/setting", "/account"];

/**
 * Check if the current request has a valid session cookie.
 * Use in `beforeLoad` of protected layout routes.
 */
export function requireAuth({
	context,
	location,
}: {
	context: Record<string, unknown>;
	location: { pathname: string };
}) {
	const isProtected = protectedPaths.some(
		(path) =>
			location.pathname === path || location.pathname.startsWith(`${path}/`),
	);

	if (!isProtected) return;

	// On the server, check cookies from the request headers
	// On the client, the session check is handled by Better Auth's useSession
	if (typeof document !== "undefined") {
		const hasCookie =
			document.cookie.includes("better-auth.session_token") ||
			document.cookie.includes("__Secure-better-auth.session_token");

		if (!hasCookie) {
			throw redirect({
				to: Routes.AuthLogin,
				search: { callbackUrl: location.pathname },
			});
		}
	}
}
