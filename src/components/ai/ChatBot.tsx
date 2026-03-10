import { useChat } from "@ai-sdk/react";
import type { FileUIPart, SourceUrlUIPart, UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import {
	CopyIcon,
	GlobeIcon,
	MessageSquareTextIcon,
	RefreshCcwIcon,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
	Attachment,
	AttachmentInfo,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
} from "#/components/ai-elements/attachments";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "#/components/ai-elements/conversation";
import {
	Message,
	MessageAction,
	MessageActions,
	MessageContent,
	MessageResponse,
} from "#/components/ai-elements/message";
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputButton,
	PromptInputFooter,
	PromptInputHeader,
	type PromptInputMessage,
	PromptInputSelect,
	PromptInputSelectContent,
	PromptInputSelectItem,
	PromptInputSelectTrigger,
	PromptInputSelectValue,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
	usePromptInputAttachments,
} from "#/components/ai-elements/prompt-input";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "#/components/ai-elements/reasoning";
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "#/components/ai-elements/sources";
import { Card, CardContent } from "#/components/ui/card";
import { aiChatModels } from "#/lib/ai/chat-config";

function getSourceUrlParts(message: UIMessage) {
	return message.parts.filter(
		(part): part is SourceUrlUIPart => part.type === "source-url",
	);
}

function getFileParts(message: UIMessage) {
	return message.parts.filter(
		(part): part is FileUIPart => part.type === "file",
	);
}

function getTextContent(message: UIMessage) {
	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("\n");
}

function hashKeyFragment(value: string) {
	let hash = 0;

	for (const character of value) {
		hash = Math.imul(31, hash) + character.charCodeAt(0);
		hash |= 0;
	}

	return (hash >>> 0).toString(36);
}

function getFileKey(messageId: string, file: FileUIPart, occurrence: number) {
	const signature = hashKeyFragment(
		[file.url, file.filename ?? "", file.mediaType].join("|"),
	);

	return `${messageId}-file-${signature}-${occurrence}`;
}

function getRenderablePartKey(
	messageId: string,
	part: UIMessage["parts"][number],
	occurrence: number,
) {
	return `${messageId}-${getRenderablePartSignature(part)}-${occurrence}`;
}

function getRenderablePartSignature(part: UIMessage["parts"][number]) {
	if (part.type === "text") {
		return `text-${hashKeyFragment(`${part.text}|${part.state ?? "done"}`)}`;
	}

	return `reasoning-${hashKeyFragment(`${part.text}|${part.state ?? "done"}`)}`;
}

function AttachmentsDisplay() {
	const attachments = usePromptInputAttachments();

	if (attachments.files.length === 0) {
		return null;
	}

	return (
		<Attachments variant="inline">
			{attachments.files.map((attachment) => (
				<Attachment
					data={attachment}
					key={attachment.id}
					onRemove={() => attachments.remove(attachment.id)}
				>
					<AttachmentPreview />
					<AttachmentInfo />
					<AttachmentRemove />
				</Attachment>
			))}
		</Attachments>
	);
}

export function ChatBot() {
	const [model, setModel] = useState(aiChatModels[0].id);
	const [webSearch, setWebSearch] = useState(false);

	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				body: { model, webSearch },
			}),
		[model, webSearch],
	);

	const { error, messages, regenerate, sendMessage, status, stop } = useChat({
		transport,
	});

	const lastAssistantId = (() => {
		for (let index = messages.length - 1; index >= 0; index -= 1) {
			if (messages[index]?.role === "assistant") {
				return messages[index]?.id ?? null;
			}
		}

		return null;
	})();

	const lastMessageId = messages.at(-1)?.id ?? null;

	async function handleSubmit(message: PromptInputMessage) {
		const hasText = Boolean(message.text.trim());
		const hasFiles = message.files.length > 0;

		if (!hasText && !hasFiles) {
			return;
		}

		await sendMessage({
			text: hasText ? message.text : "Sent with attachments",
			files: hasFiles ? message.files : undefined,
		});
	}

	function shouldShowActions(message: UIMessage, partIndex: number) {
		if (message.role !== "assistant") {
			return false;
		}

		if (message.id !== lastAssistantId) {
			return false;
		}

		for (let index = partIndex + 1; index < message.parts.length; index += 1) {
			if (message.parts[index]?.type === "text") {
				return false;
			}
		}

		return true;
	}

	async function copyToClipboard(text: string) {
		if (!text || typeof navigator === "undefined" || !navigator.clipboard) {
			return;
		}

		await navigator.clipboard.writeText(text);
	}

	return (
		<Card className="overflow-hidden border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.68))] shadow-[0_24px_60px_rgba(23,58,64,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,27,31,0.92),rgba(15,27,31,0.78))]">
			<CardContent className="grid gap-0 p-0 lg:grid-cols-[1fr_20rem]">
				<div className="flex min-h-[38rem] flex-col border-b border-white/50 p-4 dark:border-white/10 lg:border-r lg:border-b-0">
					<Conversation className="rounded-[1.5rem] border bg-background/60">
						<ConversationContent>
							{messages.length === 0 ? (
								<ConversationEmptyState
									description="Switch models, add images, or enable live web search before you send the first prompt."
									icon={<MessageSquareTextIcon className="size-10" />}
									title="Ask the assistant anything"
								/>
							) : null}

							{messages.map((message) => {
								const sourceParts = getSourceUrlParts(message);
								const fileParts = getFileParts(message);
								const fileKeyCounts = new Map<string, number>();
								const renderablePartKeyCounts = new Map<string, number>();

								return (
									<div key={message.id}>
										{message.role === "assistant" && sourceParts.length > 0 ? (
											<Sources>
												<SourcesTrigger count={sourceParts.length} />
												<SourcesContent>
													{sourceParts.map((source) => (
														<Source
															href={source.url}
															key={`${message.id}-source-${source.sourceId}`}
															title={source.title ?? source.url}
														/>
													))}
												</SourcesContent>
											</Sources>
										) : null}

										{fileParts.length > 0 ? (
											<Message from={message.role}>
												<MessageContent data-from={message.role}>
													<Attachments variant="inline">
														{fileParts.map((file) => {
															const fileSignature = [
																file.url,
																file.filename ?? "",
																file.mediaType,
															].join("|");
															const occurrence =
																fileKeyCounts.get(fileSignature) ?? 0;
															fileKeyCounts.set(fileSignature, occurrence + 1);
															const fileKey = getFileKey(
																message.id,
																file,
																occurrence,
															);

															return (
																<Attachment
																	data={{ ...file, id: fileKey }}
																	key={fileKey}
																>
																	<AttachmentPreview />
																	<AttachmentInfo />
																</Attachment>
															);
														})}
													</Attachments>
												</MessageContent>
											</Message>
										) : null}

										{message.parts.map((part, partIndex) => {
											if (part.type === "text") {
												const partSignature = getRenderablePartSignature(part);
												const occurrence =
													renderablePartKeyCounts.get(partSignature) ?? 0;
												renderablePartKeyCounts.set(
													partSignature,
													occurrence + 1,
												);
												const partKey = getRenderablePartKey(
													message.id,
													part,
													occurrence,
												);

												return (
													<Fragment key={partKey}>
														<Message from={message.role}>
															<MessageContent data-from={message.role}>
																<MessageResponse>{part.text}</MessageResponse>
															</MessageContent>
														</Message>
														{shouldShowActions(message, partIndex) ? (
															<MessageActions>
																<MessageAction
																	label="Regenerate answer"
																	onClick={() =>
																		regenerate({
																			body: { model, webSearch },
																		})
																	}
																	tooltip="Regenerate"
																>
																	<RefreshCcwIcon className="size-3.5" />
																</MessageAction>
																<MessageAction
																	label="Copy answer"
																	onClick={() =>
																		copyToClipboard(getTextContent(message))
																	}
																	tooltip="Copy"
																>
																	<CopyIcon className="size-3.5" />
																</MessageAction>
															</MessageActions>
														) : null}
													</Fragment>
												);
											}

											if (part.type === "reasoning") {
												const partSignature = getRenderablePartSignature(part);
												const occurrence =
													renderablePartKeyCounts.get(partSignature) ?? 0;
												renderablePartKeyCounts.set(
													partSignature,
													occurrence + 1,
												);
												const partKey = getRenderablePartKey(
													message.id,
													part,
													occurrence,
												);

												return (
													<Reasoning
														className="w-full"
														isStreaming={
															status === "streaming" &&
															message.id === lastMessageId &&
															partIndex === message.parts.length - 1
														}
														key={partKey}
													>
														<ReasoningTrigger />
														<ReasoningContent>{part.text}</ReasoningContent>
													</Reasoning>
												);
											}

											return null;
										})}
									</div>
								);
							})}
						</ConversationContent>
						<ConversationScrollButton />
					</Conversation>

					{error ? (
						<p className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
							{error.message}
						</p>
					) : null}

					<PromptInput
						accept="image/*,.pdf,.txt,.md"
						className="mt-4"
						globalDrop
						multiple
						onSubmit={handleSubmit}
					>
						<PromptInputHeader>
							<AttachmentsDisplay />
						</PromptInputHeader>
						<PromptInputBody>
							<PromptInputTextarea />
						</PromptInputBody>
						<PromptInputFooter>
							<PromptInputTools>
								<PromptInputActionMenu>
									<PromptInputActionMenuTrigger />
									<PromptInputActionMenuContent>
										<PromptInputActionAddAttachments />
									</PromptInputActionMenuContent>
								</PromptInputActionMenu>
								<PromptInputButton
									onClick={() => setWebSearch((enabled) => !enabled)}
									variant={webSearch ? "default" : "ghost"}
								>
									<GlobeIcon className="size-4" />
									<span>Web search</span>
								</PromptInputButton>
								<PromptInputSelect value={model} onValueChange={setModel}>
									<PromptInputSelectTrigger>
										<PromptInputSelectValue />
									</PromptInputSelectTrigger>
									<PromptInputSelectContent>
										{aiChatModels.map((item) => (
											<PromptInputSelectItem key={item.id} value={item.id}>
												{item.label}
											</PromptInputSelectItem>
										))}
									</PromptInputSelectContent>
								</PromptInputSelect>
							</PromptInputTools>
							<PromptInputSubmit onStop={stop} status={status} />
						</PromptInputFooter>
					</PromptInput>
				</div>

				<div className="flex flex-col gap-4 p-6">
					<div className="rounded-[1.5rem] border bg-background/60 p-5">
						<p className="island-kicker">Live Context</p>
						<h2 className="mt-3 text-xl font-semibold">
							Chat with files and current web data
						</h2>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							Drop screenshots or documents into the prompt and toggle web
							search when the answer depends on recent information.
						</p>
					</div>
					<div className="rounded-[1.5rem] border bg-background/60 p-5">
						<p className="font-medium text-sm">What this supports</p>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							<li>Streaming replies with markdown formatting.</li>
							<li>Source cards when search-backed answers cite the web.</li>
							<li>Attachment previews before the message is sent.</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
