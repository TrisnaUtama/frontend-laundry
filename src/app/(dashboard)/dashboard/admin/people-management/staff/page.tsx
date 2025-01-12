"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/staffs/table-staff";
import { columns } from "@/components/table/staffs/staff.collumns";
import { getAllStaff, type Staff } from "@/services/staff/staff.services";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function page() {
	const [staff, setStaff] = useState<Staff[]>([]);

	useEffect(() => {
		const fetchStaff = async () => {
			try {
				const res = await getAllStaff();
				if (res.status) {
					setStaff(res.data);
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
		fetchStaff();
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
								Management Staff
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="mt-2 p-2 rounded-md bg-white">
				<DataTable data={staff} columns={columns} />
			</div>
		</main>
	);
}
