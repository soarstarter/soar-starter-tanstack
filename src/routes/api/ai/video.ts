import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getVideoProviderFactory } from "#/lib/ai";

const createVideoSchema = z.object({
	scene: z.enum(["text-to-video", "image-to-video", "video-to-video"]),
	model: z.string().min(1),
	prompt: z.string().min(1),
	imageInput: z.array(z.string()).optional(),
	videoInput: z.array(z.string()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
	provider: z.literal("replicate").optional(),
});

export const Route = createFileRoute("/api/ai/video")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = createVideoSchema.parse(await request.json());
					const provider = getVideoProviderFactory().getProvider(body.provider);
					const result = await provider.createTask({
						imageInput: body.imageInput,
						model: body.model,
						options: body.options,
						prompt: body.prompt.trim(),
						scene: body.scene,
						videoInput: body.videoInput,
					});

					return Response.json(result);
				} catch (error) {
					return Response.json(
						{
							message:
								error instanceof Error
									? error.message
									: "Failed to create video task.",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
