const techStack = [
	{
		name: "TanStack Start",
		icon: "T",
		description: "Full-stack SSR React framework with type-safe routing.",
		bgColor: "bg-black text-white",
	},
	{
		name: "BetterAuth",
		icon: "\uD83D\uDD10",
		description: "The best open source authentication library.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "Drizzle ORM",
		icon: "\u26A1",
		description: "Lightweight, performant, headless TypeScript ORM.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "Creem",
		icon: "C",
		description:
			"Smooth payments for SaaS and Indie Hackers that don't break the bank!",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "Shadcn UI",
		icon: "\u26A1",
		description: "Open source components for building modern websites.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "Tailwind CSS",
		icon: "\uD83C\uDF0A",
		description: "The CSS framework for rapid UI development.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "Resend",
		icon: "R",
		description: "The best modern email service for developers.",
		bgColor: "bg-black text-white",
	},
	{
		name: "Vercel AI SDK",
		icon: "\u25B2",
		description: "The open source AI Toolkit for TypeScript.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "ChatGPT",
		icon: "\uD83D\uDCAC",
		description: "The most powerful AI model with API access.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
	{
		name: "fumadocs",
		icon: "\u25CF",
		description: "The documentation framework for modern apps.",
		bgColor: "bg-gray-100 dark:bg-gray-800",
	},
];

export function IntegrateSection() {
	return (
		<section id="tech-stack" className="relative py-12 md:py-16">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<h2 className="mb-6 text-balance text-2xl text-foreground md:text-3xl lg:text-3xl">
						Build with your favorite tech stack
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Use the latest industry-standard tech stack for your next project
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{techStack.map((tech) => (
						<div
							key={tech.name}
							className="rounded-lg border bg-card p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
						>
							<div className="mb-4">
								<div
									className={`inline-flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold ${tech.bgColor}`}
								>
									{tech.icon}
								</div>
							</div>
							<h3 className="mb-2 text-lg font-semibold">{tech.name}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{tech.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
