import { baseUrl } from "../actions/baseurl";

export const signinUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const data = await fetch(`${baseUrl}/auth/signin`, {
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
    const user = res.data && res.token;
    if (data.status === 200 || res.ok) {
      return {
        success: "Login successful!",
        user,
        res,
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
    return {
      error: "Something went wrong.",
    };
  }
};
