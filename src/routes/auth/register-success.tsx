import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Routes } from "#/config/route-config";

export const Route = createFileRoute("/auth/register-success")({
	head: () => ({
		meta: [{ title: "Registration Successful" }],
	}),
	component: RegisterSuccessPage,
});

function RegisterSuccessPage() {
	return (
		<div className="flex flex-col items-center gap-4 text-center">
			<CheckCircle2 className="size-12 text-green-500" />
			<h1 className="text-2xl font-bold">Account created!</h1>
			<p className="text-sm text-muted-foreground">
				We&apos;ve sent a verification email to your inbox. Please verify your
				email address to complete registration.
			</p>
			<Button asChild>
				<Link to={Routes.AuthLogin}>Go to login</Link>
			</Button>
		</div>
	);
}
