import { useState, useEffect } from "react";
import {
	getAllUserAddressByAdmin,
	type Address,
} from "@/services/address/address.services";

export const useAddress = (id: string) => {
	const [type, setType] = useState<Address[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllUserAddressByAdmin(id);
				if (res.status) {
					setType(res.data);
				} else {
					console.error(res.message);
				}
			} catch (error) {
				console.error("Error fetching item types:", error);
			}
		};
		fetchType();
	}, [id]);

	return type;
};
