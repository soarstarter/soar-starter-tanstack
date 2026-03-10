"use client";

import React, { memo } from "react";

interface AuroraTextProps {
	children: React.ReactNode;
	className?: string;
	colors?: string[];
	speed?: number;
}

export const AuroraText = memo(
	({
		children,
		className = "",
		colors = ["var(--lagoon)", "var(--lagoon-deep)", "var(--palm)", "#9ce7d7"],
		speed = 1,
	}: AuroraTextProps) => {
		const gradientStyle = {
			backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
				colors[0]
			})`,
			WebkitBackgroundClip: "text",
			WebkitTextFillColor: "transparent",
			animationDuration: `${10 / speed}s`,
		};

		return (
			<span className={`relative inline-block ${className}`}>
				<span className="sr-only">{children}</span>
				<span
					className="relative inline-block animate-[aurora_10s_linear_infinite] bg-[length:200%_auto] bg-clip-text text-transparent"
					style={gradientStyle}
					aria-hidden="true"
				>
					{children}
				</span>
			</span>
		);
	},
);

AuroraText.displayName = "AuroraText";
