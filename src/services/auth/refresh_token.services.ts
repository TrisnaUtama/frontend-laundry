import { ROOT_URL } from "@/constants/constant";

interface TokenResponse {
	status: boolean;
	data?: {
		access_token: string;
		refresh_token: string;
	};
	message?: string;
}

interface CookieMap {
	[key: string]: string;
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
				Cookie: `refresh_token=${refresh_token}`,
			},
		});
		const response = await res.json();
		console.log(response);

		if (!res.ok) {
			throw new Error("Failed to refresh token");
		}

		const setCookieHeader = res.headers.get("set-cookie");
		if (!setCookieHeader) {
			throw new Error("No cookies returned from refresh endpoint");
		}

		const cookieStrings = setCookieHeader.split(",");
		const cookies = cookieStrings.reduce((acc: CookieMap, cookie: string) => {
			const [cookieString] = cookie.split(";");
			const [key, value] = cookieString.split("=");
			if (key && value) {
				acc[key.trim()] = value.trim();
			}
			return acc;
		}, {});

		if (!cookies.access_token || !cookies.refresh_token) {
			throw new Error("Missing required tokens in response");
		}

		return {
			status: true,
			data: {
				access_token: cookies.access_token,
				refresh_token: cookies.refresh_token,
			},
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
