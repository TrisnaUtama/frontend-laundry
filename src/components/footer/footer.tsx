"use client";

import { useState, useEffect } from "react";
import { backgroundDark } from "@/constants/constant";

export default function Footer({ handler }: { handler: boolean }) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			if (scrollTop + windowHeight >= documentHeight - 200) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={`${
				handler ? "w-[80%] h-[20%]" : "left-[8%] w-[92%] h-[20%]"
			} p-5 fixed bottom-0 transition-transform duration-500 ${
				isVisible ? "translate-y-0" : "translate-y-full"
			}`}
			style={{ backgroundColor: backgroundDark }}
		>
			<p className="flex justify-center items-center text-white font-bold h-full">
				Footer
			</p>
		</div>
	);
}
