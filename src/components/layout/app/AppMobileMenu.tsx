import { Link } from "@tanstack/react-router";
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

export function AppMobileMenu() {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();

	const menuItems = [
		{ label: t("menu.features"), href: "/#features" },
		{ label: t("menu.pricing"), href: "/#pricing" },
		{ label: t("menu.blog"), href: "/blog" },
		{ label: t("menu.docs"), href: "/docs" },
		{
			label: t("menu.aiTools"),
			sub: [
				{ label: t("menu.aiChat"), href: "/ai/chat" },
				{ label: t("menu.aiImage"), href: "/ai/image" },
				{ label: t("menu.aiVideo"), href: "/ai/video" },
				{ label: t("menu.aiAudio"), href: "/ai/audio" },
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
							<Link to="/auth/login" onClick={() => setOpen(false)}>
								{t("common.logIn")}
							</Link>
						</Button>
						<Button className="w-full" asChild>
							<Link to="/auth/register" onClick={() => setOpen(false)}>
								{t("common.signUp")}
							</Link>
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
									<Link
										to={"href" in item ? item.href : ""}
										className="flex h-9 w-full items-center rounded-md px-2 text-base text-muted-foreground transition-colors hover:text-foreground"
										onClick={() => setOpen(false)}
									>
										{item.label}
									</Link>
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
							<Link
								to={subItem.href}
								className="flex h-9 w-full items-center rounded-md px-2 text-base text-muted-foreground transition-colors hover:text-foreground"
								onClick={onNavigate}
							>
								{subItem.label}
							</Link>
						</li>
					))}
				</ul>
			</CollapsibleContent>
		</Collapsible>
	);
}
