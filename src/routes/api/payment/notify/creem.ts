import { createFileRoute } from "@tanstack/react-router";
import { handleCreemWebhook } from "#/lib/payment/creem";

export const Route = createFileRoute("/api/payment/notify/creem")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = await request.json();
				await handleCreemWebhook(body);
				return new Response("success");
			},
		},
	},
});
