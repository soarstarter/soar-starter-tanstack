export const aiChatModels = [
	{
		id: "gpt-4o-mini",
		label: "GPT-4o mini",
		searchPreviewId: "gpt-4o-mini-search-preview",
	},
	{
		id: "gpt-4o",
		label: "GPT-4o",
		searchPreviewId: "gpt-4o-search-preview",
	},
] as const;

export type AiChatModelId = (typeof aiChatModels)[number]["id"];

export const defaultAiChatModelId: AiChatModelId = aiChatModels[0].id;

const chatModelLookup = new Map(
	aiChatModels.map((model) => [model.id, model] as const),
);

export function resolveAiChatModelId(model?: string): AiChatModelId {
	return chatModelLookup.has(model as AiChatModelId)
		? (model as AiChatModelId)
		: defaultAiChatModelId;
}

export function resolveAiChatRuntimeModelId(options?: {
	model?: string;
	webSearch?: boolean;
}) {
	const resolvedId = resolveAiChatModelId(options?.model);
	const resolvedModel = chatModelLookup.get(resolvedId);

	if (!resolvedModel) {
		return defaultAiChatModelId;
	}

	return options?.webSearch ? resolvedModel.searchPreviewId : resolvedModel.id;
}

export const aiChatSystemPrompt =
	"You are the AI assistant for Soar Starter. Give concise, practical answers and clearly say when a request needs additional context.";
