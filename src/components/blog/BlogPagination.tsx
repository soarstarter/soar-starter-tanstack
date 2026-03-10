import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { LocaleLink } from "#/i18n/routing";
import { buildBlogListHref } from "#/lib/blog";
import { cn } from "#/lib/utils";

type BlogPaginationProps = {
	currentPage: number;
	totalPages: number;
	pathname: string;
	selectedTag?: string;
};

export function BlogPagination({
	currentPage,
	totalPages,
	pathname,
	selectedTag,
}: BlogPaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<nav className="flex items-center gap-2" aria-label="Blog pagination">
			{currentPage > 1 ? (
				<PageLink
					href={buildBlogListHref({
						pathname,
						tag: selectedTag,
						page: currentPage - 1,
					})}
					label={<ChevronLeft className="size-4" />}
				/>
			) : (
				<PageSlot disabled>
					<ChevronLeft className="size-4" />
				</PageSlot>
			)}
			{Array.from({ length: totalPages }, (_, index) => index + 1).map(
				(page) => (
					<PageLink
						key={page}
						href={buildBlogListHref({ pathname, tag: selectedTag, page })}
						label={page}
						active={page === currentPage}
					/>
				),
			)}
			{currentPage < totalPages ? (
				<PageLink
					href={buildBlogListHref({
						pathname,
						tag: selectedTag,
						page: currentPage + 1,
					})}
					label={<ChevronRight className="size-4" />}
				/>
			) : (
				<PageSlot disabled>
					<ChevronRight className="size-4" />
				</PageSlot>
			)}
		</nav>
	);
}

function PageLink({
	href,
	label,
	active = false,
}: {
	href: string;
	label: ReactNode;
	active?: boolean;
}) {
	return (
		<LocaleLink
			href={href}
			className={cn(
				"inline-flex size-10 items-center justify-center rounded-xl border text-sm font-semibold no-underline transition-colors",
				active
					? "border-transparent bg-[var(--lagoon-deep)] text-white"
					: "border-[var(--chip-line)] bg-[var(--chip-bg)] text-foreground hover:bg-white/90 dark:hover:bg-white/10",
			)}
		>
			{label}
		</LocaleLink>
	);
}

function PageSlot({
	children,
	disabled = false,
}: {
	children: ReactNode;
	disabled?: boolean;
}) {
	return (
		<span
			className={cn(
				"inline-flex size-10 items-center justify-center rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] text-sm font-semibold",
				disabled && "cursor-not-allowed opacity-45",
			)}
		>
			{children}
		</span>
	);
}
