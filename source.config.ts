import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
	dir: "content/docs",
});

export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z
			.string()
			.date()
			.or(z.date())
			.transform((value) => new Date(value)),
		author: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		image: z.string().optional(),
	}),
});

export default defineConfig();
