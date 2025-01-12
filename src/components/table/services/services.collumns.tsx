import { Checkbox } from "@radix-ui/react-checkbox";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogHeader,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { unactiveService } from "@/services/services/services.services";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Service } from "@/services/services/services.services";
import { useItemTypes } from "@/hooks/use-item-type";

export const ServiceColumns = () => {
	const type = useItemTypes();
	const columns: ColumnDef<Service>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => {
				return (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				);
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "id",
			header: "Service ID",
			cell: ({ row }) => {
				const service = row.original;
				return <div className="capitalize text-left">{service.service_id}</div>;
			},
		},
		{
			accessorKey: "name",
			header: "Service Name",
			cell: ({ row }) => {
				const service = row.original;
				return <div className="capitalize text-left">{service.name}</div>;
			},
		},
		{
			accessorKey: "type",
			header: ({ column }) => {
				return (
					<Button
						className="flex justify-center items-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Service Type
						<ArrowUpDown className="h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const service = row.original;
				return (
					<div className=" text-left ms-5">
						{type.map(
							(val) => service.item_type_id === val.item_type_id && val.name,
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "estimated",
			header: "Estimated Hours",
			cell: ({ row }) => {
				const service = row.original;
				return (
					<div className="capitalize text-left">{service.estimated_hours}</div>
				);
			},
		},
		{
			accessorKey: "price",
			header: "Service Price",
			cell: ({ row }) => {
				const service = row.original;
				return (
					<div className="capitalize text-left">{`Rp.${service.price}`}</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Service Status",
			cell: ({ row }) => {
				const service = row.original;
				return (
					<div className="capitalize text-left">
						{service.status ? "Active" : "Unactive"}
					</div>
				);
			},
		},

		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const [isOpen, setIsOpen] = useState<boolean>(false);
				const service = row.original;
				const { toast } = useToast();

				const handleDelete = async (id: string) => {
					const result = await unactiveService(id);
					if (result.status) {
						toast({
							variant: "success",
							title: "Success",
							description: result.message,
						});
					} else {
						toast({
							variant: "destructive",
							title: "Failed",
							description: result.message,
						});
					}
				};

				return (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="p-3 bg-white rounded-md border z-0"
							>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem
									className="hover:bg-slate-100 text-center"
									onClick={() =>
										navigator.clipboard.writeText(service.service_id as string)
									}
								>
									Copy Service ID
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<Link
									href={`/dashboard/admin/bussines/services/update/${service.service_id}`}
									className="flex justify-center items-center text-sm p-1.5 hover:bg-slate-100 rounded-md"
								>
									Update Service
								</Link>
								<div className="flex justify-center items-center">
									<Button
										disabled={!service.status}
										onClick={() => setIsOpen(true)}
										className=" text-sm font-normal p-1.5 bg-transparent shadow-transparent border-transparent text-black hover:bg-slate-100 rounded-md"
									>
										Unactive Service
									</Button>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="font-bold">
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription className="font-semibold">
										This action will Delete the Service
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => handleDelete(service.service_id as string)}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				);
			},
		},
	];
	return columns;
};
