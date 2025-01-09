import { cookies } from "next/headers";
import DashboardLayoutClient from "./layout-client";

export default async function DashboardLayoutServer({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get("AUTHORIZATION");

	let role = "";

	if (userCookie) {
		try {
			const cookieParsed = JSON.parse(userCookie.value);
			if (!cookieParsed) throw new Error("unauthorized");
			role = cookieParsed.user.role || "";
		} catch (error) {
			console.error("Error parsing USER cookie:", error);
		}
	}

	return <DashboardLayoutClient role={role}>{children}</DashboardLayoutClient>;
}
