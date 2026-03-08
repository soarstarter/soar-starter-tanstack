import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";
import { getUserSidebarLinks } from "#/config/user-sidebar-config";

export function DashboardSideContent() {
	const { pathname } = useLocation();
	const sidebarLinks = getUserSidebarLinks();

	const isActive = (href: string | undefined): boolean => {
		if (!href) return false;
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<>
			{sidebarLinks.map((item) =>
				item.items && item.items.length > 0 ? (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent className="flex flex-col gap-2">
							<SidebarMenu>
								{item.items.map((subItem) => (
									<SidebarMenuItem key={subItem.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive(subItem.href)}
										>
											<Link to={subItem.href || ""}>
												{subItem.icon as ReactNode}
												<span className="truncate text-sm font-medium">
													{subItem.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : (
					<SidebarGroupContent key={item.title} className="flex flex-col gap-2">
						<SidebarMenu className="pl-2">
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isActive(item.href)}>
									<Link to={item.href || ""}>
										{item.icon as ReactNode}
										<span className="truncate text-sm font-medium">
											{item.title}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				),
			)}
		</>
	);
}
