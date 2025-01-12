"use client";
import Image from "next/image";
import SignInForm from "@/pages/auth/signin.page";

export default function Page() {
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 h-screen">
        {/* Image Section - Hidden on Small Screens */}
        <div className="hidden md:flex w-full h-screen bg-[#2C71F6] justify-center items-center lg:col-span-3">
          <Image
            src="/auth.png"
            width={400}
            height={400}
            alt="Authentication Illustration"
            className="object-contain"
          />
        </div>

        {/* Form Section */}
        <div className=" m-auto w-[70%] lg:col-span-2">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
            Hello There...
          </h1>
          <p className="font-semibold text-sm md:text-base">
            Protect your email and password
          </p>
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
