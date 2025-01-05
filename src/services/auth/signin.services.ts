"use server";

import { ROOT_URL } from "@/constants/constant";
import { z } from "zod";
import { cookies } from "next/headers";

const SignInSchema = z.object({
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
});

export async function signIn(prevState: unknown, form: FormData) {
  try {
    const password = form.get("password") as string;
    const email = form.get("email") as string;
    const cookieSore = await cookies();

    const formDataValue = SignInSchema.safeParse({
      password,
      email,
    });

    if (!formDataValue.success) {
      return {
        status: false,
        message: "validation errors occured !",
        errors: formDataValue.error.flatten().fieldErrors,
        fieldValues: { email, password },
      };
    }

    const res = await fetch(`${ROOT_URL}/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    cookieSore.set("AUTHORIZATION", JSON.stringify(responseData.data));

    return {
      status: true,
      message: "success sign in",
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
