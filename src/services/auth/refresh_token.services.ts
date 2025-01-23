import { ROOT_URL } from "@/constants/constant";

interface TokenResponse {
	status: boolean;
	data?: {
		access_token: string;
		refresh_token: string;
	};
	message?: string;
}

export async function refreshToken(
	refresh_token: string,
): Promise<TokenResponse> {
	try {
		const res = await fetch(`${ROOT_URL}/v1/refresh`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({refresh_token})
		});
		const response = await res.json();

		if (!res.ok) {
			throw new Error("Failed to refresh token");
		}

		return {
			status: true,
			data: response.data
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
