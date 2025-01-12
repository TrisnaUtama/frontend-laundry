"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	getAllService,
	type Service,
} from "@/services/services/services.services";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
	const [services, setServices] = useState<Service[]>([]);

	useEffect(() => {
		const fetchServices = async () => {
			const res = await getAllService();

			if (!res.status) {
				setServices(res.message);
			}
			setServices(res.data);
		};
		fetchServices();
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	console.log(services);

	return (
		<main className="px-[12%] py-[8%] space-y-[15%] mb-[100px]">
			{/* home section */}
			<motion.section
				id="home"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<motion.div
						className="m-auto"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						<motion.p
							className="text-2xl mb-2 font-medium"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							Swift, Affordable, Efficient
						</motion.p>
						<motion.p
							className="text-4xl md:text-7xl font-medium"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
						>
							Fresh Clothes, <br />
							Simple Life
						</motion.p>
						<motion.div
							className="flex justify-start items-center gap-3 mt-[5%]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
						>
							<Link
								href="/dashboard/user/orders/create"
								className="p-2 transition-colors duration-300 bg-blue-500 hover:bg-transparent border-blue-500 border hover:text-blue-500 rounded-2xl text-white text-sm font-semibold"
							>
								Schedule a Pickup
							</Link>
							<Link
								href="#"
								className="p-2 transition-colors duration-300 bg-transparent border border-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white text-blue-500 text-sm font-semibold"
							>
								Our Services
							</Link>
						</motion.div>
					</motion.div>
					<motion.div
						className="hidden md:flex justify-center"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.4, duration: 0.8 }}
					>
						<Image
							src="/landing-page.png"
							width={500}
							height={500}
							alt="Landing Page"
							className="object-contain"
						/>
					</motion.div>
				</div>
			</motion.section>

			{/* services */}
			<motion.section
				id="services"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				<div className="space-y-5">
					<motion.div variants={itemVariants}>
						<Link
							href="#"
							className="text-blue-500 text-lg flex justify-center items-center"
						>
							services_
						</Link>
					</motion.div>
					<motion.p
						variants={itemVariants}
						className="text-3xl md:text-5xl font-medium text-center"
					>
						Effortless Laundry, Fresh Results
					</motion.p>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{services.slice(0, 3).map((val, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card
									key={index}
									className="bg-transparent mt-5 border-blue-500 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
								>
									<CardHeader>
										<CardTitle>{val.name}</CardTitle>
									</CardHeader>

									<CardContent>{val.description}</CardContent>
									<div className="flex justify-between p-3 border-t border-gray-300">
										<p className="text-sm ">
											Estimated Hour: {val.estimated_hours} hour
										</p>
										<p className="font-bold text-xl ">Rp. {val.price}</p>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* about us */}
			<motion.section
				id="about us"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8 }}
			>
				<div className="space-y-5 ">
					<Link
						href="#"
						className="text-blue-500 text-lg flex justify-center items-center"
					>
						about us_
					</Link>
					<p className="text-3xl md:text-5xl font-medium text-center">
						Effortless Laundry, Fresh Results
					</p>
					<p className="text-justify text-sm md:text-base">
						At Laundry Hub, we’re dedicated to transforming the way you
						experience laundry. Founded with a passion for convenience and
						quality, we believe your time is valuable, and your clothes deserve
						the best care. That’s why we offer reliable, affordable, and
						efficient laundry services tailored to meet your busy lifestyle. Our
						team of professionals uses state-of-the-art equipment, premium
						detergents, and proven methods to ensure your garments are fresh,
						clean, and handled with the utmost care. From everyday wear to
						delicate fabrics, we treat every item as if it were our own. Whether
						you’re a student, professional, or family on the go, we’re here to
						make your life easier with services like same-day express laundry,
						pick-up and delivery, and personalized care for every load. At
						Laundry Hub, we’re more than just a laundry service—we’re your
						trusted partner in keeping life fresh, clean, and worry-free. Let us
						handle the laundry, so you can focus on what truly matters.
					</p>
				</div>
			</motion.section>

			{/* contact us */}
			<motion.section
				id="contact"
				className="pb-24"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				<div className="space-y-5">
					<motion.div variants={itemVariants}>
						<Link
							href="#"
							className="text-blue-500 text-lg flex justify-center items-center"
						>
							contact us_
						</Link>
					</motion.div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
						<motion.div
							className="space-y-3 flex justify-center items-center"
							variants={itemVariants}
						>
							<div className="">
								<p className="text-3xl md:text-5xl font-medium text-center mb-4">
									Contact Us
								</p>
								<p className="font-medium text-sm md:text-base">
									We’re here to help! At Laundry Hub, we value your feedback and
									inquiries. Whether you have questions about our services, need
									assistance with your order, or simply want to share your
									experience, feel free to reach out to us.
								</p>
								<p className="mt-5 font-semibold text-sm md:text-base">
									laundry.hub@gmail.com
								</p>
								<p className="mt-5 font-semibold text-sm md:text-base">
									+62 890-456-983
								</p>

								<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<p className="font-bold"> Customer Support</p>
										<p className="text-sm md:text-base">
											Our dedicated customer support team at Laundry Hub is here
											to assist you with any inquiries, order issues, or
											feedback to ensure a seamless and satisfying experience.
										</p>
									</div>
									<div>
										<p className="font-bold"> Feedback</p>
										<p className="text-sm md:text-base">
											Your feedback is invaluable to us at Laundry Hub as we
											strive to improve and provide the best service tailored to
											your needs.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
						<motion.div
							className="flex justify-center items-center"
							variants={itemVariants}
						>
							<motion.div
								className="w-full flex justify-end m-none"
								whileHover={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className=" md:w-[80%] bg-white rounded-lg border border-white ">
									<CardHeader>
										<CardTitle className="text-3xl font-bold  text-center">
											Get in Touch
										</CardTitle>
										<CardDescription className="font-medium text-center">
											You can reach us anytime
										</CardDescription>
									</CardHeader>
									<CardContent>
										<form className="space-y-6">
											<div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
												<div className="flex flex-col space-y-1.5">
													<Label htmlFor="first_name">First Name</Label>
													<Input
														id="first_name"
														placeholder="Your first name here"
														className="rounded-lg"
													/>
												</div>
												<div className="flex flex-col space-y-1.5">
													<Label htmlFor="last_name">Last Name</Label>
													<Input
														id="last_name"
														placeholder="Your last name here"
														className="rounded-lg"
													/>
												</div>
											</div>
											<div>
												<Label htmlFor="email">Email</Label>
												<Input
													id="email"
													placeholder="Your email here"
													className="rounded-lg"
												/>
											</div>
											<div>
												<Label htmlFor="phone">Phone Number</Label>
												<Input
													id="phone"
													placeholder="Your phone here"
													className="rounded-lg"
												/>
											</div>
											<div>
												<Label htmlFor="question">Question</Label>
												<Textarea
													name="question"
													placeholder="Your question here"
													className="rounded-lg"
												/>
											</div>
										</form>
									</CardContent>
									<CardFooter className="flex justify-end">
										<Button className="bg-blue-500 hover:bg-blue-400 hover:text-slate-200">
											Send
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</motion.section>
		</main>
	);
}
