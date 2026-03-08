import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "#/components/Logo";
import ThemeToggle from "#/components/ThemeToggle";
import { footerLinkGroups } from "#/config/footer-config";
import { getSocialLinks } from "#/config/social-config";

export function AppFooter() {
	const { t } = useTranslation();
	const socialLinks = getSocialLinks();
	const year = new Date().getFullYear();

	return (
		<footer className="border-t">
			<div className="container mx-auto max-w-7xl px-4">
				<div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
					<div className="col-span-full flex flex-col items-start md:col-span-2">
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Logo />
								<span className="text-xl font-semibold">
									{t("common.appName")}
								</span>
							</div>
							<p className="py-2 text-base text-muted-foreground md:pr-12">
								{t("common.tagline")}
							</p>
							<div className="flex items-center gap-2 py-2">
								{socialLinks.map((link) => (
									<a
										key={link.title}
										href={link.href || "#"}
										target="_blank"
										rel="noreferrer"
										aria-label={link.title}
										className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-accent hover:text-accent-foreground"
									>
										<span className="sr-only">{link.title}</span>
										{typeof link.icon === "string" ? (
											<span className="text-xs">{link.title[0]}</span>
										) : (
											<span className="[&>svg]:h-4 [&>svg]:w-4">
												{link.icon}
											</span>
										)}
									</a>
								))}
							</div>
						</div>
					</div>
					{footerLinkGroups.map((section) => (
						<div
							key={section.title}
							className="col-span-1 items-start md:col-span-1"
						>
							<span className="text-sm font-semibold uppercase">
								{section.title}
							</span>
							<ul className="mt-4 list-inside space-y-3">
								{section.items?.map((item) => (
									<li key={item.title}>
										{item.href && (
											<Link
												to={item.href}
												target={item.external ? "_blank" : undefined}
												className="text-sm text-muted-foreground hover:text-primary"
											>
												{item.title}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<div className="border-t py-8">
				<div className="container mx-auto flex max-w-7xl items-center justify-between gap-x-4 px-4">
					<span className="text-sm text-muted-foreground">
						{t("common.copyright", { year })}
					</span>
					<div className="flex items-center gap-x-4">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
}
