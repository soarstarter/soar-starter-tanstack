import type { ReactNode } from "react";

type AIPageShellProps = {
	kicker: string;
	title: string;
	description: string;
	children: ReactNode;
};

export function AIPageShell({
	children,
	description,
	kicker,
	title,
}: AIPageShellProps) {
	return (
		<section className="page-wrap py-14 sm:py-18">
			<div className="rise-in rounded-[2rem] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.62))] px-6 py-10 shadow-[0_24px_60px_rgba(23,58,64,0.08)] backdrop-blur md:px-10 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,27,31,0.92),rgba(15,27,31,0.72))]">
				<div className="mx-auto max-w-3xl text-center">
					<div className="island-kicker mb-4">{kicker}</div>
					<h1 className="display-title text-4xl font-bold sm:text-5xl">
						{title}
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
						{description}
					</p>
				</div>
			</div>
			<div className="mt-8">{children}</div>
		</section>
	);
}
