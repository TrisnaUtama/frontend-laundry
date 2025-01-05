"use server";

import { ROOT_URL } from "@/constants/constant";
import { z } from "zod";
import { cookies } from "next/headers";

const SignUpSchema = z.object({
	name: z.string().min(2, { message: "name at least 2 characters long" }),
	password: z
		.string()
		.min(8, { message: "password at least 8 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.trim(),
	email: z.string().email(),
	address: z.string().min(5, { message: "address at least 8 characters long" }),
	phone_number: z
		.string()
		.min(12, { message: "phone number at least 12 digit" }),
});

export async function signUp(prevState: unknown, form: FormData) {
	try {
		const name = form.get("name") as string;
		const password = form.get("password") as string;
		const email = form.get("email") as string;
		const address = form.get("address") as string;
		const phone_number = form.get("phone_number") as string;
		const cookieSore = await cookies();

		const formDataValue = SignUpSchema.safeParse({
			name,
			password,
			email,
			address,
			phone_number,
		});

		if (!formDataValue.success) {
			return {
				status: false,
				message: "validation errors occured !",
				errors: formDataValue.error.flatten().fieldErrors,
			};
		}

		const res = await fetch(`${ROOT_URL}/v1/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formDataValue.data),
		});

		if (!res.ok) {
			throw new Error("Failed to register");
		}

		const responseData = await res.json();

		const data_user = {
			email: responseData.email,
			user_id: responseData.user_id,
		};

		cookieSore.set("registered_user", JSON.stringify(data_user));

		return {
			status: true,
			message: "success signup",
			data: responseData,
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
