import { ChartBar, Database, Fingerprint, IdCard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";

const featureIcons = [Database, Fingerprint, IdCard, ChartBar] as const;

const featureKeys = [
	"features.databaseVisualization",
	"features.advancedAuthentication",
	"features.identityManagement",
	"features.analyticsDashboard",
] as const;

export function FeatureSection() {
	const [activeItem, setActiveItem] = useState("item-1");
	const { t } = useTranslation();

	const features = featureKeys.map((key, i) => ({
		value: `item-${i + 1}`,
		icon: featureIcons[i],
		title: t(key),
		description: t("features.featureDescription"),
	}));

	return (
		<section id="features" className="relative py-8 md:py-16 lg:py-20">
			<div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
				<div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
					<h2 className="text-balance text-4xl font-semibold lg:text-6xl">
						{t("features.heading")}
					</h2>
					<p>{t("features.description")}</p>
				</div>

				<div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
					<Accordion
						type="single"
						value={activeItem}
						onValueChange={(val) => val && setActiveItem(val)}
						className="w-full"
					>
						{features.map((feature) => (
							<AccordionItem key={feature.value} value={feature.value}>
								<AccordionTrigger>
									<div className="flex items-center gap-2 text-base">
										<feature.icon className="size-4" />
										{feature.title}
									</div>
								</AccordionTrigger>
								<AccordionContent>{feature.description}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					<div className="relative flex overflow-hidden rounded-3xl border bg-background p-2">
						<div className="absolute inset-0 right-0 ml-auto w-15 border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]" />
						<div className="relative aspect-[76/59] w-[calc(3/4*100%+3rem)] rounded-2xl bg-background">
							<div className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
								<div className="flex size-full items-center justify-center text-muted-foreground">
									Feature Preview {activeItem.split("-")[1]}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
