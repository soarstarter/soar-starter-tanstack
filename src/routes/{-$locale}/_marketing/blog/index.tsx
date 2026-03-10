import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BlogCard } from "#/components/blog/BlogCard";
import { BlogFilter } from "#/components/blog/BlogFilter";
import { BlogPagination } from "#/components/blog/BlogPagination";
import { Badge } from "#/components/ui/badge";
import { websiteConfig } from "#/config/website-config";
import { getBlogPageData } from "#/lib/blog";

function parsePageParam(value: unknown) {
	const page = Number(value);

	return Number.isInteger(page) && page > 0 ? page : 1;
}

export const Route = createFileRoute("/{-$locale}/_marketing/blog/")({
	head: () => ({
		meta: [
			{
				title: `Blog | ${websiteConfig.name}`,
			},
			{
				name: "description",
				content: "Latest articles and tutorials from the Soar Starter team.",
			},
		],
	}),
	validateSearch: (search: Record<string, unknown>) => ({
		tag:
			typeof search.tag === "string" && search.tag.length > 0
				? search.tag
				: undefined,
		page: parsePageParam(search.page),
	}),
	loaderDeps: ({ search }) => ({
		tag: search.tag,
		page: search.page,
	}),
	loader: async ({ deps }) => getBlogPageData(deps),
	component: BlogIndexPage,
});

function BlogIndexPage() {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const { posts, currentPage, totalPages, selectedTag, allTags, totalPosts } =
		Route.useLoaderData();

	return (
		<section className="page-wrap py-14 sm:py-18">
			<div className="rise-in rounded-[2rem] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.62))] px-6 py-10 shadow-[0_24px_60px_rgba(23,58,64,0.08)] backdrop-blur md:px-10 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,27,31,0.92),rgba(15,27,31,0.72))]">
				<div className="mx-auto max-w-3xl text-center">
					<div className="island-kicker mb-4">Knowledge Base</div>
					<h1 className="display-title text-4xl leading-tight font-bold sm:text-5xl">
						{t("blog.title")}
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
						{t("blog.description")}
					</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<Badge
							variant="secondary"
							className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-1.5"
						>
							{totalPosts} articles
						</Badge>
						{selectedTag ? (
							<Badge
								variant="secondary"
								className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-1.5"
							>
								Tag: {selectedTag}
							</Badge>
						) : null}
					</div>
				</div>
			</div>

			{allTags.length > 0 ? (
				<div className="mt-8">
					<BlogFilter
						tags={allTags}
						selectedTag={selectedTag}
						pathname={pathname}
						allLabel={t("blog.all")}
					/>
				</div>
			) : null}

			{posts.length > 0 ? (
				<>
					<div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{posts.map((post) => (
							<BlogCard key={post.slug} {...post} />
						))}
					</div>
					<div className="mt-10 flex justify-center">
						<BlogPagination
							currentPage={currentPage}
							totalPages={totalPages}
							pathname={pathname}
							selectedTag={selectedTag}
						/>
					</div>
				</>
			) : (
				<div className="mt-12 rounded-[1.75rem] border border-dashed border-[var(--chip-line)] bg-white/55 px-6 py-16 text-center dark:bg-white/4">
					<p className="text-sm font-semibold tracking-[0.14em] text-[var(--kicker)] uppercase">
						{t("blog.noPosts")}
					</p>
					<h2 className="mt-3 text-2xl font-semibold">
						{selectedTag
							? t("blog.noPostsCategory", { category: selectedTag })
							: t("blog.noPostsAll")}
					</h2>
				</div>
			)}
		</section>
	);
}
