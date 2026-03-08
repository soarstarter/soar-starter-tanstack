import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import { session as sessionTable } from "#/lib/db/schema/auth";

export const Route = createFileRoute("/api/user/settings")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const currentSession = await auth.api.getSession({
					headers: request.headers,
				});

				if (!currentSession?.user) {
					return Response.json(
						{ success: false, error: "Unauthorized" },
						{ status: 401 },
					);
				}

				const sessions = await db.query.session.findMany({
					where: eq(sessionTable.userId, currentSession.user.id),
				});

				return Response.json({
					success: true,
					data: {
						userId: currentSession.user.id,
						preferences: {
							theme: "light",
							language: "en",
							notifications: {
								email: true,
								sms: false,
								push: true,
							},
							privacy: {
								profilePublic: false,
								showEmail: false,
							},
						},
						security: {
							twoFactorEnabled: false,
							lastPasswordChange: currentSession.user.updatedAt,
							sessions: sessions.map((s) => ({
								id: s.id,
								current: s.id === currentSession.session.id,
								ipAddress: s.ipAddress,
								userAgent: s.userAgent,
								createdAt: s.createdAt,
							})),
						},
					},
				});
			},
		},
	},
});
