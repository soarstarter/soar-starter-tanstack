import { Text } from "@react-email/components";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface VerifyEmailProps {
	url: string;
	name: string;
}

export function VerifyEmail({ url, name }: VerifyEmailProps) {
	return (
		<EmailLayout>
			<Text>Hi {name},</Text>
			<Text>
				Welcome! Please confirm your email address by clicking the button below.
			</Text>
			<EmailButton href={url}>Confirm Email</EmailButton>
		</EmailLayout>
	);
}
