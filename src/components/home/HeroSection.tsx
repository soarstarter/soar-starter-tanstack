import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";

export function HeroSection() {
	const { t } = useTranslation();

	return (
		<div className="relative isolate overflow-x-hidden px-6 pt-4 lg:px-8">
			{/* Gradient glow background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 flex justify-center"
			>
				<div className="h-[32rem] w-[48rem] max-w-[90vw] rounded-full bg-primary/8 blur-[128px] dark:bg-primary/15" />
			</div>

			<div className="relative">
				<div className="pointer-events-none relative z-10 mx-auto max-w-5xl py-14 sm:py-16 lg:py-20">
					{/* Badge */}
					<div className="pointer-events-auto hidden sm:mb-10 sm:flex sm:justify-center">
						<Link
							to="/#tech-stack"
							className="group mx-auto flex w-fit items-center gap-3 rounded-full border border-border/80 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/40"
						>
							<span className="text-sm font-medium text-muted-foreground">
								{t("hero.badge")}
							</span>
							<span
								className="h-4 w-px shrink-0 bg-border/80 dark:bg-white/20"
								aria-hidden
							/>
							<span className="flex items-center text-sm font-medium text-primary transition-transform duration-300 group-hover:translate-x-0.5">
								<ArrowRight className="size-4" />
							</span>
						</Link>
					</div>

					<div className="text-center">
						<h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:tracking-tighter lg:text-6xl lg:leading-[1.1]">
							{t("hero.title")}
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-pretty text-base font-normal text-muted-foreground sm:text-lg/7">
							{t("hero.description")}
						</p>
						<div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
							<Button
								size="lg"
								className="rounded-full px-6 py-2.5 text-sm font-semibold shadow-md shadow-primary/15 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
								asChild
							>
								<Link to="/#pricing">{t("hero.getStarted")}</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-muted/80"
								asChild
							>
								<Link to="/#tech-stack">{t("hero.learnMore")}</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
