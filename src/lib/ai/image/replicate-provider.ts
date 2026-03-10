import Replicate from "replicate";
import {
	extractReplicateUrls,
	mapReplicatePredictionStatus,
} from "#/lib/ai/replicate-utils";
import type {
	CreateImageTaskRequest,
	CreateImageTaskResponse,
	ImageProvider,
	QueryImageTaskResponse,
} from "./types";

function sizeToAspectRatio(size: string): string {
	const sizeMap: Record<string, string> = {
		"1024x1024": "1:1",
		"1792x1024": "16:9",
		"1024x1792": "9:16",
	};

	return sizeMap[size] ?? "1:1";
}

export class ReplicateImageProvider implements ImageProvider {
	private readonly client: Replicate;

	constructor(apiToken: string) {
		this.client = new Replicate({ auth: apiToken });
	}

	async createTask(
		request: CreateImageTaskRequest,
	): Promise<CreateImageTaskResponse> {
		const { prompt, model, size, imageData } = request;
		const modelId = (model ||
			"black-forest-labs/flux-2-pro") as `${string}/${string}`;
		const input: Record<string, unknown> = {
			prompt: prompt ?? "",
			aspect_ratio: sizeToAspectRatio(size || "1024x1024"),
		};

		if (typeof imageData === "string" && imageData.length > 0) {
			input.input_images = [imageData];
		}

		const prediction = await this.client.predictions.create({
			model: modelId,
			input,
		});

		return {
			taskId: prediction.id,
			status: mapReplicatePredictionStatus(prediction.status),
			taskInfo: prediction as unknown as Record<string, unknown>,
		};
	}

	async queryTask(taskId: string): Promise<QueryImageTaskResponse> {
		const prediction = await this.client.predictions.get(taskId);
		const imageUrls = extractReplicateUrls(prediction.output, [
			"url",
			"uri",
			"src",
			"imageUrl",
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
			imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
			errorMessage:
				prediction.error != null ? String(prediction.error) : undefined,
		};
	}
}
