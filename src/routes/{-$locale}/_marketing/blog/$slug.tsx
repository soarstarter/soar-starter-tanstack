import { createFileRoute, notFound } from "@tanstack/react-router";
import { createClientLoader } from "fumadocs-mdx/runtime/browser";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BlogToc } from "#/components/blog/BlogToc";
import { Badge } from "#/components/ui/badge";
import { LocaleLink, useCurrentLocale } from "#/i18n/routing";
import { blogEntries, formatBlogDate, getBlogPostBySlug } from "#/lib/blog";
import { buildSeoMeta } from "#/lib/seo";

const blogContentLoader = createClientLoader(blogEntries, {
	component: (loaded) => {
		const MDX = loaded.default;

		return <MDX components={defaultMdxComponents} />;
	},
});

export const Route = createFileRoute("/{-$locale}/_marketing/blog/$slug")({
	loader: async ({ params }) => {
		const post = await getBlogPostBySlug(params.slug);

		if (!post) {
			throw notFound();
		}

		return post;
	},
	head: ({ loaderData }) => ({
		...buildSeoMeta({
			title: loaderData.title,
			description: loaderData.description,
			path: `/blog/${loaderData.slug}`,
			image: loaderData.image,
			type: "article",
			publishedTime: loaderData.date,
			modifiedTime: loaderData.date,
			tags: loaderData.tags,
		}),
	}),
	component: BlogPostPage,
});

function BlogPostPage() {
	const { t } = useTranslation();
	const locale = useCurrentLocale();
	const post = Route.useLoaderData();

	return (
		<section className="page-wrap py-12 sm:py-16">
			<div className="mb-8">
				<LocaleLink
					href="/blog"
					className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold no-underline hover:bg-white/90 dark:hover:bg-white/10"
				>
					<ArrowLeft className="size-4" />
					{t("blog.backToList")}
				</LocaleLink>
			</div>

			<div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
				<article className="min-w-0">
					<header className="island-shell rounded-[2rem] border border-white/45 px-6 py-8 sm:px-8 dark:border-white/10">
						<div className="island-kicker mb-4">Editorial</div>
						<h1 className="display-title text-4xl leading-tight font-bold sm:text-5xl">
							{post.title}
						</h1>
						{post.description ? (
							<p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
								{post.description}
							</p>
						) : null}
						<div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-2">
								<CalendarDays className="size-4" />
								{formatBlogDate(post.date, locale)}
							</span>
							{post.author ? (
								<span className="inline-flex items-center gap-2">
									<UserRound className="size-4" />
									{post.author}
								</span>
							) : null}
						</div>
						{post.tags.length > 0 ? (
							<div className="mt-6 flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<LocaleLink
										key={tag}
										href={`/blog?tag=${encodeURIComponent(tag)}`}
										className="no-underline"
									>
										<Badge
											variant="secondary"
											className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1"
										>
											{tag}
										</Badge>
									</LocaleLink>
								))}
							</div>
						) : null}
					</header>

					<div className="mt-8 rounded-[2rem] border border-white/45 bg-white/78 px-6 py-8 shadow-[0_24px_60px_rgba(23,58,64,0.08)] dark:border-white/10 dark:bg-[rgba(15,27,31,0.88)] sm:px-8">
						<div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-[var(--lagoon-deep)] prose-pre:border prose-pre:border-[var(--line)] prose-pre:bg-[#1d2e45] prose-img:rounded-xl dark:prose-invert">
							{blogContentLoader.useContent(post.path)}
						</div>
					</div>
				</article>

				<aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
					<div className="island-shell rounded-[1.5rem] border border-white/45 px-5 py-5 dark:border-white/10">
						<p className="text-xs font-semibold tracking-[0.14em] text-[var(--kicker)] uppercase">
							{t("blog.publishedAt")}
						</p>
						<p className="mt-2 text-base font-semibold">
							{formatBlogDate(post.date, locale)}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{post.author ?? t("blog.unknownAuthor")}
						</p>
					</div>

					{post.toc.length > 0 ? (
						<div className="island-shell rounded-[1.5rem] border border-white/45 px-5 py-5 dark:border-white/10">
							<p className="mb-4 text-xs font-semibold tracking-[0.14em] text-[var(--kicker)] uppercase">
								{t("blog.tableOfContents")}
							</p>
							<BlogToc items={post.toc} />
						</div>
					) : null}
				</aside>
			</div>
		</section>
	);
}
