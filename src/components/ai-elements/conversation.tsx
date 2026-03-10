import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
	<StickToBottom
		className={cn("relative flex-1 overflow-hidden", className)}
		initial="smooth"
		resize="smooth"
		role="log"
		{...props}
	/>
);

export type ConversationContentProps = ComponentProps<
	typeof StickToBottom.Content
>;

export const ConversationContent = ({
	className,
	...props
}: ConversationContentProps) => (
	<StickToBottom.Content
		className={cn("flex min-h-full flex-col gap-6 px-4 py-5", className)}
		{...props}
	/>
);

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
	title?: string;
	description?: string;
	icon?: ReactNode;
};

export const ConversationEmptyState = ({
	className,
	title = "Start the conversation",
	description = "Send a message to see the model respond here.",
	icon,
	children,
	...props
}: ConversationEmptyStateProps) => (
	<div
		className={cn(
			"flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 px-6 py-12 text-center",
			className,
		)}
		{...props}
	>
		{children ?? (
			<>
				{icon ? <div className="text-muted-foreground">{icon}</div> : null}
				<div className="space-y-1">
					<h3 className="font-medium text-sm">{title}</h3>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
			</>
		)}
	</div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
	className,
	...props
}: ConversationScrollButtonProps) => {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();
	const handleScrollToBottom = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	if (isAtBottom) {
		return null;
	}

	return (
		<Button
			className={cn(
				"absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full",
				className,
			)}
			onClick={handleScrollToBottom}
			size="icon-sm"
			type="button"
			variant="outline"
			{...props}
		>
			<ArrowDownIcon className="size-4" />
		</Button>
	);
};
