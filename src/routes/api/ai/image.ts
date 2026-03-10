import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getImageProviderFactory } from "#/lib/ai";

const createImageSchema = z.object({
	prompt: z.string().optional(),
	model: z.string().optional(),
	size: z.string().optional(),
	imageData: z.string().optional(),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/image")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = createImageSchema.parse(await request.json());

					if (!body.prompt?.trim() && !body.imageData) {
						return Response.json(
							{ message: "Prompt or source image is required." },
							{ status: 400 },
						);
					}

					const provider = getImageProviderFactory().getProvider(body.provider);
					const result = await provider.createTask({
						imageData: body.imageData,
						model: body.model,
						prompt: body.prompt?.trim(),
						size: body.size,
					});

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to create image task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
