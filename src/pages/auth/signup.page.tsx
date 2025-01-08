"use client";

import { useActionState, useEffect, useState } from "react";
import { primaryColor, hoverPrimaryColor } from "@/constants/constant";
import { Eye, EyeClosed } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { signUp } from "@/services/auth/signup.services";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
	const [togglePassword, setTogglePassword] = useState<boolean>(false);
	const [state, action, pending] = useActionState(signUp, null);
	const { toast } = useToast();
	const router = useRouter();

	const handleTogglePassword = () => {
		setTogglePassword(!togglePassword);
	};

	const renderErrorMessage = (field: string) => {
		if (state?.status === false && state?.errors) {
			const errors = state.errors as Record<string, string[]>;
			if (errors[field]) {
				return (
					<div className="text-red-500 text-sm">
						{errors[field].map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				);
			}
		}
		return null;
	};

	useEffect(() => {
		if (state?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: "Successfully registered an account",
			});

			router.push("/auth/verify-account");
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "Registration failed",
			});
		}
	}, [state, toast, router]);

	return (
		<form action={action} className="mt-4">
			<div className="mt-4">
				<Label htmlFor="email" className="font-bold">
					Email <span className="text-red-500">*</span>
				</Label>
				<Input
					type="text"
					placeholder="your email here..."
					id="email"
					name="email"
					defaultValue={state?.fieldValues?.email || ""}
					className=" border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
				/>
				{renderErrorMessage("email")}
			</div>
			<div className="mt-2">
				<Label htmlFor="name" className="font-bold">
					Name <span className="text-red-500">*</span>
				</Label>
				<Input
					type="text"
					placeholder="your name here..."
					id="name"
					name="name"
					defaultValue={state?.fieldValues?.name || ""}
					className="border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
				/>
				{renderErrorMessage("name")}
			</div>
			<div className="mt-2">
				<Label htmlFor="address" className="font-bold">
					Address <span className="text-red-500">*</span>
				</Label>
				<Input
					type="text"
					placeholder="your address here..."
					id="address"
					name="address"
					className="border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
				/>
				{renderErrorMessage("address")}
			</div>
			<div className="mt-2">
				<Label htmlFor="phone_number" className="font-bold">
					Phone Number <span className="text-red-500">*</span>
				</Label>
				<Input
					type="text"
					placeholder="your phone number here..."
					id="phone_number"
					name="phone_number"
					defaultValue={state?.fieldValues?.phone_number || ""}
					className="border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
				/>
				{renderErrorMessage("phone_number")}
			</div>
			<div className="mt-2">
				<Label htmlFor="password" className="font-bold">
					Password <span className="text-red-500">*</span>
				</Label>
				<div className="relative">
					<Input
						type={!togglePassword ? "password" : "text"}
						placeholder="your password here..."
						id="password"
						name="password"
						defaultValue={state?.fieldValues?.password || ""}
						className="border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
					/>
					{renderErrorMessage("password")}

					<span
						className={`absolute right-3 text-gray-500 cursor-pointer ${
							state?.errors
								? "-translate-y-0 top-0 mt-1.5"
								: "top-1/2 transform -translate-y-1/2"
						}`}
						onClick={handleTogglePassword}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleTogglePassword();
							}
						}}
					>
						{togglePassword ? (
							<Eye className="w-[15px]" />
						) : (
							<EyeClosed className="w-[15px]" />
						)}
					</span>
				</div>
			</div>
			<div className="mt-10">
				<Button
					type="submit"
					className={`w-full font-semibold rounded-xl bg-[#2C71F6] transition-colors duration-300  hover:bg-[#2c6ff6e0] ${
						pending && "transition-transform animate-pulse duration-500"
					}`}
				>
					{pending ? "Loading" : "Create Account"}
				</Button>
				<p className="text-[13px] font-bold mt-2">
					already have an account?{" "}
					<Link
						href="/auth/sign-in"
						className="underline text-[13px] transition-colors duration-300  text-[#2C71F6] hover:text-[#2c6ff6e0]"
					>
						sign in here
					</Link>
				</p>
			</div>
		</form>
	);
};
