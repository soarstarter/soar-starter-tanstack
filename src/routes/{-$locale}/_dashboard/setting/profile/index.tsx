import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
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
import { useSession } from "#/lib/auth-client";

export const Route = createFileRoute("/{-$locale}/_dashboard/setting/profile/")(
	{
		component: ProfilePage,
	},
);

function ProfilePage() {
	const { data: session } = useSession();
	const [name, setName] = React.useState(session?.user?.name ?? "");

	React.useEffect(() => {
		if (session?.user?.name) {
			setName(session.user.name);
		}
	}, [session?.user?.name]);

	const isValid = name.length >= 3 && name.length <= 30;

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
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Display Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your name"
								className="max-w-md"
								minLength={3}
								maxLength={30}
							/>
							{name.length > 0 && !isValid && (
								<p className="text-destructive text-sm">
									Name must be between 3 and 30 characters.
								</p>
							)}
						</div>
						<div>
							<Button disabled={!isValid}>Save</Button>
						</div>
					</div>
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
