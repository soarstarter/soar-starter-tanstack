import { createFileRoute } from "@tanstack/react-router";
import { CallToAction } from "#/components/home/CallToAction";
import { ContentSection } from "#/components/home/ContentSection";
import { FaqSection } from "#/components/home/FaqSection";
import { FeatureSection } from "#/components/home/FeatureSection";
import { HeroSection } from "#/components/home/HeroSection";
import { IntegrateSection } from "#/components/home/IntegrateSection";
import { LogoCloud } from "#/components/home/LogoCloud";
import { PriceSection } from "#/components/home/PriceSection";
import { StaticSection } from "#/components/home/StaticSection";
import { Testimonials } from "#/components/home/Testimonials";

export const Route = createFileRoute("/_marketing/")({
	component: HomePage,
});

function HomePage() {
	return (
		<>
			<HeroSection />
			<LogoCloud />
			<FeatureSection />
			<StaticSection />
			<IntegrateSection />
			<ContentSection />
			<PriceSection />
			<Testimonials />
			<FaqSection />
			<CallToAction />
		</>
	);
}
