import {
	Body,
	Container,
	Font,
	Head,
	Hr,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
	children: ReactNode;
}

const currentYear = new Date().getFullYear();

export function EmailLayout({ children }: EmailLayoutProps) {
	return (
		<Html lang="en">
			<Head>
				<Font
					fontFamily="Inter"
					fallbackFontFamily="Arial"
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Tailwind>
				<Body className="bg-gray-100 p-4">
					<Container className="rounded-lg bg-white p-6 text-gray-900">
						{children}

						<Hr className="my-8" />
						<Text className="mt-4 text-gray-500">
							Best regards, The SoarStarter Team
						</Text>
						<Text className="text-sm text-gray-400">
							&copy; {currentYear} SoarStarter. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
