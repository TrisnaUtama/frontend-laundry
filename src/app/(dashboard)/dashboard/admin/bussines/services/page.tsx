"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/services/table-services";
import { ServiceColumns } from "@/components/table/services/services.collumns";
import {
	getAllService,
	type Service,
} from "@/services/services/services.services";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function page() {
	const [services, setServices] = useState<Service[]>([]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const res = await getAllService();
				if (res.status) {
					setServices(res.data);
				} else {
					console.log(res.message);
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
				<DataTable data={services} columns={ServiceColumns()} />
			</div>
		</main>
	);
}
