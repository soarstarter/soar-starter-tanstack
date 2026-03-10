import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsCommonConfig } from "#/config/docs-common-config";
import { getDocsSidebarLinks } from "#/config/docs-sidebar-config";
import { defaultLocale, type Locale } from "#/i18n";
import { LocaleLink, useCurrentLocale, useLocalePath } from "#/i18n/routing";

const getDocsTree = createServerFn({ method: "GET" })
	.inputValidator((input: { locale?: Locale } | undefined) => ({
		locale: input?.locale ?? defaultLocale,
	}))
	.handler(async ({ data }) => {
		const { getDocsPageTree } = await import("#/lib/source");

		return getDocsPageTree(data.locale);
	});

export const Route = createFileRoute("/{-$locale}/_docs")({
	loader: ({ params }) =>
		getDocsTree({
			data: {
				locale: (params.locale as Locale | undefined) ?? defaultLocale,
			},
		}),
	component: DocsLayoutRoute,
});

function DocsLayoutRoute() {
	const tree = Route.useLoaderData();
	const localePath = useLocalePath();

	return (
		<DocsLayout
			tree={tree}
			githubUrl={docsCommonConfig.githubUrl}
			nav={{
				title: docsCommonConfig.title,
				url: localePath(docsCommonConfig.homeHref),
			}}
			sidebar={{
				defaultOpenLevel: docsCommonConfig.sidebar.defaultOpenLevel,
				footer: <DocsSidebarFooter />,
			}}
		>
			<Outlet />
		</DocsLayout>
	);
}

function DocsSidebarFooter() {
	const locale = useCurrentLocale();
	const featuredItems = getDocsSidebarLinks()
		.flatMap((section) => section.items ?? [])
		.slice(0, 4);

	return (
		<div className="border-t px-4 py-4 text-sm">
			<p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
				Popular
			</p>
			<div className="mt-3 flex flex-col gap-2">
				{featuredItems.map((item) =>
					item.href ? (
						<LocaleLink
							key={`${locale}-${item.href}`}
							href={item.href}
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							{item.title}
						</LocaleLink>
					) : null,
				)}
			</div>
		</div>
	);
}
