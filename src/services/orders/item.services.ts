"use server"

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";

export interface Item {
  item_id: string;
  item_type_id: string;
  name: string;
}

export async function getAllItem() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/items/`, {
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
