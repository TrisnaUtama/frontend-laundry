import { useState, useEffect } from "react";
import {
	getAllService,
	type Service,
} from "@/services/services/services.services";

export const useService = () => {
	const [services, setServices] = useState<Service[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllService();
				if (res.status) {
					setServices(res.data);
				} else {
					console.error(res.message);
				}
			} catch (error) {
				console.error("Error fetching item types:", error);
			}
		};
		fetchType();
	}, []);

	return services;
};
