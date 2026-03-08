import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const providerEnum = pgEnum("provider", [
	"zpay",
	"creem",
	"stripe",
	"polar",
]);

export const planIntervalEnum = pgEnum("plan_interval", [
	"one_time",
	"month",
	"year",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
	"trialing",
	"active",
	"unpaid",
	"canceled",
	"expired",
]);

export const orderStatusEnum = pgEnum("order_status", [
	"paying",
	"success",
	"failed",
	"closed",
	"refunded",
]);

export const subscription = pgTable(
	"subscription",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
			.unique(),
		productId: text("product_id").notNull(),
		planInterval: planIntervalEnum("plan_interval")
			.notNull()
			.default("one_time"),
		provider: providerEnum("provider").notNull().default("creem"),
		customerId: text("customer_id"),
		subscriptionId: text("subscription_id"),
		status: subscriptionStatusEnum("status").notNull(),
		lastOrderNo: text("last_order_no"),
		lastPaidAt: timestamp("last_paid_at"),
		trialStart: timestamp("trial_start"),
		trialEnd: timestamp("trial_end"),
		periodStart: timestamp("period_start").defaultNow().notNull(),
		periodEnd: timestamp("period_end").notNull(),
		cancelAt: timestamp("cancel_at"),
		canceledAt: timestamp("canceled_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("subscription_user_idx").on(table.userId),
		index("subscription_status_idx").on(table.status),
	],
);

export const payment = pgTable(
	"payment",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		productId: text("product_id").notNull(),
		amount: integer("amount").notNull(),
		currency: text("currency").notNull().default("USD"),
		status: orderStatusEnum("status").notNull().default("paying"),
		provider: providerEnum("provider").notNull().default("creem"),
		orderNo: text("order_no").notNull().unique(),
		thirdOrderNo: text("third_order_no"),
		customerId: text("customer_id"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("payment_user_idx").on(table.userId),
		index("payment_order_no_idx").on(table.orderNo),
	],
);
