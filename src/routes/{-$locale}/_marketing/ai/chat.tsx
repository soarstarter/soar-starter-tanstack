import { createFileRoute } from "@tanstack/react-router";
import { AIPageShell } from "#/components/ai/AIPageShell";
import { ChatBot } from "#/components/ai/ChatBot";
import { buildSeoMeta } from "#/lib/seo";

export const Route = createFileRoute("/{-$locale}/_marketing/ai/chat")({
	head: () =>
		buildSeoMeta({
			title: "AI Chat",
			description:
				"Streaming AI chat with file attachments and optional live web search.",
			path: "/ai/chat",
		}),
	component: AIChatPage,
});

function AIChatPage() {
	return (
		<AIPageShell
			description="Use a streaming assistant for drafting, debugging, research, and quick product questions. Attach files or turn on web search when the answer needs fresh context."
			kicker="AI Chat"
			title="Stream responses with files and live search"
		>
			<ChatBot />
		</AIPageShell>
	);
}
