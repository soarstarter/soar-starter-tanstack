import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
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
import { useSession } from "#/lib/auth-client";

const profileSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be between 3 and 30 characters.")
		.max(30, "Name must be between 3 and 30 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Route = createFileRoute("/{-$locale}/_dashboard/setting/profile/")(
	{
		component: ProfilePage,
	},
);

function ProfilePage() {
	const { data: session } = useSession();
	const [isSaving, setIsSaving] = React.useState(false);
	const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: session?.user?.name ?? "",
		},
	});

	React.useEffect(() => {
		if (session?.user?.name) {
			form.reset({ name: session.user.name });
		}
	}, [form, session?.user?.name]);

	const onSubmit = async (values: ProfileFormValues) => {
		setIsSaving(true);
		setSaveMessage(null);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/user/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				setErrorMessage("Failed to save your profile. Please try again.");
				return;
			}

			setSaveMessage("Profile updated successfully.");
			form.reset(values);
		} catch {
			setErrorMessage("Failed to save your profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<CardTitle>Name</CardTitle>
					<CardDescription>
						Your display name. Must be between 3 and 30 characters.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="max-w-md">
										<FormLabel>Display Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your name"
												maxLength={30}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{errorMessage && (
								<p className="text-sm text-destructive">{errorMessage}</p>
							)}
							{saveMessage && (
								<p className="text-sm text-green-600 dark:text-green-400">
									{saveMessage}
								</p>
							)}
							<div>
								<Button
									type="submit"
									disabled={isSaving || !form.formState.isDirty}
								>
									{isSaving ? "Saving..." : "Save"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Avatar</CardTitle>
					<CardDescription>
						Your profile picture. Click to upload a new one.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<Avatar className="size-16">
							<AvatarImage
								src={session?.user?.image ?? ""}
								alt={session?.user?.name ?? "User"}
							/>
							<AvatarFallback>
								{(session?.user?.name ?? "U")
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<Button variant="outline">Upload</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
