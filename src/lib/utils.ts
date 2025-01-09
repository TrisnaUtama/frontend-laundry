import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkTokenExpiry(token: string) {
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;

    return {
      isExpired,
      expiresIn: decoded.exp - currentTime,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return {
      isExpired: true,
      expiresIn: 0,
    };
  }
}
