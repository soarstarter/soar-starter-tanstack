import { describe, expect, it } from "vitest";
import {
	extractReplicateUrls,
	mapReplicatePredictionStatus,
} from "./replicate-utils";

describe("mapReplicatePredictionStatus", () => {
	it("maps known prediction statuses", () => {
		expect(mapReplicatePredictionStatus("starting")).toBe("pending");
		expect(mapReplicatePredictionStatus("processing")).toBe("processing");
		expect(mapReplicatePredictionStatus("succeeded")).toBe("succeeded");
		expect(mapReplicatePredictionStatus("failed")).toBe("failed");
		expect(mapReplicatePredictionStatus("canceled")).toBe("canceled");
	});

	it("falls back to pending for unknown statuses", () => {
		expect(mapReplicatePredictionStatus(undefined)).toBe("pending");
		expect(mapReplicatePredictionStatus("queued")).toBe("pending");
	});
});

describe("extractReplicateUrls", () => {
	it("extracts urls from strings, arrays, and file-like objects", () => {
		const output = [
			"https://cdn.example.com/asset.png",
			{ src: "https://cdn.example.com/asset-2.png" },
			{
				url: () => "https://cdn.example.com/asset-3.png",
			},
		];

		expect(extractReplicateUrls(output, ["url", "src"])).toEqual([
			"https://cdn.example.com/asset.png",
			"https://cdn.example.com/asset-2.png",
			"https://cdn.example.com/asset-3.png",
		]);
	});

	it("ignores non-http values and deduplicates matches", () => {
		const output = {
			url: "https://cdn.example.com/video.mp4",
			videoUrl: "https://cdn.example.com/video.mp4",
			nested: "blob:test",
		};

		expect(extractReplicateUrls(output, ["url", "videoUrl", "nested"])).toEqual(
			["https://cdn.example.com/video.mp4"],
		);
	});
});
