"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const NEXT_THEME: Record<ThemeMode, ThemeMode> = {
	system: "light",
	light: "dark",
	dark: "system",
};

function getThemeMode(value: string | undefined): ThemeMode {
	if (value === "light" || value === "dark" || value === "system") {
		return value;
	}

	return "system";
}

export function ThemeToggle() {
	const { resolvedTheme, setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const currentTheme = getThemeMode(theme);
	const nextTheme = NEXT_THEME[currentTheme];
	const label = mounted
		? `Theme mode: ${currentTheme}${
				currentTheme === "system" && resolvedTheme
					? ` (${resolvedTheme} active)`
					: ""
			}. Click to switch to ${nextTheme}.`
		: "Toggle theme mode";

	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			className="relative ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:bg-accent hover:text-accent-foreground"
			onClick={() => {
				if (!mounted) {
					return;
				}

				setTheme(nextTheme);
			}}
		>
			{mounted ? (
				currentTheme === "light" ? (
					<Sun className="h-4 w-4" />
				) : currentTheme === "dark" ? (
					<Moon className="h-4 w-4" />
				) : (
					<Monitor className="h-4 w-4" />
				)
			) : (
				<Monitor className="h-4 w-4" />
			)}
			<span className="sr-only">Toggle theme mode</span>
		</button>
	);
}

export default ThemeToggle;
