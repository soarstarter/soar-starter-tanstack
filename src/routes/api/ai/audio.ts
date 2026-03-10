import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getAudioProviderFactory } from "#/lib/ai";

const createAudioSchema = z.object({
	prompt: z.string().min(1),
	model: z.string().optional(),
	options: z.record(z.string(), z.unknown()).optional(),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/audio")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = createAudioSchema.parse(await request.json());
					const provider = getAudioProviderFactory().getProvider(body.provider);
					const result = await provider.createTask({
						model: body.model,
						options: body.options,
						prompt: body.prompt.trim(),
					});

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to create audio task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
