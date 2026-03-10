import { createFileRoute, notFound } from "@tanstack/react-router";
import { createClientLoader } from "fumadocs-mdx/runtime/browser";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { BlogToc } from "#/components/blog/BlogToc";
import { LocaleLink, useCurrentLocale } from "#/i18n/routing";
import { formatLegalDate, getLegalPageBySlug, legalEntries } from "#/lib/legal";
import { buildSeoMeta } from "#/lib/seo";

const legalContentLoader = createClientLoader(legalEntries, {
	component: (loaded) => {
		const MDX = loaded.default;

		return <MDX components={defaultMdxComponents} />;
	},
	id: "legal",
});

export const Route = createFileRoute("/{-$locale}/_marketing/legal/$slug")({
	loader: async ({ params }) => {
		const page = await getLegalPageBySlug(params.slug);

		if (!page) {
			throw notFound();
		}

		return page;
	},
	head: ({ loaderData }) =>
		buildSeoMeta(
			loaderData
				? {
						title: loaderData.title,
						description: loaderData.description,
						path: `/legal/${loaderData.slug}`,
						type: "article",
						modifiedTime: loaderData.date,
					}
				: {
						title: "Legal",
						path: "/legal",
					},
		),
	component: LegalPage,
});

function LegalPage() {
	const locale = useCurrentLocale();
	const page = Route.useLoaderData();

	return (
		<section className="page-wrap py-12 sm:py-16">
			<div className="mb-8">
				<LocaleLink
					href="/"
					className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold no-underline hover:bg-white/90 dark:hover:bg-white/10"
				>
					<ArrowLeft className="size-4" />
					Back to home
				</LocaleLink>
			</div>

			<div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
				<article className="min-w-0">
					<header className="island-shell rounded-[2rem] border border-white/45 px-6 py-8 sm:px-8 dark:border-white/10">
						<div className="island-kicker mb-4">Legal</div>
						<h1 className="display-title text-4xl leading-tight font-bold sm:text-5xl">
							{page.title}
						</h1>
						{page.description ? (
							<p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
								{page.description}
							</p>
						) : null}
						<div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-2">
								<CalendarDays className="size-4" />
								Last updated {formatLegalDate(page.date, locale)}
							</span>
						</div>
					</header>

					<div className="mt-8 rounded-[2rem] border border-white/45 bg-white/78 px-6 py-8 shadow-[0_24px_60px_rgba(23,58,64,0.08)] dark:border-white/10 dark:bg-[rgba(15,27,31,0.88)] sm:px-8">
						<div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-[var(--lagoon-deep)] prose-pre:border prose-pre:border-[var(--line)] prose-pre:bg-[#1d2e45] prose-img:rounded-xl dark:prose-invert">
							{legalContentLoader.useContent(page.path)}
						</div>
					</div>
				</article>

				<aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
					<div className="island-shell rounded-[1.5rem] border border-white/45 px-5 py-5 dark:border-white/10">
						<p className="text-xs font-semibold tracking-[0.14em] text-[var(--kicker)] uppercase">
							Last updated
						</p>
						<p className="mt-2 text-base font-semibold">
							{formatLegalDate(page.date, locale)}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							These terms apply to use of this site and service.
						</p>
					</div>

					{page.toc.length > 0 ? (
						<div className="island-shell rounded-[1.5rem] border border-white/45 px-5 py-5 dark:border-white/10">
							<p className="mb-4 text-xs font-semibold tracking-[0.14em] text-[var(--kicker)] uppercase">
								On this page
							</p>
							<BlogToc items={page.toc} />
						</div>
					) : null}
				</aside>
			</div>
		</section>
	);
}
