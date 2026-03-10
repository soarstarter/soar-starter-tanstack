import { createFileRoute } from "@tanstack/react-router";
import { AIPageShell } from "#/components/ai/AIPageShell";
import { ImageGenerator } from "#/components/ai/ImageGenerator";
import { buildSeoMeta } from "#/lib/seo";

export const Route = createFileRoute("/{-$locale}/_marketing/ai/image")({
	head: () =>
		buildSeoMeta({
			title: "AI Image",
			description:
				"Generate images from prompts or transform uploaded references with Replicate models.",
			path: "/ai/image",
		}),
	component: AIImagePage,
});

function AIImagePage() {
	return (
		<AIPageShell
			description="Generate polished visuals from plain text prompts or upload a reference image and restyle it with a new direction."
			kicker="AI Image"
			title="Create images from prompts or references"
		>
			<ImageGenerator />
		</AIPageShell>
	);
}
