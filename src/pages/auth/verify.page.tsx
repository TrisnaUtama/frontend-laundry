"use client";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "../../components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verify, resendOtp } from "@/services/auth/verify.services";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const VerifyAccount = () => {
	const TIMER_DURATION = 2 * 60;
	const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
	const [canResend, setCanResend] = useState(false);
	const [verifyState, actionVerify, pendingVerify] = useActionState(
		verify,
		null,
	);
	const [resendState, actionResend, pendingResend] = useActionState(
		resendOtp,
		null,
	);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [timeLeft]);

	const renderErrorMessage = (field: string) => {
		if (verifyState?.status === false && verifyState?.errors) {
			const errors = verifyState.errors as Record<string, string[]>;
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
		if (verifyState?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: "your account succesfuly verify",
			});

			router.push("/auth/sign-in");
		} else if (verifyState?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: verifyState.message || "failed while send otp code",
			});
		}
	}, [verifyState, toast, router]);

	useEffect(() => {
		if (resendState?.status === true) {
			toast({
				variant: "success",
				title: "Success",
				description: "New OTP code sent successfully",
			});
			setTimeLeft(TIMER_DURATION);
			setCanResend(false);
		} else if (resendState?.status === false) {
			toast({
				variant: "destructive",
				title: "Error",
				description: resendState.message || "Failed to resend OTP",
			});
		}
	}, [resendState, toast]);

	const handleResendClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (!canResend) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "please wait till the timer end",
			});
		}

		setTimeLeft(TIMER_DURATION);
		setCanResend(false);
		actionResend();
	};

	const formatTime = () => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	};
	return (
		<div className="flex justify-center items-center mt-10">
			<div className="w-full max-w-md mx-auto">
				<form action={actionVerify}>
					<div className="flex flex-row justify-center gap-4">
						<InputOTP
							maxLength={6}
							name="otp_code"
							className="gap-2 justify-center"
							pattern={REGEXP_ONLY_DIGITS}
						>
							<InputOTPGroup>
								{Array.from({ length: 3 }, (_, index) => (
									<InputOTPSlot
										key={`slots${index}`}
										index={index}
										className="w-12 h-12 text-lg font-semibold text-center border rounded"
									/>
								))}
							</InputOTPGroup>
							<InputOTPSeparator className="mx-2" />
							<InputOTPGroup>
								{Array.from({ length: 3 }, (_, index) => (
									<InputOTPSlot
										key={`slots${index + 3}`}
										index={index + 3}
										className="w-12 h-12 text-lg font-semibold text-center border rounded"
									/>
								))}
							</InputOTPGroup>
						</InputOTP>
						{renderErrorMessage("otp_code")}
					</div>

					<Button
						type="submit"
						className={`mt-5 w-full font-semibold rounded-xl bg-[#2C71F6] transition-colors duration-300 hover:bg-[#2c6ff6e0] ${
							pendingVerify &&
							"transition-transform animate-pulse duration-1000"
						}`}
					>
						Verify
					</Button>
				</form>
				<Button
					onClick={handleResendClick}
					disabled={!canResend || pendingResend}
					variant="ghost"
					className={`text-[13px] font-bold mt-2 transition-colors duration-300 hover:bg-[#EBEBEB] ${
						canResend && !pendingResend
							? "hover:text-gray-600 text-black"
							: "text-gray-500 cursor-not-allowed"
					}`}
				>
					{pendingResend
						? "Sending..."
						: `Resend the OTP code? (${formatTime()})`}
				</Button>
			</div>
		</div>
	);
};
