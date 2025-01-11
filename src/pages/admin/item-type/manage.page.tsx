import { useActionState, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import {
  deleteItemType,
  getAllItemType,
  getSpecificItemType,
  type Item_Type,
  updateItemType,
} from "@/services/item_type/item_type.services";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function UpdateItemTypeForm({
  isOpen,
  setIsOpen,
  id,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
}) {
  const [state, action, pending] = useActionState(updateItemType, null);
  const [itemType, setItemType] = useState<Item_Type>();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchItemType = async () => {
      const res = await getSpecificItemType(id);
      if (!res.status) {
        setItemType(res.message);
      } else {
        setItemType(res.data);
      }
    };
    fetchItemType();
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
        description: state.message || "Successfully update new staff",
      });

      router.refresh();
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "failed update new staff",
      });
    }
  }, [state, toast, router]);

  const handleDelete = async (id: string) => {
    const result = await deleteItemType(id);

    if(result.status){
      toast({
        variant: "success",
        title: "Success",
        description: result.message || "Successfully delete data item type ",
      });
    }else{
      toast({
        variant: "destructive",
        title: "Failed",
        description: result.message || "failed while delete data item type ",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="">
        <AlertDialogTitle className="font-bold block text-center">
          Manage Item Type
        </AlertDialogTitle>
        <form action={action}>
          <input type="hidden" name="item-id" value={id} />
          <Label htmlFor="item-name" className="font-bold">
            Name<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-full border-input placeholder:font-normal font-semibold shadow-none focus:ring-1 focus:ring-ring focus:outline-none focus:border-ring"
            placeholder="ex: Jeans, Clothes, Bed Cover"
            type="text"
            name="item-name"
            defaultValue={itemType?.name || ""}
          />
          {renderErrorMessage("name")}
          <AlertDialogFooter className="mt-5 grid grid-cols-2">
            <AlertDialogCancel
              onClick={() => handleDelete(id)}
              className="font-semibold text-white hover:text-gray-100 bg-red-500 hover:bg-red-400 block"
            >
              Delete
            </AlertDialogCancel>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={pending}
                className="font-semibold bg-[#2C71F6] hover:bg-[#2c6ff6e0]"
              >
                Continue
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
