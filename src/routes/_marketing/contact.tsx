import { createFileRoute } from "@tanstack/react-router";
import { ContactFormCard } from "#/components/contact/ContactFormCard";

export const Route = createFileRoute("/_marketing/contact")({
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
