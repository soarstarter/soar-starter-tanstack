import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#/components/ui/form";
import { Routes } from "#/config/route-config";

const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: ForgotPasswordFormValues) => {
		setError(null);
		setLoading(true);
		const { error: authError } = await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: Routes.AuthResetPassword,
		});
		setLoading(false);

		if (authError) {
			setError(authError.message ?? "Something went wrong. Please try again.");
			return;
		}
		setSuccess(true);
	};

	if (success) {
		return (
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="text-2xl font-bold">Check your email</h1>
				<p className="text-sm text-muted-foreground">
					If an account exists with that email, we&apos;ve sent a password reset
					link.
				</p>
				<Button variant="outline" asChild>
					<Link to={Routes.AuthLogin}>Back to login</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Forgot password</h1>
				<p className="text-sm text-muted-foreground">
					Enter your email and we&apos;ll send you a reset link
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="m@example.com"
										autoComplete="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Sending..." : "Send reset link"}
					</Button>
				</form>
			</Form>

			<p className="text-center text-sm text-muted-foreground">
				Remember your password?{" "}
				<Link
					to={Routes.AuthLogin}
					className="underline underline-offset-4 hover:text-primary"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
