"use server";

import { RegistrationSchema, LoginSchema, activateASchema } from "@/schemas";
import * as z from "zod";
import { cookies } from "next/headers";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { jwtDecode } from "jwt-decode";
import { UserDetails } from "@/types";
import Calls from "./calls";

const cookie = cookies();
const BaseUrl =
  process.env.BASEURL ?? "https://traverse-pgpw.onrender.com/api/v1";

const $http = Calls(BaseUrl);

export const register = async (values: z.infer<typeof RegistrationSchema>) => {
  const validatedFields = RegistrationSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your input.",
    };
  }
  try {
    const res = await $http.post("/auth/signup", values);
    console.log("Registration successful:", res.data);
    if (res?.status === 201) {
      return {
        success: "Account created successfully, check your email!",
      };
    }
  } catch (e: any) {
    console.log("signup call error from api call", e);
    if (e?.response?.status === 400) {
      return {
        error: "user already exist",
      };
    } else {
      return {
        error: "An error occurred. Please try again later.",
      };
    }
  }
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Login Failed. Please check your email and password.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const data = await fetch(`${BaseUrl}/auth/signin`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        credentials: "include",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const res = await data.json();

    if (data.status === 200 || res.ok) {
      cookie.set("access_token", res.token, {
        maxAge: 60 * 60 * 24 * 1, // 1 day
        httpOnly: true,
        path: "/",
        priority: "high",
      });

      console.log(res.data);

      const user = {
        id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        companyName: res.data.user.companyName,
        website: res.data.user.website,
        role: res.data.user.role,
        // createdAt: res.user.createdAt,
      };

      cookie.set("user", JSON.stringify(user), {
        maxAge: 60 * 60 * 24 * 1, // 1 day
        httpOnly: true,
        path: "/",
        priority: "high",
      });

      const decodedToken = jwtDecode(res.token) as UserDetails;
      if (decodedToken) {
        const userId = {
          UserId: decodedToken.UserId,
          token: res.token,
        };
        cookie.set("userId", JSON.stringify(userId), {
          maxAge: 60 * 60 * 24 * 1, // 1 day
          path: "/",
          priority: "high",
        });
      }

      return {
        user,
        success: "Login successful!",
        redirect: DEFAULT_LOGIN_REDIRECT,
      };
    }
    if (data.status === 400) {
      return {
        error: "Email or Phone number already exist",
      };
    }
    if (data.status === 404) {
      return {
        error: "User not found, sign up instead!",
      };
    }
    if (data.status === 500) {
      return {
        error: "Something went wrong.",
      };
    }

    return {
      error: res.message,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong.",
    };
  }
};

export const activateUser = async (values: z.infer<typeof activateASchema>) => {
  const validatedFields = activateASchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your input.",
    };
  }

  try {
    const res = await $http.post("/auth/activate", values);

    if (res?.status === 200) {
      cookie.set("activation_token", res.data.token, {
        maxAge: 60 * 60 * 24 * 1, // 1 day
        httpOnly: true,
        path: "/",
        priority: "high",
      });
      return {
        success: "Account created successfully, check your email!",
      };
    }
  } catch (e: any) {
    console.log("Activate call error from API call", e);
    if (e?.response?.status === 401) {
      return { error: "Invalid license." };
    } else if (e?.response?.status === 404) {
      return { error: "Unable to activate. License not found." };
    } else if (e?.response?.status === 500) {
      return { error: "Internal server error" };
    } else {
      return {
        error:
          e?.response?.data ??
          "Unknown error occurred. Please try again later.",
      };
    }
  }
};
