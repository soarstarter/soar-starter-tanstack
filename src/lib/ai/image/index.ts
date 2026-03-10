import { ReplicateImageProvider } from "./replicate-provider";
import type { ImageProvider, ImageProviderType } from "./types";

export class ImageProviderFactory {
	private readonly providers = new Map<ImageProviderType, ImageProvider>();
	private readonly defaultProvider: ImageProviderType = "replicate";

	constructor() {
		const token = process.env.REPLICATE_API_TOKEN;

		if (token) {
			this.providers.set("replicate", new ReplicateImageProvider(token));
		}
	}

	getProvider(providerType?: ImageProviderType) {
		const type = providerType ?? this.defaultProvider;
		const provider = this.providers.get(type);

		if (!provider) {
			throw new Error(
				`Image provider "${type}" is not configured (missing REPLICATE_API_TOKEN)`,
			);
		}

		return provider;
	}
}

let factoryInstance: ImageProviderFactory | null = null;

export function getImageProviderFactory() {
	if (!factoryInstance) {
		factoryInstance = new ImageProviderFactory();
	}

	return factoryInstance;
}

export type {
	CreateImageTaskRequest,
	CreateImageTaskResponse,
	ImageProvider,
	ImageProviderType,
	QueryImageTaskResponse,
} from "./types";
