import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { websiteConfig } from "#/config/website-config";
import { sendEmail } from "#/lib/email";
import { ContactMessage } from "#/lib/email/templates/contact-message";

const contactSchema = z.object({
	name: z.string().min(1).max(100),
	email: z.string().email(),
	subject: z.string().min(1).max(200),
	message: z.string().min(1).max(5000),
});

export const Route = createFileRoute("/api/contact")({
	staticData: { skipLayout: true },
});

export const ServerRoute = {
	POST: async ({ request }: { request: Request }) => {
		try {
			const body = await request.json();
			const data = contactSchema.parse(body);

			await sendEmail({
				to: websiteConfig.mail.supportEmail,
				subject: `Contact: ${data.subject}`,
				react: ContactMessage({
					name: data.name,
					email: data.email,
					subject: data.subject,
					message: data.message,
				}),
			});

			return Response.json({ success: true });
		} catch {
			return Response.json(
				{ error: "Failed to send message" },
				{ status: 400 },
			);
		}
	},
};
