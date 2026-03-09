import { ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "#/components/common/LanguageToggle";
import ThemeToggle from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { Routes } from "#/config/route-config";
import { LocaleLink, useLocalePath } from "#/i18n/routing";

export function AppMobileMenu() {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const localePath = useLocalePath();

	const menuItems = [
		{ label: t("menu.features"), href: localePath(Routes.Features) },
		{ label: t("menu.pricing"), href: localePath(Routes.Pricing) },
		{ label: t("menu.blog"), href: localePath(Routes.Blog) },
		{ label: t("menu.docs"), href: localePath(Routes.Docs) },
		{
			label: t("menu.aiTools"),
			sub: [
				{ label: t("menu.aiChat"), href: localePath("/ai/chat") },
				{ label: t("menu.aiImage"), href: localePath("/ai/image") },
				{ label: t("menu.aiVideo"), href: localePath("/ai/video") },
				{ label: t("menu.aiAudio"), href: localePath("/ai/audio") },
			],
		},
	];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<Menu className="h-6 w-6" />
					<span className="sr-only">{t("menu.toggleMenu")}</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-80">
				<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
				<div className="flex flex-col gap-4 pt-6">
					<div className="flex flex-col gap-2">
						<Button variant="outline" className="w-full" asChild>
							<LocaleLink
								href={Routes.AuthLogin}
								onClick={() => setOpen(false)}
							>
								{t("common.logIn")}
							</LocaleLink>
						</Button>
						<Button className="w-full" asChild>
							<LocaleLink
								href={Routes.AuthRegister}
								onClick={() => setOpen(false)}
							>
								{t("common.signUp")}
							</LocaleLink>
						</Button>
					</div>
					<ul className="space-y-1">
						{menuItems.map((item) =>
							"sub" in item && item.sub ? (
								<li key={item.label}>
									<CollapsibleMenuItem
										label={item.label}
										sub={item.sub}
										onNavigate={() => setOpen(false)}
									/>
								</li>
							) : (
								<li key={item.label}>
									<LocaleLink
										href={"href" in item ? item.href : ""}
										className="flex h-9 w-full items-center rounded-md px-2 text-base text-muted-foreground transition-colors hover:text-foreground"
										onClick={() => setOpen(false)}
									>
										{item.label}
									</LocaleLink>
								</li>
							),
						)}
					</ul>
					<div className="border-t pt-4">
						<div className="flex items-center justify-between">
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function CollapsibleMenuItem({
	label,
	sub,
	onNavigate,
}: {
	label: string;
	sub: { label: string; href: string }[];
	onNavigate: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="flex h-9 w-full items-center justify-between rounded-md px-2 text-base text-muted-foreground transition-colors hover:text-foreground">
				<span>{label}</span>
				<ChevronRight
					className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
				/>
			</CollapsibleTrigger>
			<CollapsibleContent className="pl-4">
				<ul>
					{sub.map((subItem) => (
						<li key={subItem.label}>
							<LocaleLink
								href={subItem.href}
								className="flex h-9 w-full items-center rounded-md px-2 text-base text-muted-foreground transition-colors hover:text-foreground"
								onClick={onNavigate}
							>
								{subItem.label}
							</LocaleLink>
						</li>
					))}
				</ul>
			</CollapsibleContent>
		</Collapsible>
	);
}
