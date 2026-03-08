import { Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface SubscribeNewsletterProps {
	name: string;
}

export function SubscribeNewsletter({ name }: SubscribeNewsletterProps) {
	return (
		<EmailLayout>
			<Text>Hi {name},</Text>
			<Text>
				Thank you for subscribing to our newsletter! You&apos;ll receive the
				latest updates, tips, and news directly in your inbox.
			</Text>
		</EmailLayout>
	);
}
