"use client";
import Image from "next/image";
import { SignUpForm } from "@/components/auth/register.component";

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
					<h1 className="font-bold text-3xl">Create an Account</h1>
					<p className="font-semibold text-sm">
						Please provide your identity bellow
					</p>
					<SignUpForm />
				</div>
			</div>
		</main>
	);
}
