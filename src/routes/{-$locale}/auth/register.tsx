import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "#/components/auth/RegisterForm";

export const Route = createFileRoute("/{-$locale}/auth/register")({
	head: () => ({
		meta: [{ title: "Register" }],
	}),
	component: RegisterPage,
});

function RegisterPage() {
	return <RegisterForm />;
}
