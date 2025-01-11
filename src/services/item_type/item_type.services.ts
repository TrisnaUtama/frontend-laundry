"use server";

import { ROOT_URL } from "@/constants/constant";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export interface Item_Type {
  item_type_id: string;
  name: string;
  status: boolean;
}

const ItemTypeSchema = z.object({
  name: z.string().min(2, { message: "name at least 2 characters long" }),
});

export async function getAllItemType() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/item_types/`, {
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
        message:
          responseData.message ||
          "something went wrong while fetching data services",
      };
    }

    return {
      status: true,
      message: "successfuly retreiving data services",
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

export async function getSpecificItemType(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/item_types/${id}`, {
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
        message:
          responseData.message ||
          "something went wrong while fetching data services",
      };
    }

    return {
      status: true,
      message: "successfuly retreiving data service",
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

export async function createNewItemType(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("item-name") as string;

    const formDataValue = ItemTypeSchema.safeParse({
      name,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/item_types/`, {
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
        message:
          responseData.message ||
          "something went wrong while fetching data services",
      };
    }

    return {
      status: true,
      message: "successfuly retreiving data services",
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

export async function updateItemType(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("item-name") as string;
    const id = form.get("item-id") as string;

    const formDataValue = ItemTypeSchema.safeParse({
      name,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/item_types/${id}`, {
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
        message:
          responseData.message ||
          "something went wrong while fetching data services",
      };
    }

    return {
      status: true,
      message: "successfuly retreiving data services",
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

export async function deleteItemType(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/item_types/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: false,
        message:
          responseData.message ||
          "something went wrong while deleting data item type",
      };
    }

    return {
      status: true,
      message: "successfuly deleting data item type",
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
