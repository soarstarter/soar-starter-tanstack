import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PricingCard } from "#/components/home/PricingCard";
import { getPricePlans } from "#/config/price-config";
import type { PlanInterval } from "#/types";

export function PriceSection() {
	const [interval, setInterval] = useState<PlanInterval>("month");
	const { t } = useTranslation();
	const plans = getPricePlans();

	return (
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
						<PricingCard key={plan.id} plan={plan} interval={interval} />
					))}
				</div>
			</div>
		</section>
	);
}
