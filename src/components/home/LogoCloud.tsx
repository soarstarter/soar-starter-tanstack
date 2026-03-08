const logos = [
	{
		src: "https://html.tailus.io/blocks/customers/nvidia.svg",
		alt: "Nvidia",
		height: "h-5",
	},
	{
		src: "https://html.tailus.io/blocks/customers/column.svg",
		alt: "Column",
		height: "h-4",
	},
	{
		src: "https://html.tailus.io/blocks/customers/github.svg",
		alt: "GitHub",
		height: "h-4",
	},
	{
		src: "https://html.tailus.io/blocks/customers/nike.svg",
		alt: "Nike",
		height: "h-5",
	},
	{
		src: "https://html.tailus.io/blocks/customers/laravel.svg",
		alt: "Laravel",
		height: "h-4",
	},
	{
		src: "https://html.tailus.io/blocks/customers/lilly.svg",
		alt: "Lilly",
		height: "h-7",
	},
	{
		src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg",
		alt: "Lemon Squeezy",
		height: "h-5",
	},
	{
		src: "https://html.tailus.io/blocks/customers/openai.svg",
		alt: "OpenAI",
		height: "h-6",
	},
	{
		src: "https://html.tailus.io/blocks/customers/tailwindcss.svg",
		alt: "Tailwind CSS",
		height: "h-4",
	},
	{
		src: "https://html.tailus.io/blocks/customers/vercel.svg",
		alt: "Vercel",
		height: "h-5",
	},
	{
		src: "https://html.tailus.io/blocks/customers/zapier.svg",
		alt: "Zapier",
		height: "h-5",
	},
];

export function LogoCloud() {
	return (
		<section className="bg-background py-16">
			<div className="mx-auto max-w-5xl px-4">
				<h2 className="text-center text-lg font-medium">
					Your favorite companies are our partners.
				</h2>
				<div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
					{logos.map((logo) => (
						<img
							key={logo.alt}
							className={`${logo.height} w-fit dark:invert`}
							src={logo.src}
							alt={`${logo.alt} Logo`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
