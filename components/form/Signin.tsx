/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useTransition, useEffect } from "react";
import { setCookie } from "cookies-next";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { FormInput } from "../ui/FormInput";
import { cn } from "@/utils";
import FormError from "./Error";
import FormSuccess from "./Success";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useStateCtx } from "@/context/StateCtx";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Eye, EyeSlash } from "iconsax-react";
import { signIn } from "next-auth/react";
import { useToast } from "../ui/use-toast";

const SigninForm = () => {
  const router = useRouter();
  const { setOTPModal } = useStateCtx();

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();
  const [defaultInpTypeNew, setDefaultInpTypeNew] = useState<
    "password" | "text"
  >("password");

  const [isLoading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then(async (data) => {
        setSuccess(data?.success);
        setError(data?.error);
        const loginva = JSON.stringify(values);
        toast({
          title: data.success ? "Login successful" : "Authentication failed",
          description: data.error ? error : success,
        });
        await signIn("credentials", { loginva, redirect: false });
        if (data?.success) {
          setTimeout(() => {
            setSuccess("Redirecting....");
          }, 1000);
          setTimeout(() => {
            router.push(DEFAULT_LOGIN_REDIRECT);
          }, 2000);
        }
      });
    });
  };
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);
  return (
    <div
      className="relative py-4 md:py-6 rounded-[16px] bg-white transition-colors duration-500
     dark:text-white dark:bg-primary px-4 sm:px-6 z-20 w-full max-w-[600px] mx-auto"
    >
      <h1 className=" text-2xl lg:text-[36px] text-[#1B0354]  font-bold w-full  mb-2 dark:text-white">
        Login Into Account
      </h1>

      <p className="text-xs md:text-sm lg:text-[15px] text-[#6B7B8F]  mb-4 lg:mb-4 text-start ">
        Signin into your account and enjoy the ride with Traverse
      </p>

      <Form {...form}>
        <form
          action=""
          className="flex flex-col mt-4 z-10 gap-y-2 md:gap-y-6 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold "> Email Adress</FormLabel>
                <FormControl>
                  <div className="flex items-center w-full relative">
                    <FormInput
                      disabled={isLoading}
                      type="email"
                      {...field}
                      placeholder="Enter Email Address"
                      className=" w-full text-black h-[45px] sm:h-[56px] border text-md font-medium rounded-md focus-visible:ring-primary outline-none pr-10 sm:pr-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold ">Password</FormLabel>
                <FormControl>
                  <div className="flex w-full relative items-center">
                    <FormInput
                      disabled={isLoading}
                      {...field}
                      type={defaultInpTypeNew}
                      name="password"
                      placeholder="Enter Password"
                      className=" w-full text-black h-[45px] sm:h-[56px] text-md border font-medium rounded-md 
                      focus-visible:ring-primary bg-none outline-none pr-10 sm:pr-9"
                    />
                    <span className="absolute right-4 sm:right-2 h-4 w-4 sm:w-6 sm:h-6 sm:p-[2px]">
                      {defaultInpTypeNew === "text" ? (
                        <Eye
                          className="w-full h-full"
                          color="#777"
                          onClick={() => setDefaultInpTypeNew("password")}
                        />
                      ) : (
                        <EyeSlash
                          className="w-full h-full"
                          color="#777"
                          onClick={() => setDefaultInpTypeNew("text")}
                        />
                      )}
                    </span>
                  </div>
                </FormControl>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="mb-4 text-xs ">
                      Forgot password?{" "}
                      <Link
                        href="/auth/forgetpassword"
                        className="text-primary font-medium"
                      >
                        Reset
                      </Link>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mb-4 text-xs"
                    onClick={() => setOTPModal(true)}
                  >
                    Verify Account
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex relative items-center [perspective:300px] transform-gpu max-sm:w-full">
            <Button
              disabled={isLoading}
              className={cn(
                "w-full rounded-md my-3",
                isLoading ? "[&>div>span]:opacity-0" : ""
              )}
              type="submit"
              spinnerColor="#fff"
            >
              Log in
            </Button>
            {isLoading && (
              <div className="button--loader absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        </form>
      </Form>
      <span className="text-xs lg:text-sm text-center text-gray-500 mx-auto w-full relative block mt-2">
        Don&lsquo;t have an Account?
        <Link href="/auth/signup" className="text-[#352DC8]">
          Signup
        </Link>
      </span>
    </div>
  );
};

export default SigninForm;
