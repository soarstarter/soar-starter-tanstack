import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const IMAGE_UPLOAD_DIRECTORY = join(process.cwd(), "public", "uploads");
export const IMAGE_UPLOAD_PUBLIC_PATH = "/uploads";
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_FILES = 5;

export const IMAGE_MIME_EXTENSIONS = {
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
} as const;

type ImageUploadValidationResult =
	| {
			success: true;
			files: File[];
	  }
	| {
			success: false;
			error: string;
			status: number;
	  };

type SaveImageFilesOptions = {
	uploadsDir?: string;
	publicPath?: string;
	createId?: () => string;
};

export function resolveImageExtension(file: Pick<File, "name" | "type">) {
	const normalizedType = file.type.toLowerCase();

	if (normalizedType in IMAGE_MIME_EXTENSIONS) {
		return IMAGE_MIME_EXTENSIONS[
			normalizedType as keyof typeof IMAGE_MIME_EXTENSIONS
		];
	}

	const fallbackExtension = file.name.split(".").pop()?.toLowerCase();
	return fallbackExtension && fallbackExtension.length > 0
		? fallbackExtension
		: "jpg";
}

export function validateImageUploadEntries(
	entries: FormDataEntryValue[],
): ImageUploadValidationResult {
	if (entries.length === 0) {
		return {
			success: false,
			error: "No files provided",
			status: 400,
		};
	}

	if (entries.length > MAX_IMAGE_UPLOAD_FILES) {
		return {
			success: false,
			error: `A maximum of ${MAX_IMAGE_UPLOAD_FILES} images can be uploaded at once`,
			status: 400,
		};
	}

	const files: File[] = [];

	for (const entry of entries) {
		if (!(entry instanceof File)) {
			return {
				success: false,
				error: "Invalid file",
				status: 400,
			};
		}

		if (!entry.type.startsWith("image/")) {
			return {
				success: false,
				error: `File ${entry.name} is not an image`,
				status: 400,
			};
		}

		if (entry.size > MAX_IMAGE_UPLOAD_BYTES) {
			return {
				success: false,
				error: `File ${entry.name} exceeds the 5 MB upload limit`,
				status: 400,
			};
		}

		files.push(entry);
	}

	return {
		success: true,
		files,
	};
}

export async function saveImageFiles(
	files: File[],
	options: SaveImageFilesOptions = {},
) {
	const uploadsDir = options.uploadsDir ?? IMAGE_UPLOAD_DIRECTORY;
	const publicPath = (options.publicPath ?? IMAGE_UPLOAD_PUBLIC_PATH).replace(
		/\/$/,
		"",
	);
	const createId = options.createId ?? crypto.randomUUID;

	await mkdir(uploadsDir, { recursive: true });

	const urls: string[] = [];

	for (const file of files) {
		const extension = resolveImageExtension(file);
		const filename = `${createId()}.${extension}`;
		const filepath = join(uploadsDir, filename);
		const buffer = Buffer.from(await file.arrayBuffer());

		await writeFile(filepath, buffer);
		urls.push(`${publicPath}/${filename}`);
	}

	return urls;
}
