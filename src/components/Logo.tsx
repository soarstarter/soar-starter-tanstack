import type * as React from "react";

import { cn } from "#/lib/utils";

export function Logo({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"relative inline-flex size-9 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-[linear-gradient(135deg,var(--lagoon)_0%,var(--lagoon-deep)_45%,var(--palm)_100%)] text-sm font-black tracking-[-0.08em] text-white shadow-[0_12px_24px_rgba(50,143,151,0.28)]",
				className,
			)}
			aria-hidden="true"
			{...props}
		>
			<span className="absolute inset-[3px] rounded-[0.85rem] border border-white/18" />
			<span className="relative">SS</span>
		</div>
	);
}
