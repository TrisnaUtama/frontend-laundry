import { useState, useEffect } from "react";
import {
	getAllPayment,
	type Payment,
} from "@/services/payment/payment.services";

export const usePayment = () => {
	const [payments, setPayments] = useState<Payment[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllPayment();
				if (res.status) {
					setPayments(res.data);
				} else {
					console.error(res.message);
				}
			} catch (error) {
				console.error("Error fetching item types:", error);
			}
		};
		fetchType();
	}, []);

	return payments;
};
