import type { PricePlan } from "#/types";

function getPublicEnv(name: string) {
	if (typeof import.meta !== "undefined" && import.meta.env) {
		return import.meta.env[name];
	}

	if (typeof process !== "undefined") {
		return process.env[name];
	}

	return undefined;
}

export function getPricePlans(): Record<string, PricePlan> {
	return {
		free: {
			id: "free",
			name: "Free",
			description: "For evaluating the starter and building your first project.",
			prices: [],
			isFree: true,
			isLifetime: false,
			features: [
				{ text: "Up to 3 projects", included: true },
				{ text: "1 GB storage", included: true },
				{ text: "Basic analytics", included: true },
				{ text: "Community support", included: true },
				{ text: "Custom domains", included: false },
				{ text: "Custom branding", included: false },
				{ text: "Lifetime updates", included: false },
			],
		},
		pro: {
			id: "pro",
			name: "Pro",
			description: "For teams that need subscriptions, automation, and higher limits.",
			prices: [
				{
					type: "subscription",
					amount: 9.9,
					currency: "USD",
					interval: "month",
					productId: getPublicEnv("VITE_CREEM_PRODUCT_PRO_MONTHLY"),
				},
				{
					type: "subscription",
					amount: 99,
					currency: "USD",
					interval: "year",
					productId: getPublicEnv("VITE_CREEM_PRODUCT_PRO_YEARLY"),
				},
			],
			isFree: false,
			isLifetime: false,
			popular: true,
			features: [
				{ text: "Unlimited projects", included: true },
				{ text: "10 GB storage", included: true },
				{ text: "Advanced analytics", included: true },
				{ text: "Priority support", included: true },
				{ text: "Custom domains", included: true },
				{ text: "Custom branding", included: false },
				{ text: "Lifetime updates", included: false },
			],
		},
		lifetime: {
			id: "lifetime",
			name: "Lifetime",
			description: "One-time purchase for all core features and future template updates.",
			prices: [
				{
					type: "one_time",
					amount: 199,
					currency: "USD",
					productId: getPublicEnv("VITE_CREEM_PRODUCT_LIFETIME"),
				},
			],
			isFree: false,
			isLifetime: true,
			features: [
				{ text: "All Pro features", included: true },
				{ text: "100 GB storage", included: true },
				{ text: "Dedicated support", included: true },
				{ text: "Enterprise security", included: true },
				{ text: "Advanced integrations", included: true },
				{ text: "Custom branding", included: true },
				{ text: "Lifetime updates", included: true },
			],
		},
	};
}
