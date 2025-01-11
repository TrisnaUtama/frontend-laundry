"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";
import { z } from "zod";

export interface Order {
  order_id: string;
  user_id: string;
  address_id: string;
  item_id: string;
  service_id: string;
  pickup_date: string;
  special_notes?: string;
  status: string;
}

export interface Detail_Order {
  detail_order_id: string;
  order_id: string;
  item_id: string;
  service_id: string;
  weight?: number;
  price?: number;
}

const OrderSchema = z.object({
  address_id: z.string().min(1, { message: "address must be filled" }),
  item_type_id: z.string().min(1, { message: "item type must be filled" }),
  service_id: z.string().min(1, { message: "service must be filled" }),
  pickup_date: z.string().min(8, { message: "pickup date must be filled" }),
  name: z
    .string()
    .min(8, { message: "name must be filled atleast 8 character long" }),
  special_notes: z.string().optional(),
  user_id: z.string().optional(),
  weight: z.number().optional(),
  cancellation_reason: z.string().optional(),
  status: z.string().optional(),
  order_id: z.string().optional(),
});

const CancelOrderSchema = z.object({
  order_id: z.string().min(1, { message: "Order ID must be provided" }),
  cancellation_reason: z.string().optional(),
  status: z.string().optional(),
});

export async function canceledOrder(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  if (!cookiesParse) {
    throw new Error("Authorization cookie is missing");
  }

  const cookie = JSON.parse(cookiesParse.value);

  try {
    const cancellation_reason = form.get("cancellation_reason") as string;
    const order_id = form.get("order_id") as string;
    const status = "canceled";

    const formDataValue = CancelOrderSchema.safeParse({
      order_id,
      cancellation_reason,
      status,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "Validation errors occurred!",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: { order_id, cancellation_reason, status },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/orders/${order_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
      body: JSON.stringify(formDataValue.data),
    });

    if (!res.ok) {
      const responseData = await res.json();
      return {
        status: false,
        message: responseData.message || "Error accessing the database",
      };
    }

    const responseData = await res.json();
    return { status: true, data: responseData };
  } catch (error) {
    console.error("Error in canceledOrder:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Server error occurred",
    };
  }
}

export async function getAllUserOrder() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(
      `${ROOT_URL}/v1/orders/user/${cookie.user.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${cookie.access_token}`,
        },
      }
    );

    const responseData = await res.json();
    if (!res.ok) {
      return {
        status: false,
        message: responseData.message || "error while accesing database",
      };
    }

    return {
      status: true,
      data: responseData,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
      };
    }
    return {
      status: false,
      message: "server cannot process your request",
    };
  }
}

export async function createOrder(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const user_id = cookie.user.user_id;
    const address_id = form.get("address_id") as string;
    const name = form.get("name") as string;
    const item_type_id = form.get("item_id") as string;
    const service_id = form.get("service_id") as string;
    const weightInput = form.get("weight") as string;
    const pickup_date = form.get("pickup_date") as string;
    const special_notes = form.get("notes") as string;

    const weight = weightInput ? Number(weightInput) : undefined;

    const formDataValue = OrderSchema.safeParse({
      name,
      user_id,
      address_id,
      item_type_id,
      service_id,
      weight,
      pickup_date,
      special_notes,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
          address_id,
          item_type_id,
          service_id,
          pickup_date,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
      body: JSON.stringify(formDataValue.data),
    });

    const responseData = await res.json();
    if (!res.ok) {
      return {
        status: false,
        message: responseData.message || "error while accesing database",
      };
    }

    return {
      status: true,
      data: responseData,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
      };
    }
    return {
      status: false,
      message: "server cannot process your request",
    };
  }
}

export async function getAllOrders() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
    });

    const responseData = await res.json();
    if (!res.ok) {
      return {
        status: false,
        message: responseData.message || "error while accesing database",
      };
    }

    return {
      status: true,
      data: responseData,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
      };
    }
    return {
      status: false,
      message: "server cannot process your request",
    };
  }
}
