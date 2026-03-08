import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";

export function CallToAction() {
	const { t } = useTranslation();

	return (
		<section className="py-12 md:py-20">
			<div className="mx-auto max-w-3xl px-4 text-center">
				<h2 className="mb-4 text-3xl font-semibold lg:text-4xl">
					{t("cta.heading")}
				</h2>
				<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
					{t("cta.description")}
				</p>
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Button size="lg" className="rounded-full px-8" asChild>
						<Link to="/#pricing">{t("cta.getStarted")}</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="rounded-full px-8"
						asChild
					>
						<Link to="/contact">{t("cta.contactUs")}</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
