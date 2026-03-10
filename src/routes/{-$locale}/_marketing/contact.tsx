import { createFileRoute } from "@tanstack/react-router";
import { ContactFormCard } from "#/components/contact/ContactFormCard";
import { buildSeoMeta } from "#/lib/seo";

export const Route = createFileRoute("/{-$locale}/_marketing/contact")({
	head: () =>
		buildSeoMeta({
			title: "Contact",
			description:
				"Contact the Soar Starter team for product questions, implementation help, and partnership inquiries.",
			path: "/contact",
		}),
	component: ContactPage,
});

function ContactPage() {
	return (
		<section className="py-16 md:py-24">
			<div className="mx-auto max-w-5xl px-4">
				<ContactFormCard />
			</div>
		</section>
	);
}
