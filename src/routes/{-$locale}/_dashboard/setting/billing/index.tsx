import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/{-$locale}/_dashboard/setting/billing/")(
	{
		component: BillingPage,
	},
);

function BillingPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<CardTitle>Billing</CardTitle>
					<CardDescription>
						Manage your billing information and payment methods.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<CreditCard className="text-muted-foreground mb-4 size-12" />
						<h3 className="text-lg font-medium">
							Billing settings coming soon
						</h3>
						<p className="text-muted-foreground mt-1 text-sm">
							Payment methods, invoices, and billing history will be available
							here.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
