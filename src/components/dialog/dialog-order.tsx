import type React from "react";
import type { Order } from "@/services/orders/order.services";
import {
  PackageOpen,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  Clock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useService } from "@/hooks/use-services";
import { useItem } from "@/hooks/use-item";
import { Badge } from "@/components/ui/badge";
import { useAddress } from "@/hooks/use-address";
import { usePayment } from "@/hooks/use-payment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ManageOrderDialog from "./update-status";

interface OrderDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const DialogOrder: React.FC<OrderDialogProps> = ({
  order,
  onClose,
  isOpen,
}) => {
  const services = useService();
  const item = useItem();
  const payments = usePayment();
  const address = useAddress(order.user_id);

  const [isOpenManageDialog, setIsOpenManageDialog] = useState<boolean>(false);
  const [typeUpdateStatus, setTypeUpdateStatus] = useState<string>("");

  const payment = payments.find((val) => val.order_id === order.order_id);
  const orderItem = item.find((val) => val.item_id === order.item_id);
  const service = services.find((val) => val.service_id === order.service_id);
  const pickupAddress = address.find(
    (val) => val.user_address_id === order.address_id
  );
  const deliveryAddress = address.find(
    (val) => val.user_address_id === order.delivery_address
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpdateStatus = (type: string) => {
    setIsOpenManageDialog(!isOpenManageDialog);
    setTypeUpdateStatus(type);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="text-xl">Order Details</AlertDialogTitle>
          <AlertDialogCancel className="hover:bg-gray-100">×</AlertDialogCancel>
        </div>

        {/* Main Content */}
        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Order Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium">{orderItem?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {order.special_notes}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="on_proggres">{order.status}</Badge>
                <Badge variant="secondary">{service?.name}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <PackageOpen className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-xs text-gray-600">
                    {new Date(order.pickup_date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Delivery</p>
                  <p className="text-xs text-gray-600">
                    {order.delivery_date
                      ? new Date(order.delivery_date).toLocaleString()
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Pickup Address</p>
                  <p className="text-xs text-gray-600">
                    {pickupAddress?.address}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-xs text-gray-600">
                    {deliveryAddress?.address
                      ? deliveryAddress.address
                      : "Not Scheduled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-gray-600">Payment Method</p>
                    <p className="text-sm font-medium">
                      {payment?.payment_method || "Not selected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <div>
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-sm font-medium">
                      {payment?.total_price
                        ? formatCurrency(Number(payment.total_price))
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {order.status === "pending" ? (
            <div className="flex justify-end items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => handleUpdateStatus("reject")}
              >
                Reject Order
              </Button>
              <Button
                onClick={() => handleUpdateStatus("update")}
                className="bg-blue-500 hover:bg-blue-400 transition-colors duration-300 text-white font-semibold"
              >
                Received Order
              </Button>
            </div>
          ) : order.status !== "canceled" ? (
            <div className="flex justify-end items-center gap-2">
              <Button
                onClick={() => handleUpdateStatus("update")}
                className="bg-blue-500 hover:bg-blue-400 transition-colors duration-300 text-white font-semibold"
              >
                Update Status
              </Button>
            </div>
          ) : null}
        </div>
      </AlertDialogContent>

      <ManageOrderDialog
        type={typeUpdateStatus}
        id={order.order_id}
        isOpen={isOpenManageDialog}
        setIsOpen={setIsOpenManageDialog}
      />
    </AlertDialog>
  );
};

export default DialogOrder;
