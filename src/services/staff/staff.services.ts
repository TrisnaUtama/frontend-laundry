"use server";

import { ROOT_URL } from "@/constants/constant";
import { cookies } from "next/headers";
import { z } from "zod";

export interface Staff {
  user_id?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  is_verified?: boolean;
  status?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
  refresh_token?: string;
  isOnline?: boolean;
}

enum Role {
  Admin = "Admin",
  Staff = "Staff",
}

const SignUpSchema = z.object({
  name: z.string().min(2, { message: "name at least 2 characters long" }),
  password: z
    .string()
    .min(8, { message: "password at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  email: z.string().email(),
  address: z.string().min(5, { message: "address at least 8 characters long" }),
  phone_number: z
    .string()
    .min(12, { message: "phone number at least 12 digit" }),
  role: z.enum([Role.Admin, Role.Staff], { message: "role must be filled" }),
  address_id: z.string().optional(),
});

export async function getAllStaff() {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/employees/`, {
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

export async function getSpecificStaff(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/employees/${id}`, {
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
      message: "success retreived data staff",
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

export async function addNewStaff(prevState: unknown, form: FormData) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("name") as string;
    const password = form.get("password") as string;
    const email = form.get("email") as string;
    const address = form.get("address") as string;
    const phone_number = form.get("phone_number") as string;
    const role = form.get("role") as string;

    const formDataValue = SignUpSchema.safeParse({
      name,
      password,
      email,
      address,
      phone_number,
      role,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: { name, password, email, address, phone_number, role },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/employees/`, {
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
        message: responseData.message,
      };
    }

    return {
      status: true,
      message: "success add new staff",
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

export async function updateStaff(prevState: unknown, form: FormData) {
  const UpdateStaffSchema = z.object({
    name: z.string().min(2, { message: "name at least 2 characters long" }),
    password: z
      .string()
      .min(8, { message: "password at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    email: z.string().email(),
    address: z
      .string()
      .min(5, { message: "address at least 8 characters long" }),
    phone_number: z
      .string()
      .min(12, { message: "phone number at least 12 digit" }),
    role: z.enum([Role.Admin, Role.Staff], { message: "role must be filled" }),
    id_address: z.string().optional(),
  });
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const name = form.get("name") as string;
    const password = form.get("password") as string;
    const email = form.get("email") as string;
    const address = form.get("address") as string;
    const phone_number = form.get("phone_number") as string;
    const role = form.get("role") as string;
    const id = form.get("id") as string;
    const id_address = form.get("id_address") as string;

    const formDataValue = UpdateStaffSchema.safeParse({
      name,
      password,
      email,
      address,
      phone_number,
      role,
      id_address,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: {
          name,
          password,
          email,
          address,
          phone_number,
          role,
          id_address,
        },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/employees/${id}`, {
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
        message: responseData.message,
      };
    }

    return {
      status: true,
      message: "success update data staff",
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

export async function deleteStaff(id: string) {
  const cookieStore = await cookies();
  const cookiesParse = cookieStore.get("AUTHORIZATION");
  const cookie = cookiesParse ? JSON.parse(cookiesParse.value) : null;
  try {
    const res = await fetch(`${ROOT_URL}/v1/employees/${id}`, {
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
        message: responseData.message,
      };
    }

    return {
      status: true,
      message: "success delete data staff",
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
