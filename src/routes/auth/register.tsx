import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "#/components/auth/RegisterForm";

export const Route = createFileRoute("/auth/register")({
	head: () => ({
		meta: [{ title: "Register" }],
	}),
	component: RegisterPage,
});

function RegisterPage() {
	return <RegisterForm />;
}
