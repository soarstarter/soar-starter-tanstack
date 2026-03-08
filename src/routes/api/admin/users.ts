import { createFileRoute } from "@tanstack/react-router";
import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import { user } from "#/lib/db/schema/auth";

export const Route = createFileRoute("/api/admin/users")({
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

				if (session.user.role !== "admin") {
					return Response.json(
						{ success: false, error: "Forbidden" },
						{ status: 403 },
					);
				}

				const { searchParams } = new URL(request.url);
				const page = Math.max(1, Number(searchParams.get("page")) || 1);
				const pageSize = Math.min(
					100,
					Math.max(1, Number(searchParams.get("pageSize")) || 10),
				);
				const search = searchParams.get("search") || "";
				const role = searchParams.get("role") || "";
				const banned = searchParams.get("banned");

				const conditions = [];

				if (search) {
					conditions.push(
						or(
							ilike(user.name, `%${search}%`),
							ilike(user.email, `%${search}%`),
						),
					);
				}

				if (role) {
					conditions.push(eq(user.role, role));
				}

				if (banned === "true") {
					conditions.push(eq(user.banned, true));
				} else if (banned === "false") {
					conditions.push(eq(user.banned, false));
				}

				const where = conditions.length > 0 ? and(...conditions) : undefined;

				const [totalResult] = await db
					.select({ count: count() })
					.from(user)
					.where(where);

				const total = totalResult.count;
				const totalPages = Math.ceil(total / pageSize);
				const offset = (page - 1) * pageSize;

				const users = await db
					.select({
						id: user.id,
						name: user.name,
						email: user.email,
						emailVerified: user.emailVerified,
						image: user.image,
						role: user.role,
						banned: user.banned,
						banReason: user.banReason,
						banExpires: user.banExpires,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					})
					.from(user)
					.where(where)
					.orderBy(sql`${user.createdAt} desc`)
					.limit(pageSize)
					.offset(offset);

				return Response.json({
					success: true,
					data: {
						users,
						pagination: {
							page,
							pageSize,
							total,
							totalPages,
						},
					},
				});
			},
		},
	},
});
