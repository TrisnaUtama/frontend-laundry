import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EdituserForm from "@/features/pages/admin/users/update";

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
							<BreadcrumbLink href="/dashboard/admin/people-management/user/">
								Management Staff
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className="font-semibold text-[#2C71F6]">
								Update User Data
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="p-4">
					<h1 className="font-bold text-2xl mt-4">Update User Data</h1>
					<p className="text-justify text-sm font-medium">
						On this page, you can edit the details of an existing user member in
						the system. Update fields such as name, role, contact information,
						or other necessary details to ensure the user member's information
						remains accurate and up-to-date. Ensure all changes are correctly
						filled out to maintain proper access and permissions within the
						system.
					</p>
				</div>
			</div>
			<EdituserForm id={id} />
		</main>
	);
}
