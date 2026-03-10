import { createFileRoute } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { convertToModelMessages, streamText } from "ai";
import { z } from "zod";
import { aiChatSystemPrompt, getChatModel } from "#/lib/ai";

const chatRequestSchema = z.object({
	messages: z.array(z.any()),
	model: z.string().optional(),
	webSearch: z.boolean().optional(),
});

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === "string") {
		return error;
	}

	return "Failed to stream chat response.";
}

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = chatRequestSchema.parse(await request.json());
					const result = streamText({
						model: getChatModel({
							model: body.model,
							webSearch: body.webSearch,
						}),
						system: aiChatSystemPrompt,
						messages: await convertToModelMessages(
							body.messages as UIMessage[],
						),
					});

					return result.toUIMessageStreamResponse({
						onError: getErrorMessage,
						sendReasoning: true,
						sendSources: Boolean(body.webSearch),
					});
				} catch (error) {
					return Response.json(
						{ message: getErrorMessage(error) },
						{ status: 400 },
					);
				}
			},
		},
	},
});
