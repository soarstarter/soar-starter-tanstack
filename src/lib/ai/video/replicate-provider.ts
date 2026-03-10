import Replicate from "replicate";
import {
	extractReplicateUrls,
	mapReplicatePredictionStatus,
} from "#/lib/ai/replicate-utils";
import type {
	CreateVideoTaskRequest,
	CreateVideoTaskResponse,
	QueryVideoTaskResponse,
	VideoProvider,
} from "./types";

export class ReplicateVideoProvider implements VideoProvider {
	private readonly client: Replicate;

	constructor(apiToken: string) {
		this.client = new Replicate({ auth: apiToken });
	}

	async createTask(
		request: CreateVideoTaskRequest,
	): Promise<CreateVideoTaskResponse> {
		const input: Record<string, unknown> = {
			prompt: request.prompt,
			...(request.options ?? {}),
		};

		if (request.imageInput?.length) {
			if (request.model === "google/veo-3.1") {
				input.reference_images = request.imageInput;
			} else if (request.model === "openai/sora-2") {
				input.input_reference = request.imageInput[0];
			} else {
				input.image_input = request.imageInput;
			}
		}

		if (request.videoInput?.length) {
			if (request.model === "openai/sora-2") {
				input.input_reference = request.videoInput[0];
			} else {
				input.video_input = request.videoInput;
			}
		}

		const prediction = await this.client.predictions.create({
			model: request.model as `${string}/${string}`,
			input,
		});

		return {
			taskId: prediction.id,
			status: mapReplicatePredictionStatus(prediction.status),
			taskInfo: prediction as unknown as Record<string, unknown>,
		};
	}

	async queryTask(taskId: string): Promise<QueryVideoTaskResponse> {
		const prediction = await this.client.predictions.get(taskId);
		const videoUrls = extractReplicateUrls(prediction.output, [
			"url",
			"uri",
			"video",
			"src",
			"videoUrl",
		]);

		return {
			taskId,
			status: mapReplicatePredictionStatus(prediction.status),
			taskInfo: {
				status: prediction.status,
				output: prediction.output,
				error: prediction.error,
				createdAt: prediction.created_at,
			},
			videoUrls: videoUrls.length > 0 ? videoUrls : undefined,
			errorMessage:
				prediction.error != null ? String(prediction.error) : undefined,
		};
	}
}
