import {
	DownloadIcon,
	Loader2Icon,
	SparklesIcon,
	VideoIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type VideoScene = "text-to-video" | "image-to-video" | "video-to-video";

const modelOptions = [
	{
		label: "Kling 2.5 Turbo Pro",
		scenes: [
			"text-to-video",
			"image-to-video",
			"video-to-video",
		] as VideoScene[],
		value: "kwaivgi/kling-v2.5-turbo-pro",
	},
	{
		label: "Veo 3.1",
		scenes: [
			"text-to-video",
			"image-to-video",
			"video-to-video",
		] as VideoScene[],
		value: "google/veo-3.1",
	},
	{
		label: "Sora 2",
		scenes: [
			"text-to-video",
			"image-to-video",
			"video-to-video",
		] as VideoScene[],
		value: "openai/sora-2",
	},
] as const;

const pollInterval = 15000;
const generationTimeout = 600000;
const maxPromptLength = 2000;
const emptyCaptionsTrackSrc = "data:text/vtt;charset=utf-8,WEBVTT%0A%0A";

type GeneratedVideo = {
	id: string;
	model?: string;
	prompt?: string;
	url: string;
};

export function VideoGenerator() {
	const [scene, setScene] = useState<VideoScene>("text-to-video");
	const [model, setModel] = useState(modelOptions[0].value);
	const [prompt, setPrompt] = useState("");
	const [referenceImageUrl, setReferenceImageUrl] = useState("");
	const [referenceVideoUrl, setReferenceVideoUrl] = useState("");
	const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [taskStatusLabel, setTaskStatusLabel] = useState("");
	const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);

	const availableModels = useMemo(
		() => modelOptions.filter((option) => option.scenes.includes(scene)),
		[scene],
	);

	const promptLength = prompt.trim().length;
	const isPromptTooLong = promptLength > maxPromptLength;

	const canGenerate =
		!isGenerating &&
		prompt.trim().length > 0 &&
		(scene === "text-to-video" ||
			(scene === "image-to-video" && referenceImageUrl.trim().length > 0) ||
			(scene === "video-to-video" && referenceVideoUrl.trim().length > 0));

	useEffect(() => {
		if (!availableModels.some((option) => option.value === model)) {
			setModel(availableModels[0]?.value ?? modelOptions[0].value);
		}
	}, [availableModels, model]);

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

				const response = await fetch("/api/ai/video/query", {
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
					setTaskStatusLabel("Generating your video...");
					if (result.videoUrls?.length > 0) {
						setGeneratedVideos(
							result.videoUrls.map((url: string, index: number) => ({
								id: `${taskId}-${index}`,
								model,
								prompt: prompt.trim() || undefined,
								url,
							})),
						);
						setProgress((current) => Math.max(current, 85));
					} else {
						setProgress((current) => Math.min(current + 4, 80));
					}
					return false;
				}

				if (result.status === "succeeded") {
					setGeneratedVideos(
						(result.videoUrls ?? []).map((url: string, index: number) => ({
							id: `${taskId}-${index}`,
							model,
							prompt: prompt.trim() || undefined,
							url,
						})),
					);
					setProgress(100);
					resetTaskState();
					return true;
				}

				if (result.status === "failed") {
					setError(result.errorMessage ?? "Video generation failed.");
					resetTaskState();
					return true;
				}
			} catch {
				setError("Failed to check video generation status.");
				resetTaskState();
				return true;
			}

			return false;
		},
		[model, prompt, resetTaskState],
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
		},
		[],
	);

	async function handleGenerate() {
		if (!canGenerate || isPromptTooLong) {
			return;
		}

		setError(null);
		setGeneratedVideos([]);
		setIsGenerating(true);
		setProgress(15);
		setTaskStatusLabel("Creating task...");
		startTimeRef.current = Date.now();

		try {
			const body: Record<string, unknown> = {
				model,
				prompt: prompt.trim(),
				scene,
			};

			if (scene === "image-to-video") {
				body.imageInput = [referenceImageUrl.trim()];
			}

			if (scene === "video-to-video") {
				body.videoInput = [referenceVideoUrl.trim()];
			}

			const response = await fetch("/api/ai/video", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const result = await response.json();

			if (!response.ok) {
				setError(result.message ?? "Failed to create video task.");
				resetTaskState();
				return;
			}

			setProgress(25);
			await startPolling(result.taskId);
		} catch {
			setError("Failed to create video task.");
			resetTaskState();
		}
	}

	async function handleDownload(video: GeneratedVideo) {
		try {
			setDownloadingVideoId(video.id);
			const response = await fetch(video.url, { mode: "cors" });

			if (!response.ok) {
				throw new Error("Unable to fetch generated video.");
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `${video.id}.mp4`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
		} catch {
			window.open(video.url, "_blank", "noopener,noreferrer");
		} finally {
			setDownloadingVideoId(null);
		}
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="border-white/50 bg-background/75 dark:border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<VideoIcon className="size-5" />
						Video prompt
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Tabs
						onValueChange={(value) => setScene(value as VideoScene)}
						value={scene}
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="text-to-video">Text</TabsTrigger>
							<TabsTrigger value="image-to-video">Image</TabsTrigger>
							<TabsTrigger value="video-to-video">Video</TabsTrigger>
						</TabsList>
						<TabsContent className="space-y-2" value="image-to-video">
							<Label htmlFor="reference-image-url">Reference image URL</Label>
							<Textarea
								className="min-h-24"
								id="reference-image-url"
								onChange={(event) => setReferenceImageUrl(event.target.value)}
								placeholder="https://example.com/scene.png"
								value={referenceImageUrl}
							/>
						</TabsContent>
						<TabsContent className="space-y-2" value="video-to-video">
							<Label htmlFor="reference-video-url">Reference video URL</Label>
							<Textarea
								className="min-h-24"
								id="reference-video-url"
								onChange={(event) => setReferenceVideoUrl(event.target.value)}
								placeholder="https://example.com/clip.mp4"
								value={referenceVideoUrl}
							/>
						</TabsContent>
					</Tabs>

					<div className="space-y-2">
						<Label htmlFor="video-prompt">Prompt</Label>
						<Textarea
							className="min-h-36 resize-none"
							id="video-prompt"
							onChange={(event) => setPrompt(event.target.value)}
							placeholder="Describe the motion, framing, and pacing you want..."
							value={prompt}
						/>
						<div className="flex items-center justify-between text-muted-foreground text-xs">
							<span>
								{promptLength} / {maxPromptLength}
							</span>
							{isPromptTooLong ? (
								<span className="text-destructive">Prompt too long</span>
							) : null}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="video-model">Model</Label>
						<Select onValueChange={setModel} value={model}>
							<SelectTrigger id="video-model">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{availableModels.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Button
						className="w-full"
						disabled={!canGenerate || isPromptTooLong}
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
						{isGenerating ? "Generating..." : "Generate video"}
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
						<VideoIcon className="size-5" />
						Generated videos
					</CardTitle>
				</CardHeader>
				<CardContent>
					{generatedVideos.length > 0 ? (
						<div className="space-y-6">
							{generatedVideos.map((video) => (
								<div className="space-y-3" key={video.id}>
									<div className="overflow-hidden rounded-[1.5rem] border">
										<video
											className="h-auto w-full"
											controls
											preload="metadata"
											src={video.url}
										>
											<track
												default
												kind="captions"
												label="Captions unavailable"
												src={emptyCaptionsTrackSrc}
												srcLang="en"
											/>
										</video>
									</div>
									<div className="flex justify-end">
										<Button
											disabled={downloadingVideoId === video.id}
											onClick={() => void handleDownload(video)}
											size="sm"
											variant="outline"
										>
											{downloadingVideoId === video.id ? (
												<Loader2Icon className="mr-2 size-4 animate-spin" />
											) : (
												<DownloadIcon className="mr-2 size-4" />
											)}
											Download
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex min-h-[28rem] flex-col items-center justify-center text-center text-muted-foreground">
							<VideoIcon className="mb-3 size-10" />
							<p className="font-medium">
								{isGenerating
									? "Your video will appear here."
									: "No videos generated yet."}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
