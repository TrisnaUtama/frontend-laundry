import { useActionState, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import {
  getAllItemType,
  createNewItemType,
  type Item_Type,
} from "@/services/item_type/item_type.services";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateItemTypeForm({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [state, action, pending] = useActionState(createNewItemType, null);
  const { toast } = useToast();
  const router = useRouter();

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

      router.refresh();
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "failed add new staff",
      });
    }
  }, [state, toast, router]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="">
        <AlertDialogTitle className="font-bold block text-center">
          Create New Item Type
        </AlertDialogTitle>
        <form action={action}>
          <Label htmlFor="item-name" className="font-bold">
            Name<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
            placeholder="ex: Jeans, Clothes, Bed Cover"
            type="text"
            name="item-name"
            defaultValue={state?.fieldValues?.name || ""}
          />
          {renderErrorMessage("name")}
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={pending}
              className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
