"use client";

import { cn } from "#/lib/utils";

interface AuroraBackgroundProps {
	radialGradient?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export function AuroraBackground({
	radialGradient = true,
	className,
	children,
}: AuroraBackgroundProps) {
	return (
		<main className={cn("relative overflow-hidden", className)}>
			<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
				<div
					className="absolute inset-0 overflow-hidden"
					style={
						{
							"--white": "rgba(255,255,255,0.85)",
							"--black": "#081216",
							"--transparent": "transparent",
							"--lagoon-1": "var(--lagoon)",
							"--lagoon-2": "var(--lagoon-deep)",
							"--lagoon-3": "#9ce7d7",
							"--palm-1": "var(--palm)",
						} as React.CSSProperties
					}
				>
					<div
						className={cn(
							"pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] will-change-transform [background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] [filter:saturate(1.15)] after:absolute after:inset-0 after:animate-[aurora_60s_linear_infinite] after:[background-attachment:fixed] after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:mix-blend-screen after:content-[''] dark:opacity-70 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:mix-blend-lighten [--aurora:repeating-linear-gradient(115deg,var(--lagoon-1)_10%,var(--lagoon-2)_18%,var(--lagoon-3)_24%,var(--palm-1)_31%,var(--lagoon-1)_38%)] [--dark-gradient:repeating-linear-gradient(115deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_14%,var(--black)_18%)] [--white-gradient:repeating-linear-gradient(115deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_14%,var(--white)_18%)]",
							radialGradient &&
								"[mask-image:radial-gradient(ellipse_at_100%_0%,black_12%,transparent_72%)]",
						)}
					/>
				</div>
				<div className="relative z-10 w-full">{children}</div>
			</div>
		</main>
	);
}
