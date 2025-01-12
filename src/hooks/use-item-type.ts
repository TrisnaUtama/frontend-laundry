import { useState, useEffect } from "react";
import {
	getAllItemType,
	type Item_Type,
} from "@/services/item_type/item_type.services";

export const useItemTypes = () => {
	const [type, setType] = useState<Item_Type[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllItemType();
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
	}, []);

	return type;
};
