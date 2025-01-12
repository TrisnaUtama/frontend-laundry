import { useActionState, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { canceledOrder } from "@/services/orders/order.services";
import { Textarea } from "@/components/ui/textarea";

export default function CanceledOrder({
	isOpen,
	setIsOpen,
	id,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	id: string;
}) {
	const [state, action, pending] = useActionState(canceledOrder, null);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: state.message || "Successfully canceled orders",
			});

			router.refresh();
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "failed canceled orders",
			});
		}
	}, [state, toast, router]);

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent className="">
				<AlertDialogTitle className="font-bold block text-center">
					Canceled Order
				</AlertDialogTitle>
				<form action={action}>
					<input type="hidden" name="order_id" value={id} />
					<Label htmlFor="cancellation_reason" className="font-bold">
						Cancelation Reason
					</Label>
					<Textarea
						className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
						placeholder="ex: Jeans, Clothes, Bed Cover"
						name="cancellation_reason"
						defaultValue={state?.fieldValues?.cancellation_reason || ""}
					/>

					<AlertDialogFooter className="mt-5 flex justify-between">
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
