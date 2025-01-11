import { cookies } from "next/headers";
import DashboardLayoutClient from "./layout-client";
import { redirect } from "next/navigation";

export default async function DashboardLayoutServer({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get("AUTHORIZATION");

	let role = "";
	let user_id = "";

	if (!userCookie?.value) {
		redirect("/auth/sign-in");
	}

	if (userCookie) {
		try {
			const cookieParsed = JSON.parse(userCookie.value);
			if (!cookieParsed) throw new Error("unauthorized");
			role = cookieParsed.user.role || "";
			user_id = cookieParsed.user.user_id || "";
		} catch (error) {
			console.error("Error parsing USER cookie:", error);
		}
	}

	return (
		<DashboardLayoutClient user_id={user_id} role={role}>
			{children}
		</DashboardLayoutClient>
	);
}
