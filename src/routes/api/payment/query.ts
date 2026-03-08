import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "#/lib/db";
import { payment } from "#/lib/db/schema/payment";

export const Route = createFileRoute("/api/payment/query")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const { searchParams } = new URL(request.url);
				const orderId = searchParams.get("orderId");

				if (!orderId) {
					return Response.json(
						{ success: false, error: "orderId is required" },
						{ status: 400 },
					);
				}

				const record = await db.query.payment.findFirst({
					where: eq(payment.orderNo, orderId),
				});

				if (!record) {
					return Response.json(
						{ success: false, error: "Order not found" },
						{ status: 404 },
					);
				}

				return Response.json({
					success: true,
					data: {
						orderId: record.orderNo,
						status: record.status,
						productId: record.productId,
						amount: record.amount,
						currency: record.currency,
						createdAt: record.createdAt,
						updatedAt: record.updatedAt,
					},
				});
			},
		},
	},
});
