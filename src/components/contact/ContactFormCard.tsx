import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";

export function ContactFormCard() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setSuccess(false);

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			subject: formData.get("subject") as string,
			message: formData.get("message") as string,
		};

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (res.ok) {
				setSuccess(true);
				form.reset();
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="mx-auto max-w-lg">
			<CardHeader>
				<CardTitle>{t("contact.title")}</CardTitle>
				<CardDescription>{t("contact.description")}</CardDescription>
			</CardHeader>
			<CardContent>
				{success ? (
					<p className="text-center text-sm text-green-600 dark:text-green-400">
						Message sent successfully! We'll get back to you soon.
					</p>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" required placeholder="Your name" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								placeholder="you@example.com"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								name="subject"
								required
								placeholder="How can we help?"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								name="message"
								required
								rows={5}
								placeholder="Tell us more..."
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Sending..." : "Send Message"}
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
