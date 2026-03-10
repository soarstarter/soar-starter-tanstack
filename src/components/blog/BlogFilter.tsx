import { LocaleLink } from "#/i18n/routing";
import { buildBlogListHref } from "#/lib/blog";
import { cn } from "#/lib/utils";

type BlogFilterProps = {
	tags: string[];
	selectedTag?: string;
	pathname: string;
	allLabel: string;
};

export function BlogFilter({
	tags,
	selectedTag,
	pathname,
	allLabel,
}: BlogFilterProps) {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			<FilterChip
				href={buildBlogListHref({ pathname })}
				label={allLabel}
				active={!selectedTag}
			/>
			{tags.map((tag) => (
				<FilterChip
					key={tag}
					href={buildBlogListHref({ pathname, tag })}
					label={tag}
					active={selectedTag === tag}
				/>
			))}
		</div>
	);
}

function FilterChip({
	href,
	label,
	active,
}: {
	href: string;
	label: string;
	active: boolean;
}) {
	return (
		<LocaleLink
			href={href}
			className={cn(
				"inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold no-underline transition-colors",
				active
					? "border-transparent bg-[var(--lagoon-deep)] text-white shadow-sm"
					: "border-[var(--chip-line)] bg-[var(--chip-bg)] text-foreground hover:bg-white/90 dark:hover:bg-white/10",
			)}
		>
			{label}
		</LocaleLink>
	);
}
