import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getAudioProviderFactory } from "#/lib/ai";

const queryAudioSchema = z.object({
	taskId: z.string().min(1),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/audio/query")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = queryAudioSchema.parse(await request.json());
					const provider = getAudioProviderFactory().getProvider(body.provider);
					const result = await provider.queryTask(body.taskId);

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to query audio task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
