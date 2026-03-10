import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/account/subscription/",
)({
	component: SubscriptionPage,
});

const mockSubscription = {
	plan: "Pro Plan",
	status: "Active" as const,
	type: "Monthly",
	provider: "Stripe",
	startDate: "2024-06-01",
	endDate: "2024-07-01",
};

function SubscriptionPage() {
	const subscription = mockSubscription;

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{subscription ? (
				<Card>
					<CardHeader>
						<CardTitle>Subscription</CardTitle>
						<CardDescription>Manage your subscription details.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
								<div>
									<p className="text-muted-foreground text-sm">Plan</p>
									<p className="font-medium">{subscription.plan}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Status</p>
									<Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
										{subscription.status}
									</Badge>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Type</p>
									<p className="font-medium">{subscription.type}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Provider</p>
									<p className="font-medium">{subscription.provider}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Start Date</p>
									<p className="font-medium">
										{new Date(subscription.startDate).toLocaleDateString()}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">End Date</p>
									<p className="font-medium">
										{new Date(subscription.endDate).toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="pt-4">
								<Button asChild>
									<Link to="/" hash="pricing">
										Change Plan
									</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Subscription</CardTitle>
						<CardDescription>Manage your subscription details.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<CreditCard className="text-muted-foreground mb-4 size-12" />
							<h3 className="text-lg font-medium">No Active Subscription</h3>
							<p className="text-muted-foreground mt-1 text-sm">
								You don&apos;t have an active subscription yet.
							</p>
							<Button className="mt-4" asChild>
								<Link to="/" hash="pricing">
									View Plans
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
