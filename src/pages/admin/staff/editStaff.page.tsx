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
import {
  updateStaff,
  getSpecificStaff,
  type Staff,
} from "@/services/staff/staff.services";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  getUserAddressDefault,
  type Address,
} from "@/services/address/address.services";

export default function EditStaffForm({ id }: { id: string }) {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [staff, setStaff] = useState<Staff>();
  const [address, setAddress] = useState<Address>();
  const [state, action, pending] = useActionState(updateStaff, null);
  const { toast } = useToast();
  const router = useRouter();

  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getSpecificStaff(id);
        if (!res.status) {
          console.log(res.message);
        }
        setStaff(res.data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        console.log(error);
      }
    };
    fetchStaff();
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
        description: state.message || "Successfully add new staff",
      });

      router.push("/dashboard/admin/management-staff");
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "failed add new staff",
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
              defaultValue={staff?.name}
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
              defaultValue={staff?.email}
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
              defaultValue={staff?.phone_number}
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
                defaultValue={staff?.password}
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
            <Select value={staff?.role} name="role">
              <SelectTrigger className="font-semibold">
                <SelectValue
                  placeholder="select role"
                  className="font-normal text-gray-300"
                />
              </SelectTrigger>
              <SelectContent
                className="font-semibold"
                defaultValue={state?.fieldValues?.role || ""}
              >
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
            className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
          >
            Add Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
