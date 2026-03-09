import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LanguageToggle } from "#/components/common/LanguageToggle";
import { DashboardBreadcrumb } from "#/components/layout/user/DashboardBreadcrumb";
import { DashboardSidebar } from "#/components/layout/user/DashboardSidebar";
import ThemeToggle from "#/components/ThemeToggle";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { requireAuth } from "#/lib/auth-guard";

export const Route = createFileRoute("/{-$locale}/_dashboard")({
	beforeLoad: requireAuth,
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<DashboardBreadcrumb />
					<div className="ml-auto flex items-center gap-2">
						<ThemeToggle />
						<LanguageToggle />
					</div>
				</header>
				<div className="relative px-4 py-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
