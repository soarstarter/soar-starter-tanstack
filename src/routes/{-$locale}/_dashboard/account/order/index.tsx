import { createFileRoute } from "@tanstack/react-router";
import { ListOrdered } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/{-$locale}/_dashboard/account/order/")({
	component: OrderPage,
});

function OrderPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
					<CardDescription>View your order history.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<ListOrdered className="text-muted-foreground mb-4 size-12" />
						<h3 className="text-lg font-medium">No orders yet</h3>
						<p className="text-muted-foreground mt-1 text-sm">
							Your order history will appear here once you make a purchase.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
