import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getVideoProviderFactory } from "#/lib/ai";

const queryVideoSchema = z.object({
	taskId: z.string().min(1),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/video/query")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = queryVideoSchema.parse(await request.json());
					const provider = getVideoProviderFactory().getProvider(body.provider);
					const result = await provider.queryTask(body.taskId);

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to query video task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
