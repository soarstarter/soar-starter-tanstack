import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginFormDialog } from "#/components/auth/LoginFormDialog";
import { LanguageToggle } from "#/components/common/LanguageToggle";
import { AppMobileMenu } from "#/components/layout/app/AppMobileMenu";
import { AppNavMenu } from "#/components/layout/app/AppNavMenu";
import { UserPopover } from "#/components/layout/app/UserPopover";
import ThemeToggle from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";
import { Routes } from "#/config/route-config";
import { LocaleLink } from "#/i18n/routing";
import { useSession } from "#/lib/auth-client";

export function AppHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const { data: session } = useSession();
	const { t } = useTranslation();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`sticky inset-x-0 top-0 z-40 py-3 transition-all duration-300 ${
				isScrolled
					? "border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
					: "border-b border-transparent"
			}`}
		>
			<div className="container mx-auto max-w-7xl px-4">
				{/* Desktop navigation */}
				<nav className="hidden items-center justify-between lg:flex">
					<div className="flex items-center">
						<LocaleLink href="/" className="flex items-center space-x-2">
							<span className="text-xl font-semibold">
								{t("common.appNameDemo")}
							</span>
						</LocaleLink>
					</div>
					<AppNavMenu />
					<div className="flex items-center gap-x-3">
						{session?.user ? (
							<UserPopover
								user={{
									name: session.user.name,
									email: session.user.email,
								}}
							/>
						) : (
							<>
								<LoginFormDialog />
								<Button size="sm" asChild>
									<LocaleLink href={Routes.AuthRegister}>
										{t("common.signUp")}
									</LocaleLink>
								</Button>
							</>
						)}
						<span
							className="h-5 w-px shrink-0 bg-border/60 dark:bg-white/15"
							aria-hidden="true"
						/>
						<ThemeToggle />
						<LanguageToggle />
					</div>
				</nav>
				{/* Mobile navigation */}
				<div className="flex items-center justify-between lg:hidden">
					<LocaleLink href="/" className="flex items-center gap-2">
						<span className="text-xl font-semibold">{t("common.appName")}</span>
					</LocaleLink>
					<AppMobileMenu />
				</div>
			</div>
		</header>
	);
}
