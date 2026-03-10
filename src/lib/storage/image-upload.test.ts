import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	MAX_IMAGE_UPLOAD_BYTES,
	resolveImageExtension,
	saveImageFiles,
	validateImageUploadEntries,
} from "./image-upload";

const createdDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(
		createdDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("validateImageUploadEntries", () => {
	it("accepts image files", () => {
		const file = new File(["avatar"], "avatar.png", { type: "image/png" });
		const result = validateImageUploadEntries([file]);

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.files).toEqual([file]);
		}
	});

	it("rejects non-image files", () => {
		const file = new File(["notes"], "notes.txt", { type: "text/plain" });
		const result = validateImageUploadEntries([file]);

		expect(result).toEqual({
			success: false,
			error: "File notes.txt is not an image",
			status: 400,
		});
	});

	it("rejects oversized image files", () => {
		const file = new File(
			[new Uint8Array(MAX_IMAGE_UPLOAD_BYTES + 1)],
			"large.png",
			{ type: "image/png" },
		);
		const result = validateImageUploadEntries([file]);

		expect(result).toEqual({
			success: false,
			error: "File large.png exceeds the 5 MB upload limit",
			status: 400,
		});
	});
});

describe("resolveImageExtension", () => {
	it("uses the mapped mime type when available", () => {
		expect(
			resolveImageExtension({
				name: "avatar.jpeg",
				type: "image/jpeg",
			}),
		).toBe("jpg");
	});

	it("falls back to the file extension when the mime type is unknown", () => {
		expect(
			resolveImageExtension({
				name: "avatar.heic",
				type: "image/heic",
			}),
		).toBe("heic");
	});
});

describe("saveImageFiles", () => {
	it("writes image files and returns public urls", async () => {
		const uploadsDir = await mkdtemp(join(tmpdir(), "soar-upload-"));
		createdDirectories.push(uploadsDir);

		const file = new File(["avatar"], "avatar.png", { type: "image/png" });
		const urls = await saveImageFiles([file], {
			uploadsDir,
			publicPath: "/uploads/",
			createId: () => "image-1",
		});

		expect(urls).toEqual(["/uploads/image-1.png"]);
		await expect(
			readFile(join(uploadsDir, "image-1.png"), "utf8"),
		).resolves.toBe("avatar");
	});
});
