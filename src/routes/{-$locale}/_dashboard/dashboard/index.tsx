import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_dashboard/dashboard/")({
	component: DashboardHome,
});

function DashboardHome() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="text-muted-foreground mt-2">
				Welcome to your dashboard.
			</p>
		</div>
	);
}
