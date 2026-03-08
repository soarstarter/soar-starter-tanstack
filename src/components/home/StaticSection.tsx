const stats = [
	{ value: "+1200", label: "Stars on GitHub" },
	{ value: "22 Million", label: "Active Users" },
	{ value: "+500", label: "Powered Apps" },
];

export function StaticSection() {
	return (
		<section className="py-4 md:py-8">
			<div className="mx-auto max-w-5xl space-y-8 px-4 md:space-y-16">
				<div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
					<h2 className="text-4xl font-medium lg:text-5xl">
						SoarStarter in numbers
					</h2>
					<p>
						Building the next generation of SaaS applications with modern tools
						and frameworks.
					</p>
				</div>

				<div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
					{stats.map((stat) => (
						<div key={stat.label} className="space-y-4">
							<div className="text-5xl font-bold">{stat.value}</div>
							<p>{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
