import { useActionState, useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, ShirtIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
	getAllItemType,
	type Item_Type,
} from "@/services/item_type/item_type.services";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CreateItemTypeForm from "../item-type/create.page";
import UpdateItemTypeForm from "../item-type/manage.page";
import { createNewServices } from "@/services/services/services.services";
import { Textarea } from "@/components/ui/textarea";

export default function CreateServicesForm() {
	const [state, action, pending] = useActionState(createNewServices, null);
	const [itemType, setItemType] = useState<Item_Type[]>([]);
	const [isOpen, setIsOpen] = useState<string | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const fetchItemType = async () => {
			const res = await getAllItemType();
			if (!res.status) {
				setItemType(res.message);
			} else {
				setItemType(res.data);
			}
		};
		fetchItemType();
	}, []);

	useEffect(() => {
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: state.message || "Successfully add new staff",
			});

			router.push("/dashboard/admin/bussines/services/create");
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "Failed to add new staff",
			});
		}
	}, [state, toast, router]);

	const renderErrorMessage = (field: string) => {
		if (state?.status === false && state?.errors) {
			const errors = state.errors as Record<string, string[]>;
			if (errors[field]) {
				return (
					<div className="text-red-500 text-sm">
						{errors[field].map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				);
			}
		}
		return null;
	};

	const handleItemClick = (itemId: string, type: string) => {
		setSelectedItemId(itemId);
		setIsOpen(type);
	};

	return (
		<>
			<CreateItemTypeForm
				isOpen={isOpen === "create"}
				setIsOpen={(open) => setIsOpen(open ? "create" : null)}
			/>

			<UpdateItemTypeForm
				isOpen={isOpen === "update"}
				setIsOpen={(open) => setIsOpen(open ? "update" : null)}
				id={selectedItemId as string}
			/>

			<div className="rounded-md w-full h-[90%] bg-white border-opacity-75 mt-2 p-4">
				<div className="flex justify-between">
					<h1 className="font-bold text-[1rem]">Item Type</h1>
					<Link
						href="#"
						onClick={() => setIsOpen("create")}
						className="flex justify-center items-center hover:text-blue-500 transition-colors duration-300 space-x-1"
					>
						<Plus className="w-4 h-4" />
						<p className="text-[1rem] font-semibold">Create Type</p>
					</Link>
				</div>
				<hr className="my-2" />
				<div className="flex items-center overflow-x-auto overflow-hidden">
					{itemType.map((val) => (
						<div key={val.item_type_id} className="flex items-center">
							<Link
								href="#"
								onClick={() => handleItemClick(val.item_type_id, "update")}
								className="group transition-colors duration-300 mx-2"
							>
								<Card className="w-[100px] h-[100px] flex justify-center items-center border-2 border-black group-hover:border-blue-500 transition-all duration-300">
									<CardHeader className="flex flex-col justify-center items-center">
										<ShirtIcon className="w-10 h-10 group-hover:text-blue-500 transition-colors duration-300" />
										<CardTitle className="group-hover:text-blue-500 transition-colors duration-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
											{val.name}
										</CardTitle>
									</CardHeader>
								</Card>
							</Link>
						</div>
					))}
				</div>
			</div>
			<div className="rounded-md w-full h-[90%] bg-white border-opacity-75 mt-2 p-4">
				<h1 className="font-bold text-[1rem]">Service</h1>
				<form action={action}>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label htmlFor="name" className="font-semibold">
								Name<span className="text-red-500">*</span>
							</Label>
							<Input
								name="name"
								placeholder="ex : Jeans, Clothes, Bed-Cover"
								className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
								type="text"
								defaultValue={state?.fieldValues?.name || ""}
							/>
							{renderErrorMessage("name")}
						</div>
						<div>
							<Label htmlFor="item_type_id" className="font-semibold">
								Item Type<span className="text-red-500">*</span>
							</Label>
							<Select name="item_type_id">
								<SelectTrigger>
									<SelectValue
										placeholder="select item type"
										className="font-normal text-gray-300"
									/>
								</SelectTrigger>
								<SelectContent
									defaultValue={state?.fieldValues?.item_type_id || ""}
								>
									{itemType.map((val, index) => (
										<SelectItem
											key={val.item_type_id}
											value={val.item_type_id}
											className="font-semibold"
										>
											{val.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{renderErrorMessage("item_type")}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 mt-5">
						<div>
							<Label htmlFor="estimated_hours">
								Estimated Hour<span className="text-red-500">*</span>
							</Label>
							<Input
								name="estimated_hours"
								placeholder="ex : 1, 2, 3"
								className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
								type="number"
								defaultValue={state?.fieldValues?.estimated_hours || ""}
							/>
							{renderErrorMessage("estimated_hour")}
						</div>
						<div>
							<Label htmlFor="price" className="font-semibold">
								Price / kg<span className="text-red-500">*</span>
							</Label>
							<Input
								name="price"
								placeholder="ex : 7000, 5000"
								className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
								type="text"
								defaultValue={state?.fieldValues?.price || ""}
							/>
							{renderErrorMessage("price")}
						</div>
					</div>
					<div className="grid mt-5 gap-1.5">
						<Label htmlFor="description" className="font-semibold">
							Description <span className="text-red-500">*</span>
						</Label>
						<Textarea
							placeholder="Type the description here."
							id="description"
							name="description"
							defaultValue={state?.fieldValues?.description || ""}
						/>
						{renderErrorMessage("description")}
					</div>
					<div className="flex justify-end items-center mt-5 ">
						<Button
							type="submit"
							disabled={pending}
							className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
						>
							{pending ? "Loading" : "Create Service"}
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}
