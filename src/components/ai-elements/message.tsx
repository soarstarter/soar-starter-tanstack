import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import type { ComponentProps, HTMLAttributes } from "react";
import { memo } from "react";
import { Streamdown } from "streamdown";
import { Button } from "#/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
	from: "user" | "assistant" | "system" | "data" | "tool";
};

export const Message = ({ className, from, ...props }: MessageProps) => (
	<div
		className={cn(
			"flex w-full max-w-[95%] flex-col gap-2",
			from === "user" ? "ml-auto items-end" : "items-start",
			className,
		)}
		{...props}
	/>
);

export const MessageContent = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"w-fit max-w-full overflow-hidden rounded-2xl px-4 py-3 text-sm shadow-sm",
			"data-[from=assistant]:border data-[from=assistant]:bg-background/80",
			"data-[from=user]:bg-primary data-[from=user]:text-primary-foreground",
			className,
		)}
		{...props}
	/>
);

export const MessageActions = ({
	className,
	...props
}: ComponentProps<"div">) => (
	<div className={cn("flex items-center gap-1", className)} {...props} />
);

export type MessageActionProps = ComponentProps<typeof Button> & {
	tooltip?: string;
	label?: string;
};

export const MessageAction = ({
	children,
	tooltip,
	label,
	size = "icon-sm",
	variant = "ghost",
	...props
}: MessageActionProps) => {
	const button = (
		<Button size={size} type="button" variant={variant} {...props}>
			{children}
			<span className="sr-only">{label || tooltip}</span>
		</Button>
	);

	if (!tooltip) {
		return button;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const streamdownPlugins = { cjk, code, math, mermaid };

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
	({ className, ...props }: MessageResponseProps) => (
		<Streamdown
			className={cn(
				"prose prose-sm max-w-none text-current dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
				className,
			)}
			plugins={streamdownPlugins}
			{...props}
		/>
	),
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

MessageResponse.displayName = "MessageResponse";
