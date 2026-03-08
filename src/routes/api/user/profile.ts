import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import { user } from "#/lib/db/schema/auth";

const updateProfileSchema = z.object({
	name: z.string().min(3).max(30).optional(),
	image: z.string().optional(),
});

export const Route = createFileRoute("/api/user/profile")({
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
						id: session.user.id,
						name: session.user.name,
						email: session.user.email,
						emailVerified: session.user.emailVerified,
						image: session.user.image,
						createdAt: session.user.createdAt,
						updatedAt: session.user.updatedAt,
					},
				});
			},
			PUT: async ({ request }) => {
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
				const parsed = updateProfileSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ success: false, error: "Invalid request body" },
						{ status: 400 },
					);
				}

				const updateData: Record<string, unknown> = {};
				if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
				if (parsed.data.image !== undefined)
					updateData.image = parsed.data.image;

				if (Object.keys(updateData).length === 0) {
					return Response.json(
						{ success: false, error: "No fields to update" },
						{ status: 400 },
					);
				}

				updateData.updatedAt = new Date();

				const [updated] = await db
					.update(user)
					.set(updateData)
					.where(eq(user.id, session.user.id))
					.returning({
						id: user.id,
						name: user.name,
						email: user.email,
						emailVerified: user.emailVerified,
						image: user.image,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					});

				return Response.json({
					success: true,
					data: updated,
				});
			},
		},
	},
});
