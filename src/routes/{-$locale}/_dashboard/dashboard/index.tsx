import { createFileRoute } from "@tanstack/react-router";
import { ChartAreaInteractive } from "#/components/dashboard/ChartAreaInteractive";
import { DataTable } from "#/components/dashboard/DataTable";
import { SectionCards } from "#/components/dashboard/SectionCards";

export const Route = createFileRoute("/{-$locale}/_dashboard/dashboard/")({
	component: DashboardHome,
});

function DashboardHome() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<SectionCards />
			<div className="grid grid-cols-1 gap-4">
				<ChartAreaInteractive />
				<DataTable />
			</div>
		</div>
	);
}
