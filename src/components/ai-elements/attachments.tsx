import type { FileUIPart, SourceDocumentUIPart } from "ai";
import {
	FileTextIcon,
	GlobeIcon,
	ImageIcon,
	Music2Icon,
	PaperclipIcon,
	VideoIcon,
	XIcon,
} from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export type AttachmentData =
	| (FileUIPart & { id: string })
	| (SourceDocumentUIPart & { id: string });

export type AttachmentVariant = "grid" | "inline" | "list";

type AttachmentMediaCategory =
	| "image"
	| "video"
	| "audio"
	| "document"
	| "source"
	| "unknown";

const attachmentsContext = createContext<{ variant: AttachmentVariant } | null>(
	null,
);
const attachmentContext = createContext<{
	data: AttachmentData;
	onRemove?: () => void;
	variant: AttachmentVariant;
	mediaCategory: AttachmentMediaCategory;
} | null>(null);

function useAttachmentContext() {
	const context = useContext(attachmentContext);

	if (!context) {
		throw new Error("Attachment components must be used inside <Attachment>.");
	}

	return context;
}

function getMediaCategory(data: AttachmentData): AttachmentMediaCategory {
	if (data.type === "source-document") {
		return "source";
	}

	const mediaType = data.mediaType ?? "";

	if (mediaType.startsWith("image/")) {
		return "image";
	}

	if (mediaType.startsWith("video/")) {
		return "video";
	}

	if (mediaType.startsWith("audio/")) {
		return "audio";
	}

	if (mediaType.startsWith("application/") || mediaType.startsWith("text/")) {
		return "document";
	}

	return "unknown";
}

function getLabel(data: AttachmentData) {
	if (data.type === "source-document") {
		return data.title || data.filename || "Source";
	}

	return data.filename || "Attachment";
}

export type AttachmentsProps = HTMLAttributes<HTMLDivElement> & {
	variant?: AttachmentVariant;
};

export const Attachments = ({
	className,
	children,
	variant = "grid",
	...props
}: AttachmentsProps) => {
	const value = useMemo(() => ({ variant }), [variant]);

	return (
		<attachmentsContext.Provider value={value}>
			<div
				className={cn(
					"flex items-start",
					variant === "grid" ? "flex-wrap gap-2" : "",
					variant === "inline" ? "flex-wrap gap-2" : "",
					variant === "list" ? "flex-col gap-2" : "",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</attachmentsContext.Provider>
	);
};

export type AttachmentProps = HTMLAttributes<HTMLDivElement> & {
	data: AttachmentData;
	onRemove?: () => void;
};

export const Attachment = ({
	className,
	children,
	data,
	onRemove,
	...props
}: AttachmentProps) => {
	const variant = useContext(attachmentsContext)?.variant ?? "grid";
	const mediaCategory = getMediaCategory(data);
	const value = useMemo(
		() => ({ data, onRemove, variant, mediaCategory }),
		[data, onRemove, variant, mediaCategory],
	);

	return (
		<attachmentContext.Provider value={value}>
			<div
				className={cn(
					"group relative",
					variant === "grid" &&
						"size-24 overflow-hidden rounded-xl border bg-muted/40",
					variant === "inline" &&
						"flex max-w-full items-center gap-2 rounded-full border bg-background/75 px-2.5 py-1.5 text-sm",
					variant === "list" &&
						"flex w-full items-center gap-3 rounded-xl border bg-background/65 p-3",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</attachmentContext.Provider>
	);
};

export type AttachmentPreviewProps = HTMLAttributes<HTMLDivElement> & {
	fallbackIcon?: ReactNode;
};

export const AttachmentPreview = ({
	className,
	fallbackIcon,
	...props
}: AttachmentPreviewProps) => {
	const { data, mediaCategory, variant } = useAttachmentContext();

	const content = (() => {
		if (mediaCategory === "image" && data.type === "file" && data.url) {
			return (
				<img
					alt={getLabel(data)}
					className="size-full object-cover"
					src={data.url}
				/>
			);
		}

		if (mediaCategory === "video" && data.type === "file" && data.url) {
			return <video className="size-full object-cover" muted src={data.url} />;
		}

		const iconMap: Record<AttachmentMediaCategory, typeof PaperclipIcon> = {
			audio: Music2Icon,
			document: FileTextIcon,
			image: ImageIcon,
			source: GlobeIcon,
			unknown: PaperclipIcon,
			video: VideoIcon,
		};
		const Icon = iconMap[mediaCategory];

		return fallbackIcon ?? <Icon className="size-4 text-muted-foreground" />;
	})();

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center overflow-hidden",
				variant === "grid" && "size-full bg-muted",
				variant === "inline" && "size-6 rounded-full bg-muted/70",
				variant === "list" && "size-12 rounded-lg bg-muted/70",
				className,
			)}
			{...props}
		>
			{content}
		</div>
	);
};

export const AttachmentInfo = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const { data, variant } = useAttachmentContext();

	if (variant === "grid") {
		return null;
	}

	return (
		<div className={cn("min-w-0 flex-1", className)} {...props}>
			<p className="truncate font-medium text-sm">{getLabel(data)}</p>
			{"mediaType" in data && data.mediaType ? (
				<p className="truncate text-muted-foreground text-xs">
					{data.mediaType}
				</p>
			) : null}
		</div>
	);
};

export type AttachmentRemoveProps = ComponentProps<typeof Button> & {
	label?: string;
};

export const AttachmentRemove = ({
	className,
	children,
	label = "Remove attachment",
	...props
}: AttachmentRemoveProps) => {
	const { onRemove, variant } = useAttachmentContext();

	if (!onRemove) {
		return null;
	}

	return (
		<Button
			aria-label={label}
			className={cn(
				variant === "grid" &&
					"absolute right-2 top-2 opacity-0 shadow-sm group-hover:opacity-100",
				variant === "inline" && "size-6 rounded-full",
				variant === "list" && "size-8 rounded-full",
				className,
			)}
			onClick={(event) => {
				event.stopPropagation();
				onRemove();
			}}
			size="icon-xs"
			type="button"
			variant="ghost"
			{...props}
		>
			{children ?? <XIcon className="size-3" />}
		</Button>
	);
};
