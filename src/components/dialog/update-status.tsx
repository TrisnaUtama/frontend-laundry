import { useActionState, useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Order_Status } from "@/constants/constant";
import { updateOrder } from "@/services/orders/order.services";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function ManageOrderDialog({
	isOpen,
	setIsOpen,
	id,
	type,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	id: string;
	type: string;
}) {
	const [state, action, pending] = useActionState(updateOrder, null);
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
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: state.message || "Successfully update new staff",
			});

			router.refresh();
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "failed update new staff",
			});
		}
	}, [state, toast, router]);

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent className="">
				<AlertDialogTitle className="font-bold block text-center">
					Manage Orders
				</AlertDialogTitle>
				<form action={action}>
					<input type="hidden" name="order_id" value={id} />
					<input type="hidden" name="type" value={type} />
					<Label htmlFor="status" className="font-bold">
						Status
					</Label>
					<Select name="status">
						<SelectTrigger>
							<SelectValue
								placeholder="select item type"
								className="font-normal text-gray-300"
							/>
						</SelectTrigger>
						<SelectContent defaultValue={state?.fieldValues?.status || ""}>
							{Object.entries(Order_Status).map((val) => (
								<SelectItem
									key={val[0]}
									value={val[0]}
									className="font-semibold"
								>
									{val[1]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{renderErrorMessage("status")}
					{type === "reject" && (
						<>
							<Label htmlFor="cancellation_reason" className="font-bold">
								Cancelation Reason
							</Label>
							<Textarea
								className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
								placeholder="ex: Jeans, Clothes, Bed Cover"
								name="cancellation_reason"
								defaultValue={state?.fieldValues?.cancellation_reason || ""}
							/>
						</>
					)}

					<AlertDialogFooter className="mt-2">
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							type="submit"
							disabled={pending}
							className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
