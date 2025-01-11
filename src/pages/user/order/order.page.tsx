"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllUserAddress,
  type Address,
} from "@/services/address/address.services";
import {
  getAllItemType,
  type Item_Type,
} from "@/services/item_type/item_type.services";
import {
  createOrder,
  getAllUserOrder,
  type Order,
} from "@/services/orders/order.services";
import {
  getAllDetailOrder,
  type Detail_Order,
} from "@/services/orders/detail-order.services";
import {
  getAllService,
  type Service,
} from "@/services/services/services.services";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAllItem, type Item } from "@/services/orders/item.services";
import { Badge } from "@/components/ui/badge";
import CanceledOrder from "./cancel-order.page";
import {
  paidOrder,
  getSpecificPayment,
  type Payment,
} from "@/services/payment/payment.services";

export default function OrdersPage() {
  const [state, action, pending] = useActionState(paidOrder, null);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemTypes, setItemType] = useState<Item_Type[]>([]);
  const [items, setItem] = useState<Item[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detail_orders, setDetailOrders] = useState<Detail_Order[]>([]);
  const [address, setAddress] = useState<Address[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [order, setSelectedOrder] = useState<string>("");
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
    const fetch = async () => {
      const res_services = await getAllService();
      if (!res_services.status) {
        setServices(res_services.message);
      }
      setServices(res_services.data);
      const res_item = await getAllItemType();
      if (!res_item.status) {
        setItemType(res_item.message);
      }
      setItemType(res_item.data);
      const res_address = await getAllUserAddress();
      if (!res_address.status) {
        setAddress(res_address.message);
      }
      setAddress(res_address.data);
      const res_orders = await getAllUserOrder();
      if (!res_orders.status) {
        setOrders(res_orders.message);
      }
      setOrders(res_orders.data);
      const res_items = await getAllItem();
      if (!res_items.status) {
        setItem(res_items.message);
      }
      setItem(res_items.data);
      const res_detailOrder = await getAllDetailOrder();
      if (!res_detailOrder.status) {
        setDetailOrders(res_detailOrder.message);
      }
      setDetailOrders(res_detailOrder.data);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (state?.status === true) {
      toast({
        variant: "success",
        title: "Success",
        description: state.message || "Successfully create new Order",
      });

      router.push("/dashboard/user/");
    } else if (state?.status === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message || "failed create new Order",
      });
    }
  }, [state, toast, router]);

  const handleOrderDelete = (order: string) => {
    setSelectedOrder(order);
    setIsOpen(!isOpen);
  };

  const handleClickOrder = async (id: string) => {
    try {
      const res = await getSpecificPayment(id);
      if (!res.status) {
        setSelectedPayment(res.message);
      }
      setSelectedPayment(res.data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      console.log("error while processing payment ");
    }
  };

  return (
    <div className=" mb-[10%]">
      <CanceledOrder isOpen={isOpen} setIsOpen={setIsOpen} id={order} />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-[80%] col-span-2 mt-2 p-2 rounded-md bg-white overflow-y-auto">
          <h1 className="text-xl font-bold">Order Details</h1>
          {orders.map((order) => (
            <Card
              onClick={() => handleClickOrder(order.order_id)}
              key={order.item_id}
              className="hover:cursor-pointer mt-3 grid grid-cols-4 gap-4 p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white"
            >
              <CardHeader className="flex justify-center items-center col-span-1 border-r border-gray-300">
                <Image src="/hanger.png" width={50} height={50} alt="hanger" />
              </CardHeader>
              <CardContent className="col-span-2 flex flex-col justify-center space-y-2">
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-lg ">
                    {items
                      .filter((val) => val.item_id === order.item_id)
                      .map((val) => val.name)}
                  </p>
                  <p className="font-semibold text-[1rem] ">
                    {items
                      .filter((val) => val.item_id === order.item_id)
                      .flatMap((val) =>
                        itemTypes
                          .filter(
                            (type) => type.item_type_id === val.item_type_id
                          )
                          .map((type) => type.name)
                      )
                      .join(", ")}
                  </p>
                  <p className="font-semibold text-[1rem] ">
                    {services
                      .filter((val) => val.service_id === order.service_id)
                      .map((val) => val.name)}
                  </p>
                  <p className="text-sm font-semibold">
                    {address
                      .filter(
                        (val) =>
                          val.user_address_id === order.address_id &&
                          val.address
                      )
                      .map((val) => val.address)}
                  </p>
                  <p className="text-sm font-semibold">
                    {new Date(order.pickup_date).toLocaleString()}
                  </p>
                  {order.special_notes && (
                    <p className="text-sm font-normal mb-5">
                      {order.special_notes}
                    </p>
                  )}
                  {order.status === "pending" && (
                    <Badge
                      onClick={() => handleOrderDelete(order.order_id)}
                      variant="pending"
                      className="font-bold"
                    >
                      Cancel Order
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardContent className="flex whitespace-nowrap justify-center items-center">
                <Badge variant="on_proggres">
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-2 p-2 rounded-md h-[67%] bg-white">
          <h1 className="font-bold text-xl">Payment Status</h1>
          <h1 className="font-bold text-sm mt-5 mb-3">Delivery Options</h1>
          <form action={action}>
            <Select name="address_id">
              <SelectTrigger>
                <SelectValue
                  placeholder="Delivery to Home"
                  className="font-normal text-gray-300"
                />
              </SelectTrigger>
              <SelectContent
                defaultValue={String(
                  state?.fieldValues?.delivery_address || ""
                )}
              >
                {address.map((val) => (
                  <SelectItem
                    key={val.user_address_id}
                    value={val.user_address_id}
                    className="font-semibold"
                  >
                    {val.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderErrorMessage("delivery_address")}
            <Label htmlFor="delivery_date">Delivery Date</Label>
            <input
              name="delivery_date"
              type="datetime-local"
              className="placeholder:text-sm w-full h-10 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
            {renderErrorMessage("delivery_date")}

            <h1 className="font-bold text-sm mt-3 mb-3">Payment Detail</h1>
            <div className="rounded-lg bg-blue-500 p-5">
              <div className="grid grid-cols-2 font-semibold text-sm text-white">
                <p>item weight : </p>
                <p className="flex justify-end items-center">
                  {detail_orders
                    .filter((val) => val.order_id === selectedPayment?.order_id)
                    .map((detail) => detail.weight)}
                  kg
                </p>
              </div>
              <div className="grid grid-cols-2 font-semibold text-sm text-white">
                <p>Services Price : </p>
                <p className="flex justify-end items-center">
                  Rp.
                  {orders
                    .filter((val) => val.order_id === selectedPayment?.order_id)
                    .flatMap((val) =>
                      services
                        .filter(
                          (service) => service.service_id === val.service_id
                        )
                        .map((val) => val.price)
                    )
                    .join(", ")}
                </p>
              </div>
              <div className="grid grid-cols-2 font-semibold text-sm text-white">
                <p>Total Price : </p>
                <p className="flex justify-end items-center">
                  Rp.{selectedPayment?.total_price}
                </p>
              </div>
            </div>

            <Select name="payment_method">
              <SelectTrigger className="mt-3">
                <SelectValue
                  placeholder="Payment Method"
                  className="font-normal text-gray-300"
                />
              </SelectTrigger>
              <SelectContent
                defaultValue={String(state?.fieldValues?.payment_method || "")}
              >
                {["transfer", "cod"].map((val) => (
                  <SelectItem key={val} value={val} className="font-semibold">
                    {val.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderErrorMessage("payment_method")}

            <input
              type="hidden"
              name="id"
              value={selectedPayment?.payment_id}
            />
            <div className="grid">
              <Button
                disabled={
                  selectedPayment?.payment_status === "pending" || pending
                }
                className={`mt-3 bg-blue-500 transition-colors duration-300 hover:bg-blue-400 text-white font-semibold ${
                  pending && "animate-pulse"
                }`}
              >
                {selectedPayment?.payment_status === "waiting_for_payment"
                  ? "Paid"
                  : "Order Still In Progress"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
