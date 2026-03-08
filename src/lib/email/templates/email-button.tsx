import { Button } from "@react-email/components";

interface EmailButtonProps {
	href: string;
	children: React.ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
	return (
		<Button href={href} className="rounded-lg bg-black px-4 py-2 text-white">
			{children}
		</Button>
	);
}
