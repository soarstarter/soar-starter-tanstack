import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_marketing/pay-success")({
	component: PaySuccessPage,
	validateSearch: (search: Record<string, unknown>) => ({
		orderId: (search.orderId as string) || "",
	}),
});

function PaySuccessPage() {
	const { orderId } = Route.useSearch();
	const { t } = useTranslation();

	return (
		<section className="py-16 md:py-24">
			<div className="mx-auto max-w-md px-4 text-center">
				<CheckCircle className="mx-auto mb-6 size-16 text-green-500" />
				<h1 className="mb-4 text-3xl font-bold">
					{t("payment.success.title")}
				</h1>
				<p className="mb-6 text-muted-foreground">
					{t("payment.success.description")}
				</p>
				{orderId && (
					<p className="mb-8 text-sm text-muted-foreground">
						{t("payment.success.orderLabel")}: {orderId}
					</p>
				)}
				<div className="flex flex-wrap justify-center gap-4">
					<Button asChild>
						<Link to="/dashboard">{t("payment.success.viewOrders")}</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/">{t("payment.success.backHome")}</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
