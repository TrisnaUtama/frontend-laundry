import React from "react";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import OrdersPage from "@/features/user/order/order.page";

export default function page() {
	return (
		<main className="mx-[12%] my-[2%]">
			<div className="p-2 rounded-md bg-white">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard/user/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold text-[#2C71F6]">
								Your Orders
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="p-3 rounded-md bg-white mt-2">
				<h1 className="font-bold text-2xl">Orders</h1>
				<p className="text-justify text-sm font-medium">
					On this page, you can see your orders to the system by filling out the
					required details such as name, role, contact information, and other
					necessary information. Ensure that all fields are correctly filled out
					to grant the staff member access to the system with the appropriate
					permissions.
				</p>
			</div>

			<OrdersPage />
		</main>
	);
}
