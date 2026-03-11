import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginForm } from "#/components/auth/LoginForm";
import { PricingCard } from "#/components/home/PricingCard";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import { getPricePlans } from "#/config/price-config";
import { useSession } from "#/lib/auth-client";
import type { PlanInterval } from "#/types";
import type { PricePlan } from "#/types";

export function PriceSection() {
	const [interval, setInterval] = useState<PlanInterval>("month");
	const [loginOpen, setLoginOpen] = useState(false);
	const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
	const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
	const { t } = useTranslation();
	const { data: session } = useSession();
	const plans = getPricePlans();

	const callbackUrl =
		typeof window !== "undefined"
			? `${window.location.pathname}${window.location.search}#pricing`
			: undefined;

	useEffect(() => {
		if (!session?.user || !pendingPlanId) return;

		const plan = Object.values(plans).find((item) => item.id === pendingPlanId);
		if (!plan) {
			setPendingPlanId(null);
			return;
		}

		setPendingPlanId(null);
		setLoginOpen(false);
		void handleGetStarted(plan);
	}, [pendingPlanId, plans, session?.user]);

	async function startCheckout(plan: PricePlan) {
		if (!session?.user) return;

		const price = plan.isLifetime
			? plan.prices[0]
			: plan.prices.find((p) => p.interval === interval);

		if (!price?.productId) return;

		setLoadingPlanId(plan.id);

		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: session.user.email,
					productId: price.productId,
				}),
			});
			const data = await res.json();

			if (data?.success && data?.data?.checkoutUrl) {
				window.location.href = data.data.checkoutUrl;
			}
		} finally {
			setLoadingPlanId(null);
		}
	}

	async function handleGetStarted(plan: PricePlan) {
		if (plan.isFree) return;

		if (!session?.user) {
			setPendingPlanId(plan.id);
			setLoginOpen(true);
			return;
		}

		await startCheckout(plan);
	}

	return (
		<>
			<section id="pricing" className="py-12 md:py-20">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-semibold lg:text-4xl">
							{t("pricing.heading")}
						</h2>
						<p className="mx-auto max-w-2xl text-muted-foreground">
							{t("pricing.description")}
						</p>
					</div>

					{/* Interval toggle */}
					<div className="mb-10 flex items-center justify-center gap-3">
						<button
							type="button"
							className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
								interval === "month"
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setInterval("month")}
						>
							Monthly
						</button>
						<button
							type="button"
							className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
								interval === "year"
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setInterval("year")}
						>
							Yearly
						</button>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{Object.values(plans).map((plan) => (
							<PricingCard
								key={plan.id}
								plan={plan}
								interval={interval}
								isLoading={loadingPlanId === plan.id}
								onGetStarted={handleGetStarted}
							/>
						))}
					</div>
				</div>
			</section>
			<Dialog open={loginOpen} onOpenChange={setLoginOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogTitle className="sr-only">
						Sign in to continue checkout
					</DialogTitle>
					<LoginForm
						callbackUrl={callbackUrl}
						onSuccess={() => setLoginOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
