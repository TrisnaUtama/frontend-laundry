"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	getAllUserAddress,
	type Address,
} from "@/services/address/address.services";
import {
	getAllItemType,
	type Item_Type,
} from "@/services/item_type/item_type.services";
import {
	createOrder,
	getAllUserOrder,
	type Order,
} from "@/services/orders/order.services";
import {
	getAllDetailOrder,
	type Detail_Order,
} from "@/services/orders/detail-order.services";
import {
	getAllService,
	type Service,
} from "@/services/services/services.services";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAllItem, type Item } from "@/services/orders/item.services";
import { Badge } from "@/components/ui/badge";
import CanceledOrder from "./cancel-order.page";
import {
	paidOrder,
	getSpecificPayment,
	type Payment,
} from "@/services/payment/payment.services";
import { updateOrder } from "@/services/orders/order.services";

const OrdersPage = () => {
	const [state, action, pending] = useActionState(paidOrder, null);
	const [state_received, action_received, pending_received] = useActionState(
		updateOrder,
		null,
	);
	const [services, setServices] = useState<Service[]>([]);
	const [orders, setOrders] = useState<Order[]>([]);
	const [itemTypes, setItemType] = useState<Item_Type[]>([]);
	const [items, setItem] = useState<Item[]>([]);
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [detail_orders, setDetailOrders] = useState<Detail_Order[]>([]);
	const [address, setAddress] = useState<Address[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [order, setSelectedOrder] = useState<string>("");
	const [formData, setFormData] = useState({
		address_id: "",
		delivery_date: "",
		payment_method: "",
	});

	const { toast } = useToast();
	const router = useRouter();

	// Error Message Handler
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

	// Initial Data Fetch
	useEffect(() => {
		const fetch = async () => {
			try {
				const [
					res_services,
					res_item,
					res_address,
					res_orders,
					res_items,
					res_detailOrder,
				] = await Promise.all([
					getAllService(),
					getAllItemType(),
					getAllUserAddress(),
					getAllUserOrder(),
					getAllItem(),
					getAllDetailOrder(),
				]);

				setServices(
					res_services.status ? res_services.data : res_services.message,
				);
				setItemType(res_item.status ? res_item.data : res_item.message);
				setAddress(res_address.status ? res_address.data : res_address.message);
				setOrders(res_orders.status ? res_orders.data : res_orders.message);
				setItem(res_items.status ? res_items.data : res_items.message);
				setDetailOrders(
					res_detailOrder.status
						? res_detailOrder.data
						: res_detailOrder.message,
				);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to load data. Please try again.",
				});
			}
		};
		fetch();
	}, [toast]);

	// Handle Payment State
	useEffect(() => {
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: state.message || "Successfully processed payment",
			});
			router.push("/dashboard/user/");
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "Failed to process payment",
			});
		}
	}, [state, toast, router]);

	useEffect(() => {
		if (state_received?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description:
					state_received.message || "Successfully updated order status",
			});
			router.push("/dashboard/user/");
		} else if (state_received?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state_received.message || "Failed to update order status",
			});
		}
	}, [state_received, toast, router]);

	const handleOrderDelete = (orderId: string) => {
		setSelectedOrder(orderId);
		setIsOpen(true);
	};

	const handleClickOrder = async (id: string) => {
		try {
			const res = await getSpecificPayment(id);
			setSelectedPayment(res.status ? res.data : res.message);
		} catch (error) {
			console.error("Error processing payment:", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to load payment details",
			});
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<div className="mb-[10%]">
			<CanceledOrder isOpen={isOpen} setIsOpen={setIsOpen} id={order} />
			<div className="grid grid-cols-3 gap-3">
				{/* Orders List Column */}
				<div className="h-[80%] col-span-2 mt-2 p-2 rounded-md bg-white overflow-y-auto">
					<h1 className="text-xl font-bold">Order Details</h1>
					{orders.map((order) => (
						<Card
							onClick={() => handleClickOrder(order.order_id)}
							key={order.item_id}
							className="hover:cursor-pointer mt-3 grid grid-cols-4 gap-4 p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white"
						>
							<CardHeader className="flex justify-center items-center col-span-1 border-r border-gray-300">
								<Image src="/hanger.png" width={50} height={50} alt="hanger" />
							</CardHeader>
							<CardContent className="col-span-2 flex flex-col justify-center space-y-2">
								<div className="text-sm space-y-1">
									<p className="font-semibold text-lg">
										{items
											.filter((val) => val.item_id === order.item_id)
											.map((val) => val.name)}
									</p>
									<p className="font-semibold text-[1rem]">
										{items
											.filter((val) => val.item_id === order.item_id)
											.flatMap((val) =>
												itemTypes
													.filter(
														(type) => type.item_type_id === val.item_type_id,
													)
													.map((type) => type.name),
											)
											.join(", ")}
									</p>
									<p className="font-semibold text-[1rem]">
										{services
											.filter((val) => val.service_id === order.service_id)
											.map((val) => val.name)}
									</p>
									<p className="text-sm font-semibold">
										{address
											.filter(
												(val) =>
													val.user_address_id === order.address_id &&
													val.address,
											)
											.map((val) => val.address)}
									</p>
									<p className="text-sm font-semibold">
										{new Date(order.pickup_date).toLocaleString()}
									</p>
									{order.special_notes && (
										<p className="text-sm font-normal mb-5">
											{order.special_notes}
										</p>
									)}
									{order.status === "pending" && (
										<Badge
											onClick={() => handleOrderDelete(order.order_id)}
											variant="pending"
											className="font-bold"
										>
											Cancel Order
										</Badge>
									)}
								</div>
							</CardContent>
							<CardContent className="flex whitespace-nowrap justify-center items-center">
								<Badge variant="on_proggres">
									{order.status.replace(/_/g, " ")}
								</Badge>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Payment Status Column */}
				<div className="mt-2 p-2 rounded-md h-[67%] bg-white">
					<h1 className="font-bold text-xl">Payment Status</h1>
					{orders.find((val) => val.order_id === selectedPayment?.order_id)
						?.status === "delivered" ? (
						// Received Form
						<form action={action_received}>
							<input
								type="hidden"
								name="order_id"
								value={selectedPayment?.order_id || ""}
							/>
							<input type="hidden" name="type" value="received" />
							<div className="flex justify-center mt-3">
								<Button
									type="submit"
									disabled={pending_received}
									className={`w-full bg-blue-500 transition-colors duration-300 hover:bg-blue-400 text-white font-semibold ${
										pending_received && "animate-pulse"
									}`}
								>
									Received
								</Button>
							</div>
						</form>
					) : (
						// Payment Form
						<form action={action}>
							<h1 className="font-bold text-sm mt-5 mb-3">Delivery Options</h1>
							<Select
								name="address_id"
								value={formData.address_id}
								onValueChange={(value) =>
									handleInputChange("address_id", value)
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder="Delivery to Home"
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
							{renderErrorMessage("delivery_address")}

							<Label htmlFor="delivery_date">Delivery Date</Label>
							<input
								name="delivery_date"
								type="datetime-local"
								value={formData.delivery_date}
								onChange={(e) =>
									handleInputChange("delivery_date", e.target.value)
								}
								className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
							/>
							{renderErrorMessage("delivery_date")}

							<h1 className="font-bold text-sm mt-3 mb-3">Payment Detail</h1>
							<div className="rounded-lg bg-blue-500 p-5">
								<div className="grid grid-cols-2 font-semibold text-sm text-white">
									<p>Item weight:</p>
									<p className="flex justify-end items-center">
										{detail_orders
											.filter(
												(val) => val.order_id === selectedPayment?.order_id,
											)
											.map((detail) => detail.weight)}
										kg
									</p>
								</div>
								<div className="grid grid-cols-2 font-semibold text-sm text-white">
									<p>Services Price:</p>
									<p className="flex justify-end items-center">
										Rp.
										{orders
											.filter(
												(val) => val.order_id === selectedPayment?.order_id,
											)
											.flatMap((val) =>
												services
													.filter(
														(service) => service.service_id === val.service_id,
													)
													.map((val) => val.price),
											)
											.join(", ")}
									</p>
								</div>
								<div className="grid grid-cols-2 font-semibold text-sm text-white">
									<p>Total Price:</p>
									<p className="flex justify-end items-center">
										Rp.{selectedPayment?.total_price}
									</p>
								</div>
							</div>

							<Select
								name="payment_method"
								value={formData.payment_method}
								onValueChange={(value) =>
									handleInputChange("payment_method", value)
								}
							>
								<SelectTrigger className="mt-3">
									<SelectValue
										placeholder="Payment Method"
										className="font-normal text-gray-300"
									/>
								</SelectTrigger>
								<SelectContent>
									{["transfer", "cod"].map((val) => (
										<SelectItem key={val} value={val} className="font-semibold">
											{val.toUpperCase()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{renderErrorMessage("payment_method")}

							<input
								type="hidden"
								name="id"
								value={selectedPayment?.payment_id || ""}
							/>

							<Button
								type="submit"
								disabled={
									selectedPayment?.payment_status !== "waiting_for_payment" ||
									pending
								}
								className={`mt-3 w-full bg-blue-500 transition-colors duration-300 hover:bg-blue-400 text-white font-semibold ${
									pending && "animate-pulse"
								}`}
							>
								{selectedPayment?.payment_status === "waiting_for_payment"
									? "Paid"
									: "Order Still In Progress"}
							</Button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;
