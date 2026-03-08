import { useTranslation } from "react-i18next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";

const faqKeys = [
	"faq.whatIsSoarStarter",
	"faq.techStack",
	"faq.customization",
	"faq.support",
	"faq.updates",
] as const;

export function FaqSection() {
	const { t } = useTranslation();

	return (
		<section className="py-12 md:py-20">
			<div className="mx-auto max-w-3xl px-4">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-semibold lg:text-4xl">
						Frequently Asked Questions
					</h2>
					<p className="text-muted-foreground">
						Everything you need to know about SoarStarter.
					</p>
				</div>

				<Accordion type="single" collapsible className="w-full">
					{faqKeys.map((key, i) => (
						<AccordionItem key={key} value={`faq-${i}`}>
							<AccordionTrigger>{t(`${key}.question`)}</AccordionTrigger>
							<AccordionContent>{t(`${key}.answer`)}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
