"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useSignInAccount } from "@/backend/queryAndMutation";
import { useAuthProvider } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { checkAuth, loading } = useAuthProvider();
  const { mutateAsync: signInUser, isPending } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if(cookieFallback){
      router.back();
    }
  }, [router]);

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    try {
      const account = await signInUser(values);
      if (!account) {
        toast({
          title: "Login failed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      const isLogin = await checkAuth();
      if (isLogin) {
        form.reset();
        router.push("/");
      } else {
        toast({
          title: "Login failed. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Form {...form}>
      <h4 className="h4-bold md:h2-bold pt-5 sm:pt-12">
        Log in to your account
      </h4>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        Welcome back! Please enter your details.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="Email" className="shad-input" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary w-full">
          {isPending || loading ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Login"
          )}
        </Button>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="text-primary-500 text-small-semibold ml-1"
          >
            Sign up
          </Link>
        </p>
        <p className="text-small-regular text-light-2 text-center mt-2">
          <Link
            href="/password-recovery"
            className="text-primary-500 text-small-semibold ml-1"
          >
            Forgot password?
          </Link>
        </p>
        <p>bhola@gmail.com</p>
      </form>
    </Form>
  );
};

export default Page;
