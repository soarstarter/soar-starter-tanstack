import {
	CircleUserRound,
	CreditCard,
	LayoutDashboard,
	ListOrdered,
	LockKeyhole,
	Settings,
	Settings2,
	UsersRound,
} from "lucide-react";
import { createElement } from "react";
import type { NestedMenuItem } from "#/types";

function isDemoMode() {
	if (typeof import.meta !== "undefined" && import.meta.env) {
		return import.meta.env.VITE_IS_DEMO === "true";
	}

	if (typeof process !== "undefined") {
		return process.env.VITE_IS_DEMO === "true";
	}

	return false;
}

export function getUserSidebarLinks(): NestedMenuItem[] {
	const demoMode = isDemoMode();

	return [
		{
			title: "Dashboard",
			icon: createElement(LayoutDashboard),
			href: "/dashboard",
		},
		{
			title: "Admin",
			icon: createElement(Settings),
			roles: demoMode ? ["admin", "user"] : ["admin"],
			items: [
				{
					title: "Users",
					icon: createElement(UsersRound),
					href: "/admin/users",
				},
			],
		},
		{
			title: "Account",
			icon: createElement(Settings),
			items: [
				{
					title: "Order",
					icon: createElement(ListOrdered),
					href: "/account/order",
				},
				{
					title: "Subscription",
					icon: createElement(CreditCard),
					href: "/account/subscription",
				},
			],
		},
		{
			title: "Settings",
			icon: createElement(Settings2),
			items: [
				{
					title: "Profile",
					icon: createElement(CircleUserRound),
					href: "/setting/profile",
				},
				{
					title: "Security",
					icon: createElement(LockKeyhole),
					href: "/setting/security",
				},
				{
					title: "Billing",
					icon: createElement(CreditCard),
					href: "/setting/billing",
				},
			],
		},
	];
}
