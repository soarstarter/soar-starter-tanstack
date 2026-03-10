"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { cn } from "#/lib/utils";

interface AnimatedListProps {
	className?: string;
	delay?: number;
	children: React.ReactNode;
}

export function AnimatedList({
	className,
	delay = 1000,
	children,
}: AnimatedListProps) {
	const [displayedItems, setDisplayedItems] = useState<
		{ node: React.ReactNode; id: string }[]
	>([]);

	useEffect(() => {
		const items = React.Children.toArray(children);

		if (items.length === 0) {
			setDisplayedItems([]);
			return;
		}

		let index = 0;
		const interval = window.setInterval(() => {
			setDisplayedItems((previous) => {
				const next = [...previous];
				if (next.length >= items.length) {
					next.shift();
				}
				next.push({
					node: items[index],
					id: `${index}-${Date.now()}`,
				});
				index = (index + 1) % items.length;
				return next;
			});
		}, delay);

		return () => {
			window.clearInterval(interval);
		};
	}, [children, delay]);

	return (
		<div className={cn("flex flex-col items-center gap-4", className)}>
			<div className="flex flex-col-reverse items-center gap-3">
				<AnimatePresence>
					{displayedItems.map((item) => (
						<motion.div
							key={item.id}
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0, opacity: 0, y: 0 }}
							transition={{
								type: "spring",
								stiffness: 350,
								damping: 40,
							}}
							className="mx-auto w-full"
							layout
						>
							{item.node}
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
