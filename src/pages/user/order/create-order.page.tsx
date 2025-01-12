"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	getAllUserAddress,
	type Address,
} from "@/services/address/address.services";
import {
	getAllItemType,
	type Item_Type,
} from "@/services/item_type/item_type.services";
import { createOrder } from "@/services/orders/order.services";
import {
	getAllService,
	type Service,
} from "@/services/services/services.services";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateOrder() {
	const [state, action, pending] = useActionState(createOrder, null);
	const [services, setServices] = useState<Service[]>([]);
	const [itemType, setItemType] = useState<Item_Type[]>([]);
	const [address, setAddress] = useState<Address[]>([]);
	const [selectedItemType, setSelectedItemtype] = useState<string>("");
	const { toast } = useToast();
	const router = useRouter();

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

	useEffect(() => {
		const fetch = async () => {
			const res_services = await getAllService();
			if (!res_services.status) {
				setServices(res_services.message);
			}
			setServices(res_services.data);
			const res_item = await getAllItemType();
			if (!res_item.status) {
				setItemType(res_item.message);
			}
			setItemType(res_item.data);
			const res_address = await getAllUserAddress();
			if (!res_address.status) {
				setAddress(res_address.message);
			}
			setAddress(res_address.data);
		};
		fetch();
	}, []);

	useEffect(() => {
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: state.message || "Successfully create new Order",
			});

			router.push("/dashboard/user/orders");
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "failed create new Order",
			});
		}
	}, [state, toast, router]);

	return (
		<div className="p-2">
			<form action={action}>
				<h1 className="font-semibold text-lg">Item Detail</h1>
				<div className="grid grid-cols-3 gap-2">
					<div>
						<Label htmlFor="name" className="font-semibold">
							Item Name<span className="text-red-500">*</span>
						</Label>
						<Input
							name="name"
							type="text"
							placeholder="ex: uniform, bedcover, pants"
							className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
						/>
					</div>
					<div>
						<Label htmlFor="weight" className="font-semibold">
							Weight Estimation<span className="text-red-500">*</span>
						</Label>
						<Input
							name="weight"
							type="number"
							placeholder="ex: 2, 3, 4"
							className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
						/>
					</div>
					<div>
						<Label htmlFor="address_id" className="font-semibold">
							Pick up Address<span className="text-red-500">*</span>
						</Label>
						<Select name="address_id">
							<SelectTrigger className="h-[63%]">
								<SelectValue
									placeholder="select address"
									className="font-normal text-gray-300"
								/>
							</SelectTrigger>
							<SelectContent>
								{address.map((val) => (
									<SelectItem
										key={val.user_address_id}
										value={val.user_address_id}
										className="font-semibold"
									>
										{val.address}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{renderErrorMessage("address_id")}
					</div>
				</div>
				<h1 className="font-semibold text-lg mt-5">Order Detail</h1>
				<div className="grid grid-cols-3 gap-2">
					<div>
						<Label htmlFor="item_id" className="font-semibold">
							Item type<span className="text-red-500">*</span>
						</Label>
						<Select
							name="item_id"
							onValueChange={(e) => setSelectedItemtype(e)}
						>
							<SelectTrigger className="h-[63%]">
								<SelectValue
									placeholder="select item type"
									className="font-normal text-gray-300"
								/>
							</SelectTrigger>
							<SelectContent>
								{itemType.map((val) => (
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
						{renderErrorMessage("item_id")}
					</div>
					<div>
						<Label htmlFor="service_id" className="font-semibold">
							Service<span className="text-red-500">*</span>
						</Label>
						<Select name="service_id" disabled={selectedItemType.length === 0}>
							<SelectTrigger className="h-[63%]">
								<SelectValue
									placeholder="select services"
									className="font-normal text-gray-300"
								/>
							</SelectTrigger>
							<SelectContent>
								{services
									.filter((val) => val.item_type_id === selectedItemType)
									.map((val) => (
										<SelectItem
											key={val.service_id}
											value={val.service_id}
											className="font-semibold"
										>
											{val.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						{renderErrorMessage("service_id")}
					</div>
					<div>
						<Label htmlFor="pickup_date" className="font-semibold">
							Pick Up<span className="text-red-500">*</span>
						</Label>
						<input
							name="pickup_date"
							type="datetime-local"
							className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
						/>
						{renderErrorMessage("pickup_date")}
					</div>
				</div>
				<div className="grid gap-2 mt-2">
					<div>
						<Label htmlFor="notes" className="font-semibold">
							Notes<span className="text-red-500">*</span>
						</Label>
						<Textarea
							name="notes"
							placeholder="ex: please take care of my uniform"
							className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
						/>
					</div>
				</div>
				<div className="flex justify-end items-center">
					<Button
						type="submit"
						className="mt-5 transition-colors duration-300 bg-blue-500 hover:bg-blue-400 text-white font-semibold"
					>
						Create Order
					</Button>
				</div>
			</form>
		</div>
	);
}
