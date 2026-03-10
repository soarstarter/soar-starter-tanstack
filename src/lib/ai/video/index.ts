import { ReplicateVideoProvider } from "./replicate-provider";
import type { VideoProvider, VideoProviderType } from "./types";

export class VideoProviderFactory {
	private readonly providers = new Map<VideoProviderType, VideoProvider>();
	private readonly defaultProvider: VideoProviderType = "replicate";

	constructor() {
		const token = process.env.REPLICATE_API_TOKEN;

		if (token) {
			this.providers.set("replicate", new ReplicateVideoProvider(token));
		}
	}

	getProvider(providerType?: VideoProviderType) {
		const type = providerType ?? this.defaultProvider;
		const provider = this.providers.get(type);

		if (!provider) {
			throw new Error(
				`Video provider "${type}" is not configured (missing REPLICATE_API_TOKEN)`,
			);
		}

		return provider;
	}
}

let factoryInstance: VideoProviderFactory | null = null;

export function getVideoProviderFactory() {
	if (!factoryInstance) {
		factoryInstance = new VideoProviderFactory();
	}

	return factoryInstance;
}

export type {
	CreateVideoTaskRequest,
	CreateVideoTaskResponse,
	QueryVideoTaskResponse,
	VideoProvider,
	VideoProviderType,
	VideoScene,
} from "./types";
