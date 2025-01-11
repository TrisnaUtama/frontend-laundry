"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";

export interface Address {
  user_address_id: string;
  user_id?: string;
  address: string;
  is_default: boolean;
}

export async function getUserAddressDefault(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/address/${id}`, {
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
        message: responseData.message,
      };
    }

    return {
      status: true,
      message: "success retreived data address",
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

export async function getAllUserAddress() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  const id = cookie.user.user_id;
  try {
    const res = await fetch(`${ROOT_URL}/v1/address/user/${id}`, {
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
        message: responseData.message,
      };
    }

    return {
      status: true,
      message: "success retreived all data address",
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
