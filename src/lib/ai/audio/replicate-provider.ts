import Replicate from "replicate";
import {
	extractReplicateUrls,
	mapReplicatePredictionStatus,
} from "#/lib/ai/replicate-utils";
import type {
	AudioProvider,
	CreateAudioTaskRequest,
	CreateAudioTaskResponse,
	QueryAudioTaskResponse,
} from "./types";

export class ReplicateAudioProvider implements AudioProvider {
	private readonly client: Replicate;

	constructor(apiToken: string) {
		this.client = new Replicate({ auth: apiToken });
	}

	async createTask(
		request: CreateAudioTaskRequest,
	): Promise<CreateAudioTaskResponse> {
		if (!request.prompt.trim()) {
			throw new Error("Prompt is required");
		}

		const modelId = (request.model ||
			"qwen/qwen3-tts") as `${string}/${string}`;
		const prediction = await this.client.predictions.create({
			model: modelId,
			input: this.buildInput(request.prompt, request.options),
		});

		return {
			taskId: prediction.id,
			status: mapReplicatePredictionStatus(prediction.status),
			taskInfo: prediction as unknown as Record<string, unknown>,
		};
	}

	async queryTask(taskId: string): Promise<QueryAudioTaskResponse> {
		const prediction = await this.client.predictions.get(taskId);
		const audioUrls = extractReplicateUrls(prediction.output, [
			"url",
			"audio",
			"src",
			"audioUrl",
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
			audioUrls: audioUrls.length > 0 ? audioUrls : undefined,
			errorMessage:
				prediction.error != null ? String(prediction.error) : undefined,
		};
	}

	private buildInput(
		prompt: string,
		options?: Record<string, unknown>,
	): Record<string, unknown> {
		const modeValue =
			typeof options?.mode === "string" ? options.mode : "voice";
		const mode =
			modeValue === "clone" || modeValue === "voice_clone"
				? "voice_clone"
				: modeValue === "voice_design"
					? "voice_design"
					: "custom_voice";

		const languageValue =
			typeof options?.language === "string" ? options.language : "en";
		const languageMap: Record<string, string> = {
			auto: "auto",
			zh: "Chinese",
			en: "English",
			ja: "Japanese",
			ko: "Korean",
			de: "German",
			fr: "French",
			es: "Spanish",
			pt: "Portuguese",
			ru: "Russian",
			it: "Italian",
		};

		const input: Record<string, unknown> = {
			text: prompt,
			mode,
			language: languageMap[languageValue] || languageValue || "English",
		};

		if (
			typeof options?.reference_audio === "string" &&
			options.reference_audio.length > 0
		) {
			input.reference_audio = options.reference_audio;
		}

		return input;
	}
}
