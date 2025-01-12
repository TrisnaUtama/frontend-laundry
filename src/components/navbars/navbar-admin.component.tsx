"use client";

import { useState, useEffect } from "react";
import { primaryColor, strokes, hoverPrimaryColor } from "@/constants/constant";
import { User, Sidebar } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/auth/logout.services";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NavbarAdmin({
	handler,
	isOpen,
	user_id,
}: {
	handler: () => void;
	isOpen: boolean;
	user_id: string;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollPos, setLastScrollPos] = useState(0);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768 && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};

		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;

			if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			setLastScrollPos(currentScrollPos);
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMenuOpen, lastScrollPos]);

	const handleLogout = async () => {
		try {
			const result = await logout(user_id);

			if (result.status) {
				toast({
					variant: "success",
					title: "Success",
					description: result.message || "Successfully Logout",
				});
				router.push("/auth/sign-in");
			} else {
				toast({
					variant: "destructive",
					title: "Failed",
					description: result.message || "Failed Logout",
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: "destructive",
					title: "Failed",
					description: error.message || "Failed Logout",
				});
			}
			toast({
				variant: "destructive",
				title: "Failed",
				description: "Something Wrong while logout",
			});
		}
	};

	return (
		<nav
			className={`fixed top-0 z-50 transition-all duration-300 ease-in-out ${
				isVisible ? "translate-y-0" : "-translate-y-full"
			}`}
			style={{
				left: isOpen ? "20%" : "8%",
				width: isOpen ? "80%" : "92%",
			}}
		>
			<div
				className={`flex justify-between items-center border-b border-b-[${strokes}] h-18 w-full bg-white p-6`}
			>
				<Sidebar
					onClick={handler}
					className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors duration-500"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger>
						<User className="text-black hover:text-blue-500 transition-colors duration-500" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="mx-5">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="font-medium">Profile</DropdownMenuItem>
						<DropdownMenuItem
							className="font-medium"
							onSelect={() => setIsAlertOpen(true)}
						>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="font-bold">
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription className="font-semibold">
								This action will Logout your account
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleLogout}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</nav>
	);
}
