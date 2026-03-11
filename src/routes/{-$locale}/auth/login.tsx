import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/components/auth/LoginForm";

export const Route = createFileRoute("/{-$locale}/auth/login")({
	validateSearch: (search: Record<string, unknown>) => ({
		callbackUrl:
			typeof search.callbackUrl === "string" ? search.callbackUrl : undefined,
	}),
	head: () => ({
		meta: [{ title: "Login" }],
	}),
	component: LoginPage,
});

function LoginPage() {
	const { callbackUrl } = Route.useSearch();

	return <LoginForm callbackUrl={callbackUrl} />;
}
