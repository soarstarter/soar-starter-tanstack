import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "#/components/ui/navigation-menu";

export function AppNavMenu() {
	const { pathname } = useLocation();
	const { t } = useTranslation();

	const menuItems = [
		{ name: t("menu.features"), href: "/#features" },
		{ name: t("menu.pricing"), href: "/#pricing" },
		{ name: t("menu.blog"), href: "/blog" },
		{ name: t("menu.docs"), href: "/docs" },
	];

	const aiToolsItems = [
		{ name: t("menu.aiChat"), href: "/ai/chat" },
		{ name: t("menu.aiImage"), href: "/ai/image" },
		{ name: t("menu.aiVideo"), href: "/ai/video" },
		{ name: t("menu.aiAudio"), href: "/ai/audio" },
	];

	const isActive = (href: string) => {
		const path = href.split("#")[0];
		return (
			pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
		);
	};

	return (
		<div className="flex flex-1 items-center justify-center space-x-2">
			<NavigationMenu viewport={false}>
				<NavigationMenuList className="flex items-center gap-1">
					{menuItems.map((item) => (
						<NavigationMenuItem key={item.name}>
							<NavigationMenuLink asChild active={isActive(item.href)}>
								<Link
									to={item.href}
									className="flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									{item.name}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
					<NavigationMenuItem>
						<NavigationMenuTrigger>{t("menu.aiTools")}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-48 gap-1 p-2">
								{aiToolsItems.map((item) => (
									<li key={item.name}>
										<NavigationMenuLink asChild>
											<Link
												to={item.href}
												className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
											>
												<div className="text-sm font-medium leading-none">
													{item.name}
												</div>
											</Link>
										</NavigationMenuLink>
									</li>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
