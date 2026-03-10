import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
	createContext,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Streamdown } from "streamdown";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import { cn } from "#/lib/utils";
import { Shimmer } from "./shimmer";

type ReasoningContextValue = {
	isStreaming: boolean;
	isOpen: boolean;
	duration?: number;
};

const reasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoningContext() {
	const context = useContext(reasoningContext);

	if (!context) {
		throw new Error("Reasoning components must be used within <Reasoning>.");
	}

	return context;
}

type ReasoningProps = ComponentProps<typeof Collapsible> & {
	isStreaming?: boolean;
	duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;

export const Reasoning = memo(
	({
		className,
		children,
		isStreaming = false,
		open,
		defaultOpen,
		onOpenChange,
		duration,
		...props
	}: ReasoningProps) => {
		const isControlled = open !== undefined;
		const [internalOpen, setInternalOpen] = useState(
			defaultOpen ?? isStreaming,
		);
		const [measuredDuration, setMeasuredDuration] = useState(duration);
		const startedAtRef = useRef<number | null>(isStreaming ? Date.now() : null);
		const hasStreamedRef = useRef(isStreaming);
		const isOpen = isControlled ? open : internalOpen;

		useEffect(() => {
			if (duration !== undefined) {
				setMeasuredDuration(duration);
			}
		}, [duration]);

		useEffect(() => {
			if (isStreaming) {
				hasStreamedRef.current = true;
				if (startedAtRef.current === null) {
					startedAtRef.current = Date.now();
				}
				if (!isOpen) {
					if (!isControlled) {
						setInternalOpen(true);
					}
					onOpenChange?.(true);
				}
				return;
			}

			if (startedAtRef.current !== null && duration === undefined) {
				setMeasuredDuration(
					Math.ceil((Date.now() - startedAtRef.current) / 1000),
				);
				startedAtRef.current = null;
			}
		}, [duration, isControlled, isOpen, isStreaming, onOpenChange]);

		useEffect(() => {
			if (!hasStreamedRef.current || isStreaming || !isOpen || isControlled) {
				return;
			}

			const timeoutId = window.setTimeout(() => {
				setInternalOpen(false);
				onOpenChange?.(false);
			}, AUTO_CLOSE_DELAY);

			return () => window.clearTimeout(timeoutId);
		}, [isControlled, isOpen, isStreaming, onOpenChange]);

		return (
			<Collapsible
				className={cn("mb-4 w-full", className)}
				onOpenChange={(nextOpen) => {
					if (!isControlled) {
						setInternalOpen(nextOpen);
					}
					onOpenChange?.(nextOpen);
				}}
				open={isOpen}
				{...props}
			>
				<reasoningContext.Provider
					value={{
						duration: measuredDuration,
						isOpen,
						isStreaming,
					}}
				>
					{children}
				</reasoningContext.Provider>
			</Collapsible>
		);
	},
);

export type ReasoningTriggerProps = ComponentProps<
	typeof CollapsibleTrigger
> & {
	getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

const defaultThinkingMessage = (isStreaming: boolean, duration?: number) => {
	if (isStreaming || duration === 0 || duration === undefined) {
		return <Shimmer duration={1}>Thinking...</Shimmer>;
	}

	return <span>Thought for {duration} seconds</span>;
};

export const ReasoningTrigger = ({
	className,
	children,
	getThinkingMessage = defaultThinkingMessage,
	...props
}: ReasoningTriggerProps) => {
	const { duration, isOpen, isStreaming } = useReasoningContext();

	return (
		<CollapsibleTrigger
			className={cn(
				"flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
				className,
			)}
			{...props}
		>
			{children ?? (
				<>
					<BrainIcon className="size-4" />
					{getThinkingMessage(isStreaming, duration)}
					<ChevronDownIcon
						className={cn(
							"size-4 transition-transform",
							isOpen ? "rotate-180" : "rotate-0",
						)}
					/>
				</>
			)}
		</CollapsibleTrigger>
	);
};

const reasoningPlugins = { cjk, code, math, mermaid };

export type ReasoningContentProps = ComponentProps<
	typeof CollapsibleContent
> & {
	children: string;
};

export const ReasoningContent = memo(
	({ className, children, ...props }: ReasoningContentProps) => (
		<CollapsibleContent
			className={cn(
				"mt-3 overflow-hidden rounded-2xl border bg-background/70 p-4 text-sm text-muted-foreground",
				"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
				"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
				className,
			)}
			{...props}
		>
			<Streamdown
				className="prose prose-sm max-w-none dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
				plugins={reasoningPlugins}
			>
				{children}
			</Streamdown>
		</CollapsibleContent>
	),
);

Reasoning.displayName = "Reasoning";
ReasoningContent.displayName = "ReasoningContent";
