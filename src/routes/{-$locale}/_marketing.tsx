import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppFooter } from "#/components/layout/app/AppFooter";
import { AppHeader } from "#/components/layout/app/AppHeader";

export const Route = createFileRoute("/{-$locale}/_marketing")({
	component: MarketingLayout,
});

function MarketingLayout() {
	return (
		<div className="flex min-h-svh flex-col">
			<AppHeader />
			<main className="flex-1">
				<Outlet />
			</main>
			<AppFooter />
		</div>
	);
}
