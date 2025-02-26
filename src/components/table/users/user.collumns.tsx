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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { deleteUser, type User } from "@/services/user/user.services";

export const columns: ColumnDef<User>[] = [
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
		header: "User ID",
		cell: ({ row }) => {
			const staff = row.original;
			return <div className="capitalize">{staff.user_id}</div>;
		},
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const staff = row.original;
			return <div className="capitalize">{staff.name}</div>;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const staff = row.original;
			return <div className="lowercase">{staff.email}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const staff = row.original;
			return (
				<div className="capitalize">{staff.status ? "Active" : "Unactive"}</div>
			);
		},
	},
	{
		accessorKey: "verified",
		header: "Verified",
		cell: ({ row }) => {
			const staff = row.original;
			return (
				<div className="capitalize">
					{staff.is_verified ? "Verified" : "Not Verified"}
				</div>
			);
		},
	},
	{
		accessorKey: "online",
		header: "Browse",
		cell: ({ row }) => {
			const staff = row.original;
			return (
				<div className="capitalize">
					{staff.isOnline ? "Online" : "Offline"}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const [isOpen, setIsOpen] = useState<boolean>(false);
			const user = row.original;
			const { toast } = useToast();

			const handleDelete = async (id: string) => {
				const result = await deleteUser(id);
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
								className="hover:bg-slate-100"
								onClick={() =>
									navigator.clipboard.writeText(user.user_id as string)
								}
							>
								Copy user ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Link
								href={`/dashboard/admin/people-management/user/update/${user.user_id}`}
								className="flex justify-center items-center text-sm p-1.5 hover:bg-slate-100 rounded-md"
							>
								Update User
							</Link>
							<div className="flex justify-center items-center">
								<Button
									disabled={!user.status}
									onClick={() => setIsOpen(true)}
									className=" text-sm font-normal p-1.5 bg-transparent shadow-transparent border-transparent text-black hover:bg-slate-100 rounded-md"
								>
									Unactive User
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
									This action will Delete the User Account
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleDelete(user.user_id as string)}
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
