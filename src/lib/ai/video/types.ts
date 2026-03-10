import type { AsyncTaskStatus } from "#/lib/ai/replicate-utils";

export type VideoScene = "text-to-video" | "image-to-video" | "video-to-video";
export type VideoProviderType = "replicate";

export interface CreateVideoTaskRequest {
	scene: VideoScene;
	model: string;
	prompt: string;
	imageInput?: string[];
	videoInput?: string[];
	options?: Record<string, unknown>;
}

export interface CreateVideoTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
}

export interface QueryVideoTaskResponse {
	taskId: string;
	status: AsyncTaskStatus;
	taskInfo?: Record<string, unknown>;
	videoUrls?: string[];
	errorMessage?: string;
}

export interface VideoProvider {
	createTask(request: CreateVideoTaskRequest): Promise<CreateVideoTaskResponse>;
	queryTask(taskId: string): Promise<QueryVideoTaskResponse>;
}
