import React from "react";

import CreateOrder from "@/features/user/order/create-order.page";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function page() {
  return (
    <main className="mx-[12%] my-[2%]">
      <div className="p-2 rounded-md bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/user/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-[#2C71F6]">
                Create Order
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="p-3 rounded-md bg-white mt-2">
        <h1 className="font-bold text-2xl">Create New Order</h1>
        <p className="text-justify text-sm font-medium">
          On this page, you can create new order members to the system by
          filling out the required details such as name, role, contact
          information, and other necessary information. Ensure that all fields
          are correctly filled out to grant the staff member access to the
          system with the appropriate permissions.
        </p>
      </div>
      <div className="mt-2 p-2 rounded-md bg-white">
        <CreateOrder />
      </div>
    </main>
  );
}
