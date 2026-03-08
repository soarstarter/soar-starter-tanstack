import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_marketing/about")({
	component: AboutPage,
});

function AboutPage() {
	const { t } = useTranslation();

	return (
		<section className="py-16 md:py-24">
			<div className="mx-auto max-w-3xl px-4 text-center">
				<h1 className="mb-4 text-4xl font-bold lg:text-5xl">
					{t("about.title")}
				</h1>
				<p className="mb-4 text-lg text-muted-foreground">
					{t("about.subtitle")}
				</p>
				<p className="mb-8 text-muted-foreground">{t("about.description")}</p>
				<Button asChild>
					<Link to="/contact">{t("about.contactUs")}</Link>
				</Button>
			</div>
		</section>
	);
}
