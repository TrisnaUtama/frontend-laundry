"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";
import { z } from "zod";

export interface Payment {
  payment_id: string;
  order_id: string;
  payment_method?: string;
  total_price: string;
  payment_status: string;
}

const PaymentSchema = z.object({
  payment_id: z.string().min(1, { message: "payment ID must be provided" }),
  payment_method: z
    .string()
    .min(1, { message: "payment method must be provided" }),
  delivery_address: z
    .string()
    .min(1, { message: "delivery address  must be provided" }),
  delivery_date: z
    .string()
    .min(1, { message: "delivery address  must be provided" }),
});

export async function paidOrder(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const payment_id = form.get("id") as string;
    const payment_method = form.get("payment_method") as string;
    const delivery_address = form.get("address_id") as string;
    const delivery_date_form = form.get("delivery_date") as string;
    const delivery_date = new Date(delivery_date_form).toLocaleString();
    const formDataValue = PaymentSchema.safeParse({
      payment_id,
      payment_method,
      delivery_address,
      delivery_date,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          payment_id,
          payment_method,
          delivery_address,
          delivery_date,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/payments/user/${payment_id}`, {
      method: "PATCH",
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

export async function getAllPayment() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/payments/`, {
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

export async function getSpecificPayment(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/payments/${id}`, {
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
