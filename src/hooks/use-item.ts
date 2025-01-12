import { useState, useEffect } from "react";
import { getAllItem, type Item } from "@/services/orders/item.services";

export const useItem = () => {
	const [item, setItem] = useState<Item[]>([]);

	useEffect(() => {
		const fetchType = async () => {
			try {
				const res = await getAllItem();
				if (res.status) {
					setItem(res.data);
				} else {
					console.error(res.message);
				}
			} catch (error) {
				console.error("Error fetching item types:", error);
			}
		};
		fetchType();
	}, []);

	return item;
};
