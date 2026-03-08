import { useLocation } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
	const { pathname } = useLocation();

	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbs = segments.map((seg, idx) => {
		const href = `/${segments.slice(0, idx + 1).join("/")}`;
		const label = seg
			.replace(/[-_]/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());
		return { label, href };
	});

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => (
					<Fragment key={crumb.href}>
						<BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
							{index < breadcrumbs.length - 1 ? (
								<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 ? (
							<BreadcrumbSeparator
								className={index === 0 ? "hidden md:block" : ""}
							/>
						) : null}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
