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
import { addNewStaff } from "@/services/staff/staff.services";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AddStaffForm() {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [state, action, pending] = useActionState(addNewStaff, null);
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
        description: state.message || "Successfully add new staff",
      });

      router.push("/dashboard/admin/people-management/staff");
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "failed add new staff",
      });
    }
  }, [state, toast, router]);

  return (
    <div className="rounded-md w-full h-[90%] bg-white border-opacity-75 mt-2 p-4">
      <h1 className="font-semibold text-lg mb-2">General Information</h1>
      <form action={action}>
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
              defaultValue={state?.fieldValues?.name || ""}
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
              defaultValue={state?.fieldValues?.email || ""}
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
              defaultValue={state?.fieldValues?.address || ""}
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
              defaultValue={state?.fieldValues?.phone_number || ""}
              className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
            />
            {renderErrorMessage("phone_number")}
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-6 mb-2">
          Security Information
        </h1>
        <div className="grid grid-cols-2 space-x-3 mt-3">
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
                defaultValue={state?.fieldValues?.password || ""}
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
          <div className="">
            <Label htmlFor="role" className="font-bold">
              Role<span className="text-red-500">*</span>
            </Label>
            <Select name="role">
              <SelectTrigger>
                <SelectValue
                  placeholder="select role"
                  className="font-normal text-gray-300"
                />
              </SelectTrigger>
              <SelectContent defaultValue={state?.fieldValues?.role || ""}>
                {["Admin", "Staff"].map((val) => (
                  <SelectItem key={val} value={val} className="font-semibold">
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderErrorMessage("role")}
          </div>
        </div>
        <div className="flex justify-end items-center mt-5 ">
          <Button
            type="submit"
            disabled={pending}
            className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
          >
            {pending ? "Loading" : "Create Staff"}
          </Button>
        </div>
      </form>
    </div>
  );
}
