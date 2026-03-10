import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Routes } from "#/config/route-config";
import { LocaleLink } from "#/i18n/routing";
import { authClient } from "#/lib/auth-client";

const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
	const { token } = useSearch({ strict: false }) as { token?: string };
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	if (!token) {
		return (
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="text-2xl font-bold">Invalid link</h1>
				<p className="text-sm text-muted-foreground">
					This password reset link is invalid or has expired.
				</p>
				<Button variant="outline" asChild>
					<LocaleLink href={Routes.AuthForgotPassword}>
						Request a new link
					</LocaleLink>
				</Button>
			</div>
		);
	}

	if (success) {
		return (
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="text-2xl font-bold">Password reset</h1>
				<p className="text-sm text-muted-foreground">
					Your password has been reset successfully. You can now sign in.
				</p>
				<Button asChild>
					<LocaleLink href={Routes.AuthLogin}>Sign in</LocaleLink>
				</Button>
			</div>
		);
	}

	const onSubmit = async (values: ResetPasswordFormValues) => {
		setError(null);
		setLoading(true);
		const { error: authError } = await authClient.resetPassword({
			newPassword: values.password,
			token,
		});
		setLoading(false);

		if (authError) {
			setError(authError.message ?? "Something went wrong. Please try again.");
			return;
		}
		setSuccess(true);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Reset password</h1>
				<p className="text-sm text-muted-foreground">
					Enter your new password below
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New password</FormLabel>
								<FormControl>
									<Input
										type="password"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input
										type="password"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Resetting..." : "Reset password"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
