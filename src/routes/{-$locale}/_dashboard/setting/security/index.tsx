import { createFileRoute } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/setting/security/",
)({
	component: SecurityPage,
});

function SecurityPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<CardTitle>Security</CardTitle>
					<CardDescription>
						Manage your security settings and preferences.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<LockKeyhole className="text-muted-foreground mb-4 size-12" />
						<h3 className="text-lg font-medium">
							Security settings coming soon
						</h3>
						<p className="text-muted-foreground mt-1 text-sm">
							Password management, two-factor authentication, and session
							management will be available here.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
