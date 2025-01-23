"use client";
import Image from "next/image";
import VerifyAccount from "@/features/auth/verify.page";

export default function page() {
	return (
		<main>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 h-screen">
				{/* image */}
				<div className="hidden md:flex w-full h-screen bg-[#2C71F6] justify-center items-center lg:col-span-3">
					<Image
						src="/auth.png"
						width={500}
						height={500}
						alt="Picture of the author"
					/>
				</div>
				{/* form verify */}
				<div className=" m-auto w-[70%] lg:col-span-2">
					<h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-center">
						Verify your Account
					</h1>
					<p className="font-semibold text-sm mt-2 text-center">
						Please enter the 6-digit code sent to your email
					</p>
					<VerifyAccount />
				</div>
			</div>
		</main>
	);
}
