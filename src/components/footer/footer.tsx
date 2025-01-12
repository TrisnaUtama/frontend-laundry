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
		<footer
			className={`${
				handler ? "w-[80%] left-[20%]" : "w-full"
			} h-[20%] transition-all duration-300 ease-in-out ${
				isVisible ? "translate-y-0" : "translate-y-full"
			} fixed bottom-0 z-40`}
			style={{ backgroundColor: backgroundDark }}
		>
			<div className="flex justify-center items-center h-full">
				<p className="text-white font-bold">Footer</p>
			</div>
		</footer>
	);
}
