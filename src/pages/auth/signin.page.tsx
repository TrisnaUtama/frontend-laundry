"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { signIn } from "@/services/auth/signin.services";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [state, action, pending] = useActionState(signIn, undefined);
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
    if (state?.status) {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully signed in",
      });
      const userRole = state?.data?.data?.user?.role;
      if (userRole) {
        if (userRole === "Admin") {
          router.push("/dashboard/admin/");
        } else if (userRole === "Staff") {
          router.push("/dashboard/staff/");
        } else if (userRole === "User") {
          router.push("/dashboard/user/");
        }
      }
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "Sign in failed",
      });
    }
  }, [state, toast, router]);

  return (
    <form action={action} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="email" className="font-bold">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          placeholder="your email here..."
          id="email"
          name="email"
          defaultValue={state?.fieldValues?.email || ""}
          className="w-full border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
        />
        {renderErrorMessage("email")}
      </div>

      <div>
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
            className="w-full border-input font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
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
          <Link
            href="#"
            className="flex justify-end mt-1 text-[13px] font-bold transition-colors duration-300 hover:text-gray-600"
          >
            forgot password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className={`w-full font-semibold rounded-xl bg-[#2C71F6] transition-colors duration-300 hover:bg-[#2c6ff6e0] ${
            pending && "transition-transform animate-pulse duration-500"
          }`}
        >
          {pending ? "Loading" : "Sign In"}
        </Button>
        <p className="text-[13px] font-bold mt-2 text-center">
          don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="underline text-[13px] transition-colors duration-300 text-[#2C71F6] hover:text-[#2c6ff6e0]"
          >
            sign up here
          </Link>
        </p>
      </div>
    </form>
  );
};
