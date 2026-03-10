import { createFileRoute } from "@tanstack/react-router";
import { AIPageShell } from "#/components/ai/AIPageShell";
import { VideoGenerator } from "#/components/ai/VideoGenerator";
import { websiteConfig } from "#/config/website-config";

export const Route = createFileRoute("/{-$locale}/_marketing/ai/video")({
	head: () => ({
		meta: [
			{
				title: `AI Video | ${websiteConfig.name}`,
			},
			{
				name: "description",
				content:
					"Generate videos from text prompts, still images, or source clips with Replicate-backed models.",
			},
		],
	}),
	component: AIVideoPage,
});

function AIVideoPage() {
	return (
		<AIPageShell
			description="Draft concept clips, test motion ideas, or rework an existing image or clip into a new scene with video generation models."
			kicker="AI Video"
			title="Generate video from text, images, or source clips"
		>
			<VideoGenerator />
		</AIPageShell>
	);
}
