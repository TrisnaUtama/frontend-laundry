import { NextResponse, type NextRequest } from "next/server";
import { checkTokenExpiry } from "./lib/utils";
import { refreshToken } from "./services/auth/refresh_token.services";

interface AuthCookie {
	user: {
		role: string;
		[key: string]: any;
	};
	access_token: string;
	refresh_token: string;
}

export async function middleware(request: NextRequest) {
	const cookies = request.cookies.get("AUTHORIZATION");

	if (!cookies) {
		console.log("No AUTHORIZATION cookie found. Redirecting to login.");
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	try {
		const cookieParsed = JSON.parse(cookies.value) as AuthCookie;
		const { user, access_token: access, refresh_token: refresh } = cookieParsed;
		const path = request.nextUrl.pathname;
		const accessTokenStatus = checkTokenExpiry(access);
		const refreshTokenStatus = checkTokenExpiry(refresh);

		console.log(accessTokenStatus);
		console.log(refreshTokenStatus);

		if (accessTokenStatus?.expiresIn <= 300 && !refreshTokenStatus?.isExpired) {
			try {
				const response = NextResponse.next();
				const result = await refreshToken(refresh);

				if (
					!result?.status ||
					!result.data?.access_token ||
					!result.data?.refresh_token
				) {
					console.error(
						"Failed to refresh token:",
						result?.message || "Unknown error",
					);
					return NextResponse.redirect(new URL("/auth/sign-in", request.url));
				}
				const updatedCookie = JSON.stringify({
					...cookieParsed,
					access_token: result.data.access_token,
					refresh_token: result.data.refresh_token,
				});

				response.cookies.set("AUTHORIZATION", updatedCookie, {
					httpOnly: true,
					secure: true,
					path: "/",
				});

				return response;
			} catch (refreshError) {
				console.error("Error during token refresh:", refreshError);
				return NextResponse.redirect(new URL("/auth/sign-in", request.url));
			}
		}

		if (refreshTokenStatus?.isExpired) {
			console.log("Refresh token expired. Redirecting to login.");
			return NextResponse.redirect(new URL("/auth/sign-in", request.url));
		}

		switch (user.role) {
			case "User":
				if (path.startsWith("/dashboard/admin")) {
					return NextResponse.redirect(new URL("/auth/sign-in", request.url));
				}
				break;
			case "Admin":
				if (path.startsWith("/dashboard/user")) {
					return NextResponse.redirect(new URL("/auth/sign-in", request.url));
				}
				break;
			case "Staff":
				if (path.startsWith("/dashboard/user")) {
					return NextResponse.redirect(new URL("/auth/sign-in", request.url));
				}
				break;
			default:
				console.log("Invalid role. Redirecting to login.");
				return NextResponse.redirect(new URL("/auth/sign-in", request.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error("Error in middleware:", error);
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
