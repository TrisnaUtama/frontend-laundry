"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";
import { z } from "zod";

export interface Service {
  service_id: string;
  item_type_id: string;
  name: string;
  description: string;
  price: number;
  estimated_hours: number;
  status?: boolean;
}

const ServiceSchema = z.object({
  name: z.string().min(2, { message: "name at least 2 characters long" }),
  description: z
    .string()
    .min(8, { message: "description at least 8 characters long" }),
  item_type_id: z.string().min(2, { message: "item type must selected" }),
  price: z.number().min(4, { message: "price must be filled atleast 4 digit" }),
  estimated_hours: z
    .number()
    .min(1, { message: "estimated hour must be filled atleast 1 digit" }),
});

export async function getAllService() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/services/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
    });

    const responseData = await res.json();
    console.log(responseData);

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

export async function getSpecificService(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/services/${id}`, {
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
          "something went wrong while fetching data service",
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

export async function createNewServices(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const item_type_id = form.get("item_type_id") as string;
    const price = form.get("price") as string;
    const estimated_hours = form.get("estimated_hours") as string;

    const parsedEstimatedHour = Number(estimated_hours);
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedEstimatedHour) || parsedEstimatedHour < 1) {
      return {
        status: false,
        message: "Estimated hour must be a valid number and at least 1",
      };
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 1) {
      return {
        status: false,
        message: "Price must be a valid number and at least 1",
      };
    }

    const formDataValue = ServiceSchema.safeParse({
      name,
      description,
      item_type_id,
      price: parsedPrice,
      estimated_hours: parsedEstimatedHour,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "Validation errors occurred!",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
          description,
          item_type_id,
          price,
          estimated_hours,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/services/`, {
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
          "Something went wrong while creating new data services",
      };
    }

    return {
      status: true,
      message: "Successfully created new data services",
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
      message: "Server cannot process your request",
    };
  }
}

export async function updateServices(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const item_type_id = form.get("item_type_id") as string;
    const price = form.get("price") as string;
    const estimated_hours = form.get("estimated_hours") as string;
    const id = form.get("id") as string;

    const parsedEstimatedHour = Number(estimated_hours);
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedEstimatedHour) || parsedEstimatedHour < 1) {
      return {
        status: false,
        message: "Estimated hour must be a valid number and at least 1",
      };
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 1) {
      return {
        status: false,
        message: "Price must be a valid number and at least 1",
      };
    }

    const formDataValue = ServiceSchema.safeParse({
      name,
      description,
      item_type_id,
      price: parsedPrice,
      estimated_hours: parsedEstimatedHour,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "Validation errors occurred!",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
          description,
          item_type_id,
          price,
          estimated_hours,
        },
      };
    }

    console.log(formDataValue.data);

    const res = await fetch(`${ROOT_URL}/v1/services/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${cookie.access_token}`,
      },
      body: JSON.stringify(formDataValue.data),
    });
    const responseData = await res.json();

    console.log(responseData);

    if (!res.ok) {
      return {
        status: false,
        message:
          responseData.message ||
          "Something went wrong while creating new data services",
      };
    }

    return {
      status: true,
      message: "Successfully created new data services",
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
      message: "Server cannot process your request",
    };
  }
}

export async function unactiveService(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/services/${id}`, {
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
          "something went wrong while deleting data services",
      };
    }

    return {
      status: true,
      message: "successfuly deleting data service",
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
