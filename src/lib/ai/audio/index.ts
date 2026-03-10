import { ReplicateAudioProvider } from "./replicate-provider";
import type { AudioProvider, AudioProviderType } from "./types";

export class AudioProviderFactory {
	private readonly providers = new Map<AudioProviderType, AudioProvider>();
	private readonly defaultProvider: AudioProviderType = "replicate";

	constructor() {
		const token = process.env.REPLICATE_API_TOKEN;

		if (token) {
			this.providers.set("replicate", new ReplicateAudioProvider(token));
		}
	}

	getProvider(providerType?: AudioProviderType) {
		const type = providerType ?? this.defaultProvider;
		const provider = this.providers.get(type);

		if (!provider) {
			throw new Error(
				`Audio provider "${type}" is not configured (missing REPLICATE_API_TOKEN)`,
			);
		}

		return provider;
	}
}

let factoryInstance: AudioProviderFactory | null = null;

export function getAudioProviderFactory() {
	if (!factoryInstance) {
		factoryInstance = new AudioProviderFactory();
	}

	return factoryInstance;
}

export type {
	AudioProvider,
	AudioProviderType,
	CreateAudioTaskRequest,
	CreateAudioTaskResponse,
	QueryAudioTaskResponse,
} from "./types";
