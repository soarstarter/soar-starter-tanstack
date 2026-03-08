import type { ReactElement } from "react";
import { Resend } from "resend";
import { websiteConfig } from "#/config/website-config";

let resend: Resend | null = null;

function getResend() {
	if (!resend) {
		resend = new Resend(process.env.RESEND_API_KEY);
	}
	return resend;
}

interface SendEmailOptions {
	to: string;
	subject: string;
	react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
	try {
		const { data, error } = await getResend().emails.send({
			from: websiteConfig.mail.fromEmail,
			to,
			subject,
			react,
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, messageId: data?.id };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send email",
		};
	}
}
