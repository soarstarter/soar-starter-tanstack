import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "#/components/auth/ForgotPasswordForm";

export const Route = createFileRoute("/auth/forgot-password")({
	head: () => ({
		meta: [{ title: "Forgot Password" }],
	}),
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}
