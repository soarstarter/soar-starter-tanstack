import { createFileRoute } from "@tanstack/react-router";
import { AIPageShell } from "#/components/ai/AIPageShell";
import { AudioGenerator } from "#/components/ai/AudioGenerator";
import { websiteConfig } from "#/config/website-config";

export const Route = createFileRoute("/{-$locale}/_marketing/ai/audio")({
	head: () => ({
		meta: [
			{
				title: `AI Audio | ${websiteConfig.name}`,
			},
			{
				name: "description",
				content:
					"Turn scripts into speech or clone a reference voice with Replicate-backed audio generation.",
			},
		],
	}),
	component: AIAudioPage,
});

function AIAudioPage() {
	return (
		<AIPageShell
			description="Turn short scripts into speech, prototype narrated demos, or generate alternate deliveries from the same text."
			kicker="AI Audio"
			title="Generate speech and voice variations"
		>
			<AudioGenerator />
		</AIPageShell>
	);
}
