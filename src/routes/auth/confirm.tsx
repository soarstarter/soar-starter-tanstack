import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Routes } from "#/config/route-config";

export const Route = createFileRoute("/auth/confirm")({
	head: () => ({
		meta: [{ title: "Confirm Email" }],
	}),
	component: ConfirmPage,
});

function ConfirmPage() {
	return (
		<div className="flex flex-col items-center gap-4 text-center">
			<MailCheck className="size-12 text-muted-foreground" />
			<h1 className="text-2xl font-bold">Check your email</h1>
			<p className="text-sm text-muted-foreground">
				We&apos;ve sent you a confirmation link. Please check your email to
				verify your account.
			</p>
			<Button variant="outline" asChild>
				<Link to={Routes.AuthLogin}>Back to login</Link>
			</Button>
		</div>
	);
}
