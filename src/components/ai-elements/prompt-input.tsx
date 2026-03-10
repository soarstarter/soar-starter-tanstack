import type { ChatStatus, FileUIPart } from "ai";
import {
	CornerDownLeftIcon,
	ImageIcon,
	Loader2Icon,
	PlusIcon,
	SquareIcon,
} from "lucide-react";
import type {
	ClipboardEventHandler,
	ComponentProps,
	FormEvent,
	HTMLAttributes,
	KeyboardEventHandler,
} from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";

type PromptAttachment = FileUIPart & { id: string };

type PromptInputAttachmentsContextValue = {
	files: PromptAttachment[];
	add: (files: FileList | File[]) => void;
	remove: (id: string) => void;
	clear: () => void;
	openFileDialog: () => void;
};

const promptInputAttachmentsContext =
	createContext<PromptInputAttachmentsContextValue | null>(null);

function createAttachmentId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}

	return `attachment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function convertBlobUrlToDataUrl(url: string) {
	try {
		const response = await fetch(url);
		const blob = await response.blob();

		return await new Promise<string | null>((resolve) => {
			const reader = new FileReader();

			reader.onloadend = () => {
				resolve(typeof reader.result === "string" ? reader.result : null);
			};
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

function usePromptAttachmentsContext() {
	const context = useContext(promptInputAttachmentsContext);

	if (!context) {
		throw new Error(
			"Prompt input attachment hooks must be used inside <PromptInput>.",
		);
	}

	return context;
}

export function usePromptInputAttachments() {
	return usePromptAttachmentsContext();
}

export interface PromptInputMessage {
	text: string;
	files: FileUIPart[];
}

type PromptInputProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	accept?: string;
	multiple?: boolean;
	globalDrop?: boolean;
	onSubmit: (
		message: PromptInputMessage,
		event: FormEvent<HTMLFormElement>,
	) => void | Promise<void>;
};

export function PromptInput({
	accept,
	children,
	className,
	globalDrop = false,
	multiple = false,
	onSubmit,
	...props
}: PromptInputProps) {
	const [files, setFiles] = useState<PromptAttachment[]>([]);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const formRef = useRef<HTMLFormElement | null>(null);

	const add = useCallback(
		(nextFiles: FileList | File[]) => {
			const fileArray = [...nextFiles];

			if (fileArray.length === 0) {
				return;
			}

			setFiles((currentFiles) => {
				const acceptedFiles = fileArray.filter((file) => {
					if (!accept) {
						return true;
					}

					return accept
						.split(",")
						.map((item) => item.trim())
						.filter(Boolean)
						.some((pattern) =>
							pattern.endsWith("/*")
								? file.type.startsWith(pattern.slice(0, -1))
								: file.type === pattern,
						);
				});

				const limitedFiles = multiple
					? acceptedFiles
					: acceptedFiles.slice(0, 1);

				const nextAttachments = limitedFiles.map((file) => ({
					filename: file.name,
					id: createAttachmentId(),
					mediaType: file.type,
					type: "file" as const,
					url: URL.createObjectURL(file),
				}));

				return multiple
					? [...currentFiles, ...nextAttachments]
					: nextAttachments;
			});
		},
		[accept, multiple],
	);

	const remove = useCallback((id: string) => {
		setFiles((currentFiles) => {
			const target = currentFiles.find((file) => file.id === id);

			if (target?.url.startsWith("blob:")) {
				URL.revokeObjectURL(target.url);
			}

			return currentFiles.filter((file) => file.id !== id);
		});
	}, []);

	const clear = useCallback(() => {
		setFiles((currentFiles) => {
			for (const file of currentFiles) {
				if (file.url.startsWith("blob:")) {
					URL.revokeObjectURL(file.url);
				}
			}

			return [];
		});
	}, []);

	const openFileDialog = useCallback(() => {
		inputRef.current?.click();
	}, []);

	useEffect(() => clear, [clear]);

	useEffect(() => {
		if (!globalDrop) {
			return;
		}

		const handleDragOver = (event: DragEvent) => {
			if (event.dataTransfer?.types.includes("Files")) {
				event.preventDefault();
			}
		};

		const handleDrop = (event: DragEvent) => {
			if (event.dataTransfer?.files.length) {
				event.preventDefault();
				add(event.dataTransfer.files);
			}
		};

		document.addEventListener("dragover", handleDragOver);
		document.addEventListener("drop", handleDrop);

		return () => {
			document.removeEventListener("dragover", handleDragOver);
			document.removeEventListener("drop", handleDrop);
		};
	}, [add, globalDrop]);

	useEffect(() => {
		if (globalDrop || !formRef.current) {
			return;
		}

		const form = formRef.current;
		const handleDragOver = (event: DragEvent) => {
			if (event.dataTransfer?.types.includes("Files")) {
				event.preventDefault();
			}
		};

		const handleDrop = (event: DragEvent) => {
			if (event.dataTransfer?.files.length) {
				event.preventDefault();
				add(event.dataTransfer.files);
			}
		};

		form.addEventListener("dragover", handleDragOver);
		form.addEventListener("drop", handleDrop);

		return () => {
			form.removeEventListener("dragover", handleDragOver);
			form.removeEventListener("drop", handleDrop);
		};
	}, [add, globalDrop]);

	const attachmentsContextValue = useMemo(
		() => ({
			add,
			clear,
			files,
			openFileDialog,
			remove,
		}),
		[add, clear, files, openFileDialog, remove],
	);

	return (
		<promptInputAttachmentsContext.Provider value={attachmentsContextValue}>
			<input
				accept={accept}
				className="hidden"
				multiple={multiple}
				onChange={(event) => {
					if (event.currentTarget.files) {
						add(event.currentTarget.files);
					}
					event.currentTarget.value = "";
				}}
				ref={inputRef}
				type="file"
			/>
			<form
				className={cn(
					"rounded-[1.5rem] border bg-background/80 p-3 shadow-[0_20px_48px_rgba(23,58,64,0.08)] backdrop-blur",
					className,
				)}
				onSubmit={async (event) => {
					event.preventDefault();

					const form = event.currentTarget;
					const formData = new FormData(form);
					const text = String(formData.get("message") ?? "");

					try {
						const normalizedFiles = await Promise.all(
							files.map(async ({ id: _id, ...file }) => {
								if (file.url.startsWith("blob:")) {
									const dataUrl = await convertBlobUrlToDataUrl(file.url);

									return {
										...file,
										url: dataUrl ?? file.url,
									};
								}

								return file;
							}),
						);

						await onSubmit({ files: normalizedFiles, text }, event);
						form.reset();
						clear();
					} catch {
						// Preserve the current input for retry if submit fails.
					}
				}}
				ref={formRef}
				{...props}
			>
				{children}
			</form>
		</promptInputAttachmentsContext.Provider>
	);
}

export const PromptInputHeader = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("mb-3 flex flex-wrap gap-2", className)} {...props} />
);

export const PromptInputBody = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("min-h-0", className)} {...props} />
);

export const PromptInputFooter = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			className,
		)}
		{...props}
	/>
);

export const PromptInputTools = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-wrap items-center gap-2", className)}
		{...props}
	/>
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = ({
	className,
	onKeyDown,
	onPaste,
	placeholder = "Ask anything about building and shipping software...",
	...props
}: PromptInputTextareaProps) => {
	const attachments = usePromptAttachmentsContext();

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
		(event) => {
			onKeyDown?.(event);

			if (event.defaultPrevented) {
				return;
			}

			if (
				event.key === "Backspace" &&
				event.currentTarget.value.length === 0 &&
				attachments.files.length > 0
			) {
				const latestAttachment = attachments.files.at(-1);

				if (latestAttachment) {
					event.preventDefault();
					attachments.remove(latestAttachment.id);
				}
			}

			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				!event.nativeEvent.isComposing
			) {
				event.preventDefault();
				event.currentTarget.form?.requestSubmit();
			}
		},
		[attachments, onKeyDown],
	);

	const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = useCallback(
		(event) => {
			onPaste?.(event);

			if (event.defaultPrevented) {
				return;
			}

			const clipboardFiles = [...event.clipboardData.items]
				.filter((item) => item.kind === "file")
				.map((item) => item.getAsFile())
				.filter((file): file is File => Boolean(file));

			if (clipboardFiles.length === 0) {
				return;
			}

			event.preventDefault();
			attachments.add(clipboardFiles);
		},
		[attachments, onPaste],
	);

	return (
		<Textarea
			className={cn(
				"min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
				className,
			)}
			name="message"
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			placeholder={placeholder}
			{...props}
		/>
	);
};

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
	className,
	size = "sm",
	type = "button",
	variant = "ghost",
	...props
}: PromptInputButtonProps) => (
	<Button
		className={cn("rounded-full", className)}
		size={size}
		type={type}
		variant={variant}
		{...props}
	/>
);

export const PromptInputActionMenu = DropdownMenu;

export const PromptInputActionMenuTrigger = ({
	children,
	...props
}: PromptInputButtonProps) => (
	<DropdownMenuTrigger asChild>
		<PromptInputButton size="icon-sm" {...props}>
			{children ?? <PlusIcon className="size-4" />}
		</PromptInputButton>
	</DropdownMenuTrigger>
);

export const PromptInputActionMenuContent = ({
	className,
	...props
}: ComponentProps<typeof DropdownMenuContent>) => (
	<DropdownMenuContent align="start" className={cn(className)} {...props} />
);

export type PromptInputActionAddAttachmentsProps = ComponentProps<
	typeof DropdownMenuItem
> & {
	label?: string;
};

export const PromptInputActionAddAttachments = ({
	label = "Add photo or file",
	...props
}: PromptInputActionAddAttachmentsProps) => {
	const attachments = usePromptAttachmentsContext();

	return (
		<DropdownMenuItem
			onSelect={(event) => {
				event.preventDefault();
				attachments.openFileDialog();
			}}
			{...props}
		>
			<ImageIcon className="mr-2 size-4" />
			{label}
		</DropdownMenuItem>
	);
};

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
	status?: ChatStatus;
	onStop?: () => void;
};

export const PromptInputSubmit = ({
	children,
	className,
	onClick,
	onStop,
	size = "icon-sm",
	status,
	variant = "default",
	...props
}: PromptInputSubmitProps) => (
	<Button
		aria-label={status === "streaming" ? "Stop generation" : "Send message"}
		className={cn("rounded-full", className)}
		onClick={(event) => {
			if (status === "streaming" && onStop) {
				event.preventDefault();
				onStop();
				return;
			}

			onClick?.(event);
		}}
		size={size}
		type={status === "streaming" && onStop ? "button" : "submit"}
		variant={variant}
		{...props}
	>
		{children ??
			(status === "submitted" ? (
				<Loader2Icon className="size-4 animate-spin" />
			) : status === "streaming" ? (
				<SquareIcon className="size-4" />
			) : (
				<CornerDownLeftIcon className="size-4" />
			))}
	</Button>
);

export const PromptInputSelect = Select;

export const PromptInputSelectTrigger = ({
	className,
	...props
}: ComponentProps<typeof SelectTrigger>) => (
	<SelectTrigger
		className={cn(
			"h-9 min-w-[8.5rem] rounded-full border-none bg-muted/60 pl-4 shadow-none",
			className,
		)}
		{...props}
	/>
);

export const PromptInputSelectContent = SelectContent;
export const PromptInputSelectItem = SelectItem;
export const PromptInputSelectValue = SelectValue;
