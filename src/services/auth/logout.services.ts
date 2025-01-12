"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";

export async function logout(id: string) {
	const cookieStore = await cookies();
	const cookiesParse = cookieStore.get("AUTHORIZATION");
	const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
	try {
		const res = await fetch(`${ROOT_URL}/v1/users/logout/${id}`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: `access_token=${cookie.access_token}`,
			},
		});

		if (!res.ok) {
			throw new Error("error while logout");
		}

		cookieStore.delete("AUTHORIZATION");
		return {
			status: true,
			message: "successfuly logout",
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: false,
				message: error.message,
			};
		}
		return {
			status: false,
			message: "server cannot process your request",
		};
	}
}
