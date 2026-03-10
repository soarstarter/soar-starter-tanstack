import { createFileRoute } from "@tanstack/react-router";
import { auth } from "#/lib/auth";
import {
	saveImageFiles,
	validateImageUploadEntries,
} from "#/lib/storage/image-upload";

export const Route = createFileRoute("/api/storage/upload-image")({
	staticData: { skipLayout: true },
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

				try {
					const formData = await request.formData();
					const validation = validateImageUploadEntries(
						formData.getAll("files"),
					);

					if (!validation.success) {
						return Response.json(
							{ success: false, error: validation.error },
							{ status: validation.status },
						);
					}

					const urls = await saveImageFiles(validation.files);

					return Response.json({
						success: true,
						data: {
							urls,
						},
					});
				} catch (error) {
					return Response.json(
						{
							success: false,
							error:
								error instanceof Error
									? error.message
									: "Failed to upload images",
						},
						{ status: 500 },
					);
				}
			},
		},
	},
});
