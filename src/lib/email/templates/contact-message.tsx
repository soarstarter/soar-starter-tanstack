import { Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface ContactMessageProps {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export function ContactMessage({
	name,
	email,
	subject,
	message,
}: ContactMessageProps) {
	return (
		<EmailLayout>
			<Text>
				<strong>Name:</strong> {name}
			</Text>
			<Text>
				<strong>Email:</strong> {email}
			</Text>
			<Text>
				<strong>Subject:</strong> {subject}
			</Text>
			<Text>
				<strong>Message:</strong> {message}
			</Text>
		</EmailLayout>
	);
}
