"use client";
import Image from "next/image";
import { VerifyAccount } from "@/components/auth/verify.component";

export default function page() {
	return (
		<main>
			<div className="grid grid-cols-5">
				{/* image */}
				<div className="w-full h-screen bg-[#2C71F6] flex justify-center items-center col-span-3">
					<Image
						src="/auth.png"
						width={500}
						height={500}
						alt="Picture of the author"
					/>
				</div>
				{/* form register */}
				<div className="m-auto col-span-2">
					<h1 className="font-bold text-3xl text-center">
						Verify your Account
					</h1>
					<p className="font-semibold text-sm mt-2">
						Please enter the 6-digit code sent to your email
					</p>

					<VerifyAccount />
				</div>
			</div>
		</main>
	);
}
