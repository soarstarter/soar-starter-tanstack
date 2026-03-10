import { BookIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import { cn } from "#/lib/utils";

export const Sources = ({ className, ...props }: ComponentProps<"div">) => (
	<Collapsible
		className={cn("mb-4 text-primary text-xs", className)}
		{...props}
	/>
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
	count: number;
};

export const SourcesTrigger = ({
	className,
	count,
	children,
	...props
}: SourcesTriggerProps) => (
	<CollapsibleTrigger
		className={cn("flex items-center gap-2 font-medium", className)}
		{...props}
	>
		{children ?? (
			<>
				<span>
					Used {count} source{count === 1 ? "" : "s"}
				</span>
				<ChevronDownIcon className="size-4" />
			</>
		)}
	</CollapsibleTrigger>
);

export const SourcesContent = ({
	className,
	...props
}: ComponentProps<typeof CollapsibleContent>) => (
	<CollapsibleContent
		className={cn(
			"mt-3 flex flex-col gap-2",
			"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
			"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
			className,
		)}
		{...props}
	/>
);

export const Source = ({
	href,
	title,
	children,
	...props
}: ComponentProps<"a">) => (
	<a
		className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 text-sm no-underline transition-colors hover:bg-accent"
		href={href}
		rel="noreferrer"
		target="_blank"
		{...props}
	>
		{children ?? (
			<>
				<BookIcon className="size-4" />
				<span className="truncate">{title}</span>
			</>
		)}
	</a>
);
