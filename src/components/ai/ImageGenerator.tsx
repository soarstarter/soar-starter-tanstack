import {
	DownloadIcon,
	ImageIcon,
	Loader2Icon,
	SparklesIcon,
	XIcon,
} from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
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

const models = [
	{ label: "FLUX 2 Pro", value: "black-forest-labs/flux-2-pro" },
	{ label: "Seedream 3", value: "bytedance/seedream-3" },
] as const;

const sizes = [
	{ label: "1024x1024", value: "1024x1024" },
	{ label: "1792x1024", value: "1792x1024" },
	{ label: "1024x1792", value: "1024x1792" },
] as const;

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 300000;

export function ImageGenerator() {
	const [mode, setMode] = useState<"text" | "image">("text");
	const [prompt, setPrompt] = useState("");
	const [sourceImage, setSourceImage] = useState<string | null>(null);
	const [sourceImageName, setSourceImageName] = useState<string | null>(null);
	const [model, setModel] = useState(models[0].value);
	const [size, setSize] = useState(sizes[0].value);
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [taskStatusLabel, setTaskStatusLabel] = useState("");
	const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);

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
					Date.now() - startTimeRef.current > GENERATION_TIMEOUT
				) {
					setError("Generation timed out.");
					resetTaskState();
					return true;
				}

				const response = await fetch("/api/ai/image/query", {
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
					setTaskStatusLabel("Generating your image...");
					setProgress((current) => Math.min(current + 5, 85));
					return false;
				}

				if (result.status === "succeeded") {
					setTaskStatusLabel("Image ready.");
					setGeneratedImageUrl(result.imageUrls?.[0] ?? null);
					setProgress(100);
					resetTaskState();
					return true;
				}

				if (result.status === "failed") {
					setError(result.errorMessage ?? "Image generation failed.");
					resetTaskState();
					return true;
				}
			} catch {
				setError("Failed to check image generation status.");
				resetTaskState();
				return true;
			}

			return false;
		},
		[resetTaskState],
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
			}, POLL_INTERVAL);
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

	const canGenerate =
		!isGenerating &&
		(mode === "text" ? prompt.trim().length > 0 : Boolean(sourceImage));
	const generatedArtworkAlt = prompt.trim()
		? "Generated artwork based on the current prompt"
		: "Generated artwork";

	async function handleGenerate() {
		if (!canGenerate) {
			return;
		}

		setError(null);
		setGeneratedImageUrl(null);
		setIsGenerating(true);
		setProgress(15);
		setTaskStatusLabel("Creating task...");
		startTimeRef.current = Date.now();

		try {
			const response = await fetch("/api/ai/image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt,
					model,
					size,
					imageData: mode === "image" ? sourceImage : undefined,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				setError(result.message ?? "Failed to create image task.");
				resetTaskState();
				return;
			}

			setProgress(25);
			await startPolling(result.taskId);
		} catch {
			setError("Failed to create image task.");
			resetTaskState();
		}
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setSourceImage(typeof reader.result === "string" ? reader.result : null);
			setSourceImageName(file.name);
		};
		reader.readAsDataURL(file);
	}

	async function handleDownload() {
		if (!generatedImageUrl) {
			return;
		}

		try {
			const response = await fetch(generatedImageUrl, { mode: "cors" });

			if (!response.ok) {
				throw new Error("Unable to fetch generated image.");
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `generated-image-${Date.now()}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
		} catch {
			window.open(generatedImageUrl, "_blank", "noopener,noreferrer");
		}
	}

	function handlePromptKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
			void handleGenerate();
		}
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="border-white/50 bg-background/75 dark:border-white/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ImageIcon className="size-5" />
						Image prompt
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Tabs
						onValueChange={(value) => setMode(value as "text" | "image")}
						value={mode}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="text">Text to image</TabsTrigger>
							<TabsTrigger value="image">Image to image</TabsTrigger>
						</TabsList>
						<TabsContent className="space-y-2" value="text">
							<Label htmlFor="image-prompt">Prompt</Label>
							<Textarea
								className="min-h-[220px] resize-none"
								id="image-prompt"
								onChange={(event) => setPrompt(event.target.value)}
								onKeyDown={handlePromptKeyDown}
								placeholder="Describe the image you want to generate..."
								value={prompt}
							/>
							<p className="text-muted-foreground text-xs">
								Use Ctrl+Enter to submit quickly.
							</p>
						</TabsContent>
						<TabsContent className="space-y-4" value="image">
							<div className="space-y-2">
								<Label htmlFor="source-image">Source image</Label>
								<input
									accept="image/*"
									className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium"
									id="source-image"
									onChange={handleImageChange}
									type="file"
								/>
							</div>
							{sourceImage ? (
								<div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-3 py-2">
									<div className="flex items-center gap-3">
										<img
											alt="Source preview"
											className="size-12 rounded-lg object-cover"
											src={sourceImage}
										/>
										<div>
											<p className="font-medium text-sm">Selected image</p>
											<p className="text-muted-foreground text-xs">
												{sourceImageName}
											</p>
										</div>
									</div>
									<Button
										onClick={() => {
											setSourceImage(null);
											setSourceImageName(null);
										}}
										size="icon-xs"
										variant="ghost"
									>
										<XIcon className="size-3.5" />
									</Button>
								</div>
							) : null}
							<div className="space-y-2">
								<Label htmlFor="image-transform-prompt">
									Transformation prompt
								</Label>
								<Textarea
									className="min-h-[150px] resize-none"
									id="image-transform-prompt"
									onChange={(event) => setPrompt(event.target.value)}
									onKeyDown={handlePromptKeyDown}
									placeholder="Describe how the uploaded image should change..."
									value={prompt}
								/>
							</div>
						</TabsContent>
					</Tabs>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="image-model">Model</Label>
							<Select onValueChange={setModel} value={model}>
								<SelectTrigger id="image-model">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{models.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="image-size">Aspect</Label>
							<Select onValueChange={setSize} value={size}>
								<SelectTrigger id="image-size">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{sizes.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
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
						{isGenerating ? "Generating..." : "Generate image"}
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
						<ImageIcon className="size-5" />
						Result
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border bg-muted/40">
						{generatedImageUrl ? (
							<img
								alt={generatedArtworkAlt}
								className="size-full object-contain"
								src={generatedImageUrl}
							/>
						) : isGenerating ? (
							<div className="flex flex-col items-center gap-3 text-muted-foreground">
								<Loader2Icon className="size-8 animate-spin" />
								<span className="text-sm">Generating your image...</span>
							</div>
						) : (
							<div className="flex flex-col items-center gap-3 text-muted-foreground">
								<ImageIcon className="size-10" />
								<span className="text-sm">
									Your generated image will appear here.
								</span>
							</div>
						)}
					</div>
					{generatedImageUrl ? (
						<Button
							className="w-full"
							onClick={() => void handleDownload()}
							variant="outline"
						>
							<DownloadIcon className="mr-2 size-4" />
							Download image
						</Button>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
