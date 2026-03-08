import { Check, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import type { PlanInterval, PricePlan } from "#/types";

interface PricingCardProps {
	plan: PricePlan;
	interval: PlanInterval;
}

export function PricingCard({ plan, interval }: PricingCardProps) {
	const [loading, setLoading] = useState(false);

	const price = plan.isFree
		? null
		: plan.isLifetime
			? plan.prices[0]
			: plan.prices.find((p) => p.interval === interval);

	const displayAmount = price ? price.amount : 0;

	async function handleSubscribe() {
		if (plan.isFree) return;
		setLoading(true);
		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId: price?.productId }),
			});
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card
			className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}
		>
			{plan.popular && (
				<Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
					Most Popular
				</Badge>
			)}
			<CardHeader>
				<CardTitle className="text-xl">{plan.name}</CardTitle>
				<CardDescription>{plan.description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="mb-6">
					<span className="text-4xl font-bold">
						{plan.isFree ? "Free" : `$${displayAmount}`}
					</span>
					{!plan.isFree && !plan.isLifetime && (
						<span className="text-muted-foreground">
							/{interval === "month" ? "mo" : "yr"}
						</span>
					)}
					{plan.isLifetime && (
						<span className="text-muted-foreground"> one-time</span>
					)}
				</div>
				<ul className="space-y-3">
					{plan.features.map((feature) => (
						<li key={feature.text} className="flex items-center gap-2 text-sm">
							{feature.included ? (
								<Check className="size-4 text-primary" />
							) : (
								<X className="size-4 text-muted-foreground" />
							)}
							<span className={feature.included ? "" : "text-muted-foreground"}>
								{feature.text}
							</span>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					variant={plan.popular ? "default" : "outline"}
					disabled={plan.isFree || loading}
					onClick={handleSubscribe}
				>
					{loading
						? "Processing..."
						: plan.isFree
							? "Current Plan"
							: "Get Started"}
				</Button>
			</CardFooter>
		</Card>
	);
}
