import { openai } from "@ai-sdk/openai";
import {
	aiChatModels,
	aiChatSystemPrompt,
	defaultAiChatModelId,
	resolveAiChatModelId,
	resolveAiChatRuntimeModelId,
} from "./chat-config";

export function getChatModel(options?: {
	model?: string;
	webSearch?: boolean;
}) {
	return openai(resolveAiChatRuntimeModelId(options));
}

export {
	aiChatModels,
	aiChatSystemPrompt,
	defaultAiChatModelId,
	resolveAiChatModelId,
	resolveAiChatRuntimeModelId,
};
export type {
	AudioProvider,
	AudioProviderType,
	CreateAudioTaskRequest,
	CreateAudioTaskResponse,
	QueryAudioTaskResponse,
} from "./audio";
export { AudioProviderFactory, getAudioProviderFactory } from "./audio";
export type { AiChatModelId } from "./chat-config";
export type {
	CreateImageTaskRequest,
	CreateImageTaskResponse,
	ImageProvider,
	ImageProviderType,
	QueryImageTaskResponse,
} from "./image";
export { getImageProviderFactory, ImageProviderFactory } from "./image";
export type {
	CreateVideoTaskRequest,
	CreateVideoTaskResponse,
	QueryVideoTaskResponse,
	VideoProvider,
	VideoProviderType,
	VideoScene,
} from "./video";
export { getVideoProviderFactory, VideoProviderFactory } from "./video";
