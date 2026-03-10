import { Link } from "@tanstack/react-router";
import { Logo } from "#/components/Logo";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";

export function DashboardSideHeader() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild>
					<Link to="/" preload={false}>
						<Logo />
						<span className="truncate text-base font-semibold">
							SoarStarter
						</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
