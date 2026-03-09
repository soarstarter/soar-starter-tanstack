import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "#/components/ui/navigation-menu";
import { Routes } from "#/config/route-config";
import { LocaleLink, useLocalePath } from "#/i18n/routing";

export function AppNavMenu() {
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const localePath = useLocalePath();

	const menuItems = [
		{ name: t("menu.features"), href: localePath(Routes.Features) },
		{ name: t("menu.pricing"), href: localePath(Routes.Pricing) },
		{ name: t("menu.blog"), href: localePath(Routes.Blog) },
		{ name: t("menu.docs"), href: localePath(Routes.Docs) },
	];

	const aiToolsItems = [
		{ name: t("menu.aiChat"), href: localePath("/ai/chat") },
		{ name: t("menu.aiImage"), href: localePath("/ai/image") },
		{ name: t("menu.aiVideo"), href: localePath("/ai/video") },
		{ name: t("menu.aiAudio"), href: localePath("/ai/audio") },
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
								<LocaleLink
									href={item.href}
									className="flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									{item.name}
								</LocaleLink>
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
											<LocaleLink
												href={item.href}
												className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
											>
												<div className="text-sm font-medium leading-none">
													{item.name}
												</div>
											</LocaleLink>
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
