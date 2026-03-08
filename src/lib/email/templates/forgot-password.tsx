import { Text } from "@react-email/components";
import { EmailButton } from "./email-button";
import { EmailLayout } from "./email-layout";

interface ForgotPasswordProps {
	url: string;
	name: string;
}

export function ForgotPassword({ url, name }: ForgotPasswordProps) {
	return (
		<EmailLayout>
			<Text>Hi {name},</Text>
			<Text>
				We received a request to reset your password. Click the button below to
				choose a new password.
			</Text>
			<EmailButton href={url}>Reset Password</EmailButton>
		</EmailLayout>
	);
}
