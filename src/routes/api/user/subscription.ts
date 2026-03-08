import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import { subscription } from "#/lib/db/schema/payment";

export const Route = createFileRoute("/api/user/subscription")({
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

				const sub = await db.query.subscription.findFirst({
					where: eq(subscription.userId, session.user.id),
				});

				if (!sub) {
					return Response.json({
						success: true,
						data: null,
					});
				}

				return Response.json({
					success: true,
					data: {
						id: sub.id,
						userId: sub.userId,
						productId: sub.productId,
						planInterval: sub.planInterval,
						provider: sub.provider,
						status: sub.status,
						customerId: sub.customerId,
						subscriptionId: sub.subscriptionId,
						lastOrderNo: sub.lastOrderNo,
						lastPaidAt: sub.lastPaidAt,
						trialStart: sub.trialStart,
						trialEnd: sub.trialEnd,
						periodStart: sub.periodStart,
						periodEnd: sub.periodEnd,
						cancelAt: sub.cancelAt,
						canceledAt: sub.canceledAt,
						createdAt: sub.createdAt,
						updatedAt: sub.updatedAt,
					},
				});
			},
		},
	},
});
