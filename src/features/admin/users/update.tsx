"use client";

import { useActionState, useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
	getUserAddressDefault,
	type Address,
} from "@/services/address/address.services";
import {
	getSpecificUser,
	updateUser,
	type User,
} from "@/services/user/user.services";

export default function EdituserForm({ id }: { id: string }) {
	const [togglePassword, setTogglePassword] = useState<boolean>(false);
	const [user, setUser] = useState<User>();
	const [address, setAddress] = useState<Address>();
	const [state, action, pending] = useActionState(updateUser, null);
	const { toast } = useToast();
	const router = useRouter();

	const handleTogglePassword = () => {
		setTogglePassword(!togglePassword);
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getSpecificUser(id);
				if (!res.status) {
					console.log(res.message);
				}
				setUser(res.data);
			} catch (error) {
				if (error instanceof Error) {
					console.log(error.message);
				}
				console.log(error);
			}
		};
		fetchUser();
	}, [id]);

	useEffect(() => {
		const fetchAddress = async () => {
			try {
				const res = await getUserAddressDefault(id);

				if (!res.status) {
					console.log(res.message);
				}
				setAddress(res.data);
			} catch (error) {
				if (error instanceof Error) {
					console.log(error.message);
				}
				console.log(error);
			}
		};
		fetchAddress();
	}, [id]);

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
				description: state.message || "Successfully add new user",
			});

			router.push("/dashboard/admin/people-management/user");
		} else if (state?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: state.message || "failed update data user",
			});
		}
	}, [state, toast, router]);

	if (!address) {
		return <div>Loading ...</div>;
	}

	return (
		<div className="rounded-md w-full h-[90%] bg-white border-opacity-75 mt-2 p-4">
			<h1 className="font-semibold text-lg mb-2">General Information</h1>
			<form action={action}>
				<input type="hidden" name="id" value={id} />
				<input
					type="hidden"
					name="id_address"
					value={address.user_address_id}
				/>
				<div className="grid grid-cols-2 space-x-3 ">
					<div className="">
						<Label htmlFor="name" className="font-bold">
							Full Name<span className="text-red-500">*</span>
						</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder="ex: Sumanto Suryawijaya"
							defaultValue={user?.name}
							className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
						/>
						{renderErrorMessage("name")}
					</div>
					<div className="">
						<Label htmlFor="email" className="font-bold">
							Email<span className="text-red-500">*</span>
						</Label>
						<Input
							type="email"
							name="email"
							id="email"
							placeholder="ex: SumantoSur@gmail.com"
							defaultValue={user?.email}
							className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
						/>
						{renderErrorMessage("email")}
					</div>
				</div>
				<div className="grid grid-cols-2 space-x-3 mt-3">
					<div className="">
						<Label htmlFor="address" className="font-bold">
							Address<span className="text-red-500">*</span>
						</Label>
						<Input
							type="text"
							id="address"
							name="address"
							placeholder="ex: los angles street kick avenue"
							defaultValue={address?.address || ""}
							className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
						/>
						{renderErrorMessage("address")}
					</div>
					<div className="">
						<Label htmlFor="phone_number" className="font-bold">
							Phone Number<span className="text-red-500">*</span>
						</Label>
						<Input
							type="text"
							name="phone_number"
							id="phone_number"
							placeholder="ex: +62089674342456"
							defaultValue={user?.phone_number}
							className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
						/>
						{renderErrorMessage("phone_number")}
					</div>
				</div>
				<h1 className="font-semibold text-lg mt-6 mb-2">
					Security Information
				</h1>
				<div className="grid grid-cols-3 space-x-3 mt-3">
					<div>
						<Label htmlFor="password" className="font-bold">
							Password <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<Input
								type={!togglePassword ? "password" : "text"}
								placeholder="ex: $jdsao74ED"
								id="password"
								name="password"
								defaultValue={user?.password}
								className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
							/>
							{renderErrorMessage("password")}

							<span
								className="absolute right-3 text-gray-500 cursor-pointer top-3 transform -translate-y-1.5"
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
					<div>
						<Label htmlFor="is_verified" className="font-bold">
							Verified<span className="text-red-500">*</span>
						</Label>
						<Select name="is_verified">
							<SelectTrigger className="font-semibold">
								<SelectValue
									placeholder="select verified"
									className="font-normal text-gray-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="font-semibold"
								defaultValue={
									state?.fieldValues?.is_verified ? "Verified" : "Unverified"
								}
							>
								{["Verified", "Unverified"].map((val) => (
									<SelectItem key={val} value={val} className="font-semibold">
										{val}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{renderErrorMessage("verified")}
					</div>
					<div>
						<Label htmlFor="status" className="font-bold">
							Status<span className="text-red-500">*</span>
						</Label>
						<Select name="status">
							<SelectTrigger className="font-semibold">
								<SelectValue
									placeholder="select verified"
									className="font-normal text-gray-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="font-semibold"
								defaultValue={
									state?.fieldValues?.is_verified ? "Active" : "Unactive"
								}
							>
								{["Active", "Unactive"].map((val) => (
									<SelectItem key={val} value={val} className="font-semibold">
										{val}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{renderErrorMessage("verified")}
					</div>
				</div>
				<div className="flex justify-end items-center mt-5 ">
					<Button
						type="submit"
						className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
					>
						Update User
					</Button>
				</div>
			</form>
		</div>
	);
}
