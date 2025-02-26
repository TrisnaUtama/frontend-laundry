"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import UpdateServicesForm from "@/features/admin/services/update.page";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function page({ params }: PageProps) {
	const { id } = await params;
	return (
		<main className="my-[7%] mx-[1%]">
			<div className="p-2 rounded-md bg-white border-opacity-75">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard/admin/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard/admin/bussines/services">
								Bussines Services
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold text-[#2C71F6]">
								Update Services
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="p-4">
					<h1 className="font-bold text-2xl mt-4">Update Services</h1>
					<p className="text-justify text-sm font-medium">
						On this page, you can update service to the system by filling out
						the required details such as name, role, contact information, and
						other necessary information. Ensure that all fields are correctly
						filled out to grant the staff member access to the system with the
						appropriate permissions.
					</p>
				</div>
			</div>
			<UpdateServicesForm id={id} />
		</main>
	);
}
