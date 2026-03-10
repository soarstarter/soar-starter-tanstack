import type { AsyncTaskStatus } from "#/lib/ai/replicate-utils";

export type AudioProviderType = "replicate";

export interface CreateAudioTaskRequest {
	prompt: string;
	model?: string;
	options?: Record<string, unknown>;
}

export interface CreateAudioTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
}

export interface QueryAudioTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
	audioUrls?: string[];
	errorMessage?: string;
}

export interface AudioProvider {
	createTask(request: CreateAudioTaskRequest): Promise<CreateAudioTaskResponse>;
	queryTask(taskId: string): Promise<QueryAudioTaskResponse>;
}
