import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "#/components/ui/sidebar";
import { DashboardSideContent } from "./DashboardSideContent";
import { DashboardSideHeader } from "./DashboardSideHeader";
import { DashboardSideUser } from "./DashboardSideUser";

export function DashboardSidebar() {
	return (
		<Sidebar collapsible="icon" className="p-2">
			<SidebarHeader>
				<DashboardSideHeader />
			</SidebarHeader>
			<SidebarContent>
				<DashboardSideContent />
			</SidebarContent>
			<SidebarFooter>
				<DashboardSideUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
