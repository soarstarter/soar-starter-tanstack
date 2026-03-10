export type AsyncTaskStatus =
	| "pending"
	| "processing"
	| "succeeded"
	| "failed"
	| "canceled";

function isHttpUrl(value: unknown): value is string {
	return (
		typeof value === "string" &&
		(value.startsWith("https://") || value.startsWith("http://"))
	);
}

export function mapReplicatePredictionStatus(
	status: string | null | undefined,
): AsyncTaskStatus {
	switch (status) {
		case "starting":
			return "pending";
		case "processing":
			return "processing";
		case "succeeded":
			return "succeeded";
		case "failed":
			return "failed";
		case "canceled":
			return "canceled";
		default:
			return "pending";
	}
}

export function extractReplicateUrls(
	output: unknown,
	propertyNames: readonly string[],
): string[] {
	const urls = new Set<string>();

	const visit = (value: unknown) => {
		if (isHttpUrl(value)) {
			urls.add(value);
			return;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				visit(item);
			}
			return;
		}

		if (!value || typeof value !== "object") {
			return;
		}

		const record = value as Record<string, unknown>;
		const directUrl = record.url;

		if (typeof directUrl === "function") {
			try {
				const result = directUrl();
				if (isHttpUrl(result)) {
					urls.add(result);
				}
			} catch {
				// Ignore file-like objects that cannot be resolved synchronously.
			}
		}

		for (const propertyName of propertyNames) {
			visit(record[propertyName]);
		}
	};

	visit(output);

	return [...urls];
}
