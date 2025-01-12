"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/orders/table-orders";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getAllOrders, type Order } from "@/services/orders/order.services";
import { OrderColumns } from "@/components/table/orders/orders.collumns";

export default function page() {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const res = await getAllOrders();
				if (res.status) {
					setOrders(res.data);
				} else {
					setOrders(res.message);
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error.message);
				}
				console.log("cannot process your request !");
			}
		};
		fetchServices();
	}, []);

	return (
		<main className="my-[7%] mx-[1%]">
			<div className="p-2 rounded-md bg-white">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard/admin/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold text-[#2C71F6]">
								Services Bussiness
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="mt-2 p-2 rounded-md bg-white">
				<DataTable data={orders} columns={OrderColumns()} />
			</div>
		</main>
	);
}
