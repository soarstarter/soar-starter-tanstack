import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ThemeProvider } from "#/components/theme-provider";
import { Toaster } from "#/components/ui/sonner";
import { buildSeoMeta } from "#/lib/seo";
import "#/i18n";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var theme=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=theme==='system'?(prefersDark?'dark':'light'):theme;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;root.setAttribute('data-theme',theme);}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => {
		const seo = buildSeoMeta();

		return {
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				...seo.meta,
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
				...seo.links,
			],
		};
	},
	errorComponent: RootErrorBoundary,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<ThemeProvider>
					<RootProvider>
						{children}
						<Toaster closeButton richColors />
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
						<Scripts />
					</RootProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

function RootErrorBoundary({ error }: { error: unknown }) {
	const message =
		error instanceof Error ? error.message : "An unexpected error occurred.";

	return (
		<div className="page-wrap flex min-h-[50vh] items-center justify-center py-16">
			<div className="island-shell max-w-xl rounded-[1.75rem] border border-white/45 px-6 py-8 text-center dark:border-white/10">
				<p className="island-kicker mb-3">Application Error</p>
				<h1 className="display-title text-3xl font-bold">Something went wrong</h1>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					{message}
				</p>
			</div>
		</div>
	);
}
