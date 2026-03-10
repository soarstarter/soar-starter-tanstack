import type { TOCItemType } from "fumadocs-core/toc";
import { cn } from "#/lib/utils";

type BlogTocProps = {
	items: TOCItemType[];
};

export function BlogToc({ items }: BlogTocProps) {
	const visibleItems = items.filter(
		(item) => item.depth >= 2 && item.depth <= 3,
	);

	if (visibleItems.length === 0) {
		return null;
	}

	return (
		<nav aria-label="Table of contents">
			<ul className="space-y-2">
				{visibleItems.map((item) => (
					<li key={item.url}>
						<a
							href={item.url}
							className={cn(
								"block text-sm leading-6 no-underline transition-colors hover:text-[var(--lagoon-deep)]",
								item.depth === 2
									? "font-semibold text-foreground"
									: "pl-4 text-muted-foreground",
							)}
						>
							{item.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
