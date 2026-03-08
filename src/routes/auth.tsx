import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="relative flex min-h-svh items-center justify-center p-4">
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-4 left-4"
				asChild
			>
				<Link to="/">
					<ArrowLeft className="size-4" />
					<span className="sr-only">Back</span>
				</Link>
			</Button>
			<div className="w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
