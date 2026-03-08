import type { NestedMenuItem } from "#/types";
import { Routes } from "./route-config";

export const footerLinkGroups: NestedMenuItem[] = [
	{
		title: "Product",
		items: [
			{
				title: "Features",
				href: Routes.Features,
			},
			{
				title: "Pricing",
				href: Routes.Pricing,
			},
			{
				title: "FAQ",
				href: Routes.FAQ,
			},
		],
	},
	{
		title: "Resources",
		items: [
			{
				title: "Blog",
				href: Routes.Blog,
			},
			{
				title: "Docs",
				href: Routes.Docs,
			},
		],
	},
	{
		title: "Company",
		items: [
			{
				title: "About",
				href: Routes.About,
			},
			{
				title: "Contact",
				href: Routes.Contact,
			},
		],
	},
	{
		title: "Legal",
		items: [
			{
				title: "Cookie Policy",
				href: Routes.CookiePolicy,
			},
			{
				title: "Privacy Policy",
				href: Routes.PrivacyPolicy,
			},
			{
				title: "Terms of Service",
				href: Routes.TermsOfService,
			},
		],
	},
];
