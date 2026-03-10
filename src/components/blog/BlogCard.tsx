import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { LocaleLink, useCurrentLocale } from "#/i18n/routing";
import { type BlogPostSummary, formatBlogDate } from "#/lib/blog";

export function BlogCard({
	title,
	description,
	date,
	author,
	tags,
	slug,
	image,
}: BlogPostSummary) {
	const locale = useCurrentLocale();

	return (
		<LocaleLink
			href={`/blog/${slug}`}
			className="group block h-full no-underline"
		>
			<Card className="feature-card island-shell h-full gap-0 overflow-hidden border-white/50 bg-white/75 py-0 transition-transform duration-200 group-hover:-translate-y-1 dark:bg-white/5">
				<div
					className="relative min-h-36 border-b border-border/60 bg-[linear-gradient(135deg,rgba(79,184,178,0.18),rgba(255,255,255,0.85),rgba(47,106,74,0.1))] px-6 py-5 dark:bg-[linear-gradient(135deg,rgba(96,215,207,0.16),rgba(15,27,31,0.92),rgba(110,200,154,0.12))]"
					style={
						image
							? {
									backgroundImage: `linear-gradient(135deg, rgba(23,58,64,0.78), rgba(23,58,64,0.22)), url(${image})`,
									backgroundPosition: "center",
									backgroundSize: "cover",
								}
							: undefined
					}
				>
					<div className="island-kicker mb-3">Article</div>
					<div className="flex items-start justify-between gap-4">
						<CardTitle className="text-xl leading-tight">{title}</CardTitle>
						<ArrowUpRight className="mt-1 size-4 shrink-0 text-[var(--lagoon-deep)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</div>
					{description ? (
						<CardDescription className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
							{description}
						</CardDescription>
					) : null}
				</div>
				<CardHeader className="gap-3 border-b border-border/50 py-4">
					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
						<span className="inline-flex items-center gap-2">
							<CalendarDays className="size-4" />
							{formatBlogDate(date, locale)}
						</span>
						{author ? (
							<span className="inline-flex items-center gap-2">
								<UserRound className="size-4" />
								{author}
							</span>
						) : null}
					</div>
				</CardHeader>
				<CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-6">
					<div className="flex flex-wrap gap-2">
						{tags.slice(0, 4).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-[0.72rem] font-semibold tracking-[0.04em]"
							>
								{tag}
							</Badge>
						))}
					</div>
					<div className="mt-auto text-sm font-semibold text-[var(--lagoon-deep)]">
						Read article
					</div>
				</CardContent>
			</Card>
		</LocaleLink>
	);
}
