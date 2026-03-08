import { createFileRoute } from "@tanstack/react-router";
import { auth } from "#/lib/auth";

export const Route = createFileRoute("/api/user/billing")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json(
						{ success: false, error: "Unauthorized" },
						{ status: 401 },
					);
				}

				return Response.json({
					success: true,
					data: {
						userId: session.user.id,
						subscription: {
							plan: "free",
							status: "active",
							startDate: session.user.createdAt,
							endDate: null,
							autoRenew: false,
						},
						billing: {
							currency: "USD",
							paymentMethod: null,
							nextBillingDate: null,
							billingHistory: [],
						},
						usage: {
							currentPeriod: {
								requests: 0,
								storage: 0,
								bandwidth: 0,
							},
							limits: {
								requests: 1000,
								storage: 1024,
								bandwidth: 10240,
							},
						},
					},
				});
			},
		},
	},
});
