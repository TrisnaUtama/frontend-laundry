"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/users/table-user";
import { columns } from "@/components/table/users/user.collumns";
import { getAllUser, type User } from "@/services/user/user.services";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function page() {
	const [user, setStaff] = useState<User[]>([]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getAllUser();
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
		fetchUser();
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
							<BreadcrumbLink href="/dashboard/admin/people-management/user">
								Management User
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold text-[#2C71F6]">
								Update User
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="mt-2 p-2 rounded-md bg-white">
				<DataTable data={user} columns={columns} />
			</div>
		</main>
	);
}
