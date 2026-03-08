import { Creem } from "creem";
import { eq } from "drizzle-orm";
import { db } from "#/lib/db";
import { payment, subscription } from "#/lib/db/schema/payment";

const creem = new Creem({
	serverIdx: Number(process.env.CREEM_SERVER_IDX ?? 0),
	apiKey: process.env.CREEM_API_KEY,
});

interface CreateCheckoutParams {
	productId: string;
	successUrl: string;
	requestId: string;
	email: string;
	userId: string;
}

export async function createCreemCheckout(params: CreateCheckoutParams) {
	const result = await creem.checkouts.create({
		productId: params.productId,
		successUrl: params.successUrl,
		requestId: params.requestId,
		customer: {
			email: params.email,
		},
		metadata: {
			email: params.email,
			userId: params.userId,
		},
	});

	return result;
}

interface WebhookPayload {
	eventType?: string;
	object?: {
		id?: string;
		request_id?: string;
		customer?: {
			id?: string;
		};
		product?: {
			id?: string;
			type?: string;
		};
		subscription?: {
			id?: string;
			current_period_start?: string;
			current_period_end?: string;
			status?: string;
		};
		metadata?: {
			email?: string;
			userId?: string;
		};
	};
}

export async function handleCreemWebhook(body: WebhookPayload) {
	const eventType = body.eventType;
	const obj = body.object;

	if (!obj) return;

	if (eventType === "checkout.completed") {
		const orderNo = obj.request_id;
		if (!orderNo) return;

		await db
			.update(payment)
			.set({
				status: "success",
				thirdOrderNo: obj.id,
				customerId: obj.customer?.id,
				updatedAt: new Date(),
			})
			.where(eq(payment.orderNo, orderNo));
	}

	if (eventType === "subscription.paid") {
		const metadata = obj.metadata;
		if (!metadata?.userId) return;

		const sub = obj.subscription;
		const productType =
			obj.product?.type === "one_time"
				? "one_time"
				: sub
					? "month"
					: "one_time";

		const periodStart = sub?.current_period_start
			? new Date(sub.current_period_start)
			: new Date();
		const periodEnd = sub?.current_period_end
			? new Date(sub.current_period_end)
			: new Date();

		const existing = await db.query.subscription.findFirst({
			where: eq(subscription.userId, metadata.userId),
		});

		if (existing) {
			await db
				.update(subscription)
				.set({
					productId: obj.product?.id ?? "",
					planInterval: productType as "one_time" | "month" | "year",
					provider: "creem",
					customerId: obj.customer?.id,
					subscriptionId: sub?.id,
					status: "active",
					lastOrderNo: obj.request_id,
					lastPaidAt: new Date(),
					periodStart,
					periodEnd,
					updatedAt: new Date(),
				})
				.where(eq(subscription.userId, metadata.userId));
		} else {
			await db.insert(subscription).values({
				userId: metadata.userId,
				productId: obj.product?.id ?? "",
				planInterval: productType as "one_time" | "month" | "year",
				provider: "creem",
				customerId: obj.customer?.id,
				subscriptionId: sub?.id,
				status: "active",
				lastOrderNo: obj.request_id,
				lastPaidAt: new Date(),
				periodStart,
				periodEnd,
			});
		}
	}
}
