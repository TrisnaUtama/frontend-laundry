"use server";

import { ROOT_URL } from "@/constants/constant";
import { z } from "zod";
import { cookies } from "next/headers";

export async function verify(prevState: unknown, form: FormData) {
	const VerifyOTPSchema = z.object({
		code: z.string().min(6, { message: "invalid otp code" }),
		user_id: z.string(),
	});
	const cookieStore = await cookies();
	const cookiesParse = cookieStore.get("registered_user");
	const user = cookiesParse ? JSON.parse(cookiesParse.value) : null;
	try {
		const code = form.get("otp_code") as string;

		const formDataValue = VerifyOTPSchema.safeParse({
			code,
			user_id: user?.user_id,
		});

		if (!formDataValue.success) {
			return {
				status: false,
				message: "validation errors occured !",
				errors: formDataValue.error.flatten().fieldErrors,
			};
		}

		const res = await fetch(`${ROOT_URL}/v1/verify`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formDataValue.data),
		});

		const responseData = await res.json();

		if (!res.ok) {
			return {
				status: false,
				message: responseData.message || "Verification failed",
			};
		}

		(await cookies()).delete("registered_user");
		return {
			status: true,
			message: responseData,
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

export async function resendOtp(prevState: unknown) {
	const cookieStore = await cookies();
	const cookiesParse = cookieStore.get("registered_user");
	const user = cookiesParse ? JSON.parse(cookiesParse.value) : null;
	try {
		if (user === null) {
			return {
				status: false,
				message: "something went wrong while accesing resend otp",
			};
		}
		const res = await fetch(`${ROOT_URL}/v1/resend-otp`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		if (res.status === 204) {
			return {
				status: true,
				message: "Successfully sent new OTP code",
			};
		}

		const responseData = await res.json();

		if (!res.ok) {
			return {
				status: false,
				message: responseData.message || "Failed to resend OTP",
			};
		}

		return {
			status: true,
			message: "successfuly sent new otp code",
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
