import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/components/auth/LoginForm";

export const Route = createFileRoute("/{-$locale}/auth/login")({
	head: () => ({
		meta: [{ title: "Login" }],
	}),
	component: LoginPage,
});

function LoginPage() {
	return <LoginForm />;
}
