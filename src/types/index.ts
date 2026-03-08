import type { ReactNode } from "react";

export type MenuItem = {
	title: string;
	description?: string;
	icon?: ReactNode;
	href?: string;
	target?: "_blank" | "_parent" | "_self" | "_top" | (string & {});
	external?: boolean;
	badge?: string;
	roles?: string[];
};

export type NestedMenuItem = MenuItem & {
	items?: MenuItem[];
};

export interface SocialConfig {
	twitter?: string;
	github?: string;
	discord?: string;
	blueSky?: string;
	mastodon?: string;
	youtube?: string;
	linkedin?: string;
	facebook?: string;
	instagram?: string;
	tiktok?: string;
	telegram?: string;
}

export interface MailConfig {
	provider: string;
	fromEmail: string;
	supportEmail: string;
}

export interface MetadataConfig {
	title: string;
	description: string;
	applicationName: string;
	siteUrl: string;
	ogImage: string;
	keywords: string[];
	social?: SocialConfig;
}

export interface WebsiteConfig {
	name: string;
	description: string;
	metadata: MetadataConfig;
	mail: MailConfig;
}

export type PlanInterval = "month" | "year";

export type PaymentType = "subscription" | "one_time";

export interface Price {
	type: PaymentType;
	amount: number;
	currency: string;
	interval?: PlanInterval;
	productId?: string;
	disabled?: boolean;
}

export interface PlanFeature {
	text: string;
	included: boolean;
}

export interface PricePlan {
	id: string;
	name: string;
	description: string;
	prices: Price[];
	isFree: boolean;
	isLifetime: boolean;
	popular?: boolean;
	disabled?: boolean;
	features: PlanFeature[];
}
