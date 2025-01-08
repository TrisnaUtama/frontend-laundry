import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const cookies = request.cookies.get("AUTHORIZATION");
	if (!cookies) return NextResponse.redirect(new URL("/", request.url));

	try {
		const cookieParsed = JSON.parse(cookies.value);
		const user = cookieParsed.user.role;
		const path = request.nextUrl.pathname;

		switch (user) {
			case "User":
				if (path.startsWith("/dashboard/admin")) {
					return NextResponse.redirect(new URL("/", request.url));
				}
				break;
			case "Admin":
				if (path.startsWith("/dashboard/user")) {
					return NextResponse.redirect(new URL("/", request.url));
				}
				break;
			case "Staff":
				if (path.startsWith("/dashboard/user")) {
					return NextResponse.redirect(new URL("/", request.url));
				}
				break;
			default:
				return NextResponse.redirect(new URL("/", request.url));
		}
	} catch (error) {
		console.error("Error parsing USER cookie:", error);
		return NextResponse.redirect(new URL("/", request.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
