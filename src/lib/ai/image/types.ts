import type { AsyncTaskStatus } from "#/lib/ai/replicate-utils";

export type ImageProviderType = "replicate";

export interface CreateImageTaskRequest {
	prompt?: string;
	model?: string;
	size?: string;
	imageData?: string;
}

export interface CreateImageTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
}

export interface QueryImageTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
	imageUrls?: string[];
	errorMessage?: string;
}

export interface ImageProvider {
	createTask(request: CreateImageTaskRequest): Promise<CreateImageTaskResponse>;
	queryTask(taskId: string): Promise<QueryImageTaskResponse>;
}
