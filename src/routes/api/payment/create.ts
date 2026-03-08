import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import { payment } from "#/lib/db/schema/payment";
import { createCreemCheckout } from "#/lib/payment/creem";
import { buildOrderNo } from "#/lib/payment/order-no";

const createPaymentSchema = z.object({
	email: z.string().email(),
	productId: z.string().min(1),
});

export const Route = createFileRoute("/api/payment/create")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json(
						{ success: false, error: "Unauthorized" },
						{ status: 401 },
					);
				}

				const body = await request.json();
				const parsed = createPaymentSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ success: false, error: "Invalid request body" },
						{ status: 400 },
					);
				}

				const { email, productId } = parsed.data;
				const orderNo = buildOrderNo();
				const origin = new URL(request.url).origin;
				const successUrl = `${origin}/pay-success?orderId=${orderNo}`;

				const result = await createCreemCheckout({
					productId,
					successUrl,
					requestId: orderNo,
					email,
					userId: session.user.id,
				});

				await db.insert(payment).values({
					userId: session.user.id,
					productId,
					amount: 0,
					currency: "USD",
					status: "paying",
					provider: "creem",
					orderNo,
				});

				return Response.json({
					success: true,
					data: {
						orderNo,
						checkoutUrl: result.checkoutUrl,
					},
				});
			},
		},
	},
});
