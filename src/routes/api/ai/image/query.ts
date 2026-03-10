import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getImageProviderFactory } from "#/lib/ai";

const queryImageSchema = z.object({
	taskId: z.string().min(1),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/image/query")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = queryImageSchema.parse(await request.json());
					const provider = getImageProviderFactory().getProvider(body.provider);
					const result = await provider.queryTask(body.taskId);

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to query image task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
