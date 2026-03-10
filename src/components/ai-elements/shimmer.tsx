import type { ComponentProps } from "react";

import { cn } from "#/lib/utils";

type ShimmerProps = ComponentProps<"span"> & {
	duration?: number;
};

export function Shimmer({
	className,
	children,
	duration = 1,
	style,
	...props
}: ShimmerProps) {
	return (
		<span
			className={cn("inline-flex animate-pulse", className)}
			style={{
				animationDuration: `${duration}s`,
				...style,
			}}
			{...props}
		>
			{children}
		</span>
	);
}
