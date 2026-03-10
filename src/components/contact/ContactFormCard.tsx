import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Please enter a valid email address"),
	subject: z.string().min(1, "Subject is required").max(200),
	message: z.string().min(1, "Message is required").max(5000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactFormCard() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	async function handleSubmit(values: ContactFormValues) {
		setLoading(true);
		setSuccess(false);
		setError(null);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (res.ok) {
				setSuccess(true);
				form.reset();
				return;
			}

			setError("Failed to send message. Please try again.");
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
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Your name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="subject"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subject</FormLabel>
										<FormControl>
											<Input placeholder="How can we help?" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="Tell us more..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{error && <p className="text-sm text-destructive">{error}</p>}
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "Sending..." : "Send Message"}
							</Button>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);
}
