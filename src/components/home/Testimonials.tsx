import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Card, CardContent } from "#/components/ui/card";

const testimonials = [
	{
		name: "Alex Chen",
		role: "CTO at TechFlow",
		content:
			"SoarStarter saved us months of development time. The auth and payment integrations just work out of the box.",
	},
	{
		name: "Sarah Kim",
		role: "Indie Hacker",
		content:
			"I launched my SaaS in a weekend using this starter. The code quality is exceptional and it's easy to customize.",
	},
	{
		name: "Michael Torres",
		role: "Senior Developer",
		content:
			"The TanStack Start integration is brilliant. Type-safe routing and server functions make development a joy.",
	},
	{
		name: "Emily Zhang",
		role: "Product Manager",
		content:
			"Our team shipped 3x faster with SoarStarter. The dashboard layout and admin panel saved us weeks of work.",
	},
	{
		name: "David Park",
		role: "Freelance Developer",
		content:
			"Best starter template I've ever used. The i18n support and email templates are production-ready.",
	},
	{
		name: "Lisa Wang",
		role: "Startup Founder",
		content:
			"From idea to paying customers in under a week. SoarStarter handles all the boring infrastructure.",
	},
	{
		name: "James Lee",
		role: "Full-Stack Developer",
		content:
			"The Drizzle ORM integration is clean and the payment webhook handling with Creem is solid.",
	},
	{
		name: "Anna Martin",
		role: "Design Engineer",
		content:
			"Shadcn/ui components with Tailwind v4 give us a beautiful, consistent design system from day one.",
	},
	{
		name: "Robert Huang",
		role: "Tech Lead",
		content:
			"We evaluated 10+ starters before choosing SoarStarter. The architecture is well thought out and maintainable.",
	},
];

export function Testimonials() {
	return (
		<section className="py-12 md:py-20">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-3xl font-semibold lg:text-4xl">
						Loved by developers
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground">
						See what developers are saying about building with SoarStarter.
					</p>
				</div>

				<div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
					{testimonials.map((testimonial) => (
						<Card key={testimonial.name} className="break-inside-avoid">
							<CardContent className="p-6">
								<p className="mb-4 text-sm text-muted-foreground">
									"{testimonial.content}"
								</p>
								<div className="flex items-center gap-3">
									<Avatar className="size-8">
										<AvatarFallback className="text-xs">
											{testimonial.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">{testimonial.name}</p>
										<p className="text-xs text-muted-foreground">
											{testimonial.role}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
