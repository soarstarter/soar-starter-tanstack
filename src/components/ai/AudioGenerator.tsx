import {
	DownloadIcon,
	Loader2Icon,
	MusicIcon,
	PauseIcon,
	PlayIcon,
	SparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Label } from "#/components/ui/label";
import { Progress } from "#/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";

type AudioMode = "text-to-audio" | "audio-to-audio";

const modelOptions = [{ label: "Qwen3-TTS", value: "qwen/qwen3-tts" }] as const;
const pollInterval = 5000;
const generationTimeout = 300000;

type GeneratedTrack = {
	id: string;
	prompt: string;
	title: string;
	url: string;
};

export function AudioGenerator() {
	const [mode, setMode] = useState<AudioMode>("text-to-audio");
	const [model, setModel] = useState(modelOptions[0].value);
	const [prompt, setPrompt] = useState("");
	const [referenceAudioUrl, setReferenceAudioUrl] = useState("");
	const [language, setLanguage] = useState("en");
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [taskStatusLabel, setTaskStatusLabel] = useState("");
	const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
	const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const canGenerate =
		!isGenerating &&
		prompt.trim().length > 0 &&
		(mode === "text-to-audio" || referenceAudioUrl.trim().length > 0);

	const resetTaskState = useCallback(() => {
		setIsGenerating(false);
		setProgress(0);
		setTaskStatusLabel("");
		startTimeRef.current = null;
		if (pollTimerRef.current) {
			clearInterval(pollTimerRef.current);
			pollTimerRef.current = null;
		}
	}, []);

	const pollTaskStatus = useCallback(
		async (taskId: string) => {
			try {
				if (
					startTimeRef.current != null &&
					Date.now() - startTimeRef.current > generationTimeout
				) {
					setError("Generation timed out.");
					resetTaskState();
					return true;
				}

				const response = await fetch("/api/ai/audio/query", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ taskId }),
				});
				const result = await response.json();

				if (result.status === "pending") {
					setTaskStatusLabel("Waiting for the model to start...");
					setProgress((current) => Math.max(current, 20));
					return false;
				}

				if (result.status === "processing") {
					setTaskStatusLabel("Generating your audio...");
					setProgress((current) => Math.min(current + 5, 85));
					return false;
				}

				if (result.status === "succeeded") {
					setGeneratedTracks(
						(result.audioUrls ?? []).map((url: string, index: number) => ({
							id: `${taskId}-${index}`,
							prompt: prompt.trim(),
							title: `Audio ${index + 1}`,
							url,
						})),
					);
					setProgress(100);
					resetTaskState();
					return true;
				}

				if (result.status === "failed") {
					setError(result.errorMessage ?? "Audio generation failed.");
					resetTaskState();
					return true;
				}
			} catch {
				setError("Failed to check audio generation status.");
				resetTaskState();
				return true;
			}

			return false;
		},
		[prompt, resetTaskState],
	);

	const startPolling = useCallback(
		async (taskId: string) => {
			const done = await pollTaskStatus(taskId);

			if (done) {
				return;
			}

			pollTimerRef.current = setInterval(async () => {
				const completed = await pollTaskStatus(taskId);

				if (completed && pollTimerRef.current) {
					clearInterval(pollTimerRef.current);
					pollTimerRef.current = null;
				}
			}, pollInterval);
		},
		[pollTaskStatus],
	);

	useEffect(
		() => () => {
			if (pollTimerRef.current) {
				clearInterval(pollTimerRef.current);
			}
			audioRef.current?.pause();
		},
		[],
	);

	async function handleGenerate() {
		if (!canGenerate) {
			return;
		}

		setError(null);
		setGeneratedTracks([]);
		setIsGenerating(true);
		setProgress(15);
		setTaskStatusLabel("Creating task...");
		startTimeRef.current = Date.now();

		try {
			const options: Record<string, unknown> = {
				language,
				mode: mode === "text-to-audio" ? "voice" : "clone",
			};

			if (mode === "audio-to-audio") {
				options.reference_audio = referenceAudioUrl.trim();
			}

			const response = await fetch("/api/ai/audio", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model,
					options,
					prompt: prompt.trim(),
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				setError(result.message ?? "Failed to create audio task.");
				resetTaskState();
				return;
			}

			setProgress(25);
			await startPolling(result.taskId);
		} catch {
			setError("Failed to create audio task.");
			resetTaskState();
		}
	}

	async function togglePlay(track: GeneratedTrack) {
		if (currentPlayingId === track.id && audioRef.current) {
			if (!audioRef.current.paused) {
				audioRef.current.pause();
				setCurrentPlayingId(null);
				return;
			}
		}

		audioRef.current?.pause();

		const audio = new Audio(track.url);
		audioRef.current = audio;
		setCurrentPlayingId(track.id);
		audio.onended = () => {
			setCurrentPlayingId(null);
			audioRef.current = null;
		};

		try {
			await audio.play();
		} catch {
			setCurrentPlayingId(null);
			audioRef.current = null;
		}
	}

	async function handleDownload(track: GeneratedTrack) {
		try {
			const response = await fetch(track.url, { mode: "cors" });

			if (!response.ok) {
				throw new Error("Unable to fetch generated audio.");
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `${track.title}-${Date.now()}.mp3`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
		} catch {
			window.open(track.url, "_blank", "noopener,noreferrer");
		}
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="border-white/50 bg-background/75 dark:border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MusicIcon className="size-5" />
						Audio prompt
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Tabs
						onValueChange={(value) => setMode(value as AudioMode)}
						value={mode}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="text-to-audio">Text to audio</TabsTrigger>
							<TabsTrigger value="audio-to-audio">Voice clone</TabsTrigger>
						</TabsList>
						<TabsContent className="space-y-2" value="audio-to-audio">
							<Label htmlFor="reference-audio-url">Reference audio URL</Label>
							<Textarea
								className="min-h-24"
								id="reference-audio-url"
								onChange={(event) => setReferenceAudioUrl(event.target.value)}
								placeholder="https://example.com/reference-voice.mp3"
								value={referenceAudioUrl}
							/>
						</TabsContent>
					</Tabs>

					<div className="space-y-2">
						<Label htmlFor="audio-prompt">Prompt</Label>
						<Textarea
							className="min-h-32 resize-none"
							id="audio-prompt"
							onChange={(event) => setPrompt(event.target.value)}
							placeholder="Write the script or lyrics you want synthesized..."
							value={prompt}
						/>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="audio-model">Model</Label>
							<Select onValueChange={setModel} value={model}>
								<SelectTrigger id="audio-model">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{modelOptions.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="audio-language">Language</Label>
							<Select onValueChange={setLanguage} value={language}>
								<SelectTrigger id="audio-language">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="zh">Chinese</SelectItem>
									<SelectItem value="ja">Japanese</SelectItem>
									<SelectItem value="ko">Korean</SelectItem>
									<SelectItem value="fr">French</SelectItem>
									<SelectItem value="de">German</SelectItem>
									<SelectItem value="es">Spanish</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<Button
						className="w-full"
						disabled={!canGenerate}
						onClick={() => {
							void handleGenerate();
						}}
						size="lg"
					>
						{isGenerating ? (
							<Loader2Icon className="mr-2 size-4 animate-spin" />
						) : (
							<SparklesIcon className="mr-2 size-4" />
						)}
						{isGenerating ? "Generating..." : "Generate audio"}
					</Button>

					{error ? <p className="text-destructive text-sm">{error}</p> : null}

					{isGenerating ? (
						<div className="space-y-2 rounded-xl border bg-muted/30 p-4">
							<div className="flex items-center justify-between text-sm">
								<span>Progress</span>
								<span>{progress}%</span>
							</div>
							<Progress value={progress} />
							<p className="text-center text-muted-foreground text-xs">
								{taskStatusLabel}
							</p>
						</div>
					) : null}
				</CardContent>
			</Card>

			<Card className="border-white/50 bg-background/75 dark:border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MusicIcon className="size-5" />
						Generated tracks
					</CardTitle>
				</CardHeader>
				<CardContent>
					{generatedTracks.length > 0 ? (
						<div className="space-y-3">
							{generatedTracks.map((track) => (
								<div
									className="flex items-center justify-between gap-4 rounded-xl border bg-background/55 p-3"
									key={track.id}
								>
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">{track.title}</p>
										<p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
											{track.prompt}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Button
											onClick={() => void togglePlay(track)}
											size="icon-sm"
											variant="outline"
										>
											{currentPlayingId === track.id ? (
												<PauseIcon className="size-4" />
											) : (
												<PlayIcon className="size-4" />
											)}
										</Button>
										<Button
											onClick={() => void handleDownload(track)}
											size="icon-sm"
											variant="ghost"
										>
											<DownloadIcon className="size-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex min-h-[28rem] flex-col items-center justify-center text-center text-muted-foreground">
							<MusicIcon className="mb-3 size-10" />
							<p className="font-medium">
								{isGenerating
									? "Your tracks will appear here."
									: "No tracks generated yet."}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
