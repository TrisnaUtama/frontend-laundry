import { useState, useEffect } from "react";
import {
	getAllUserAddressByAdmin,
	type Address,
} from "@/services/address/address.services";
import {
	getAllPayment,
	type Payment,
} from "@/services/payment/payment.services";

export const usePayments = (id: string) => {
	const [payments, setPayments] = useState<Payment[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllUserAddressByAdmin(id);
				if (res.status) {
					setPayments(res.data);
				} else {
					setPayments(res.message);
				}
			} catch (error) {
				console.error("Error fetching item types:", error);
			}
		};
		fetchType();
	}, [id]);

	return payments;
};
