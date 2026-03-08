import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "#/components/auth/ResetPasswordForm";

export const Route = createFileRoute("/auth/reset-password")({
	head: () => ({
		meta: [{ title: "Reset Password" }],
	}),
	validateSearch: (search: Record<string, unknown>) => ({
		token: (search.token as string) || undefined,
	}),
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
