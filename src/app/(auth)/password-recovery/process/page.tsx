"use client";
import React, { useEffect } from "react";
import Loader from "@/components/shared/Loader";
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
import { useToast } from "@/hooks/use-toast";
import { passwordValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPassword } from "@/backend/queryAndMutation";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (cookieFallback) {
        router.back();
      }
    }, [router]);

  const form = useForm<z.infer<typeof passwordValidation>>({
    resolver: zodResolver(passwordValidation),
    defaultValues: {
      passwordNew: "",
      passwordConform: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordValidation>) {
    if (values.passwordNew !== values.passwordConform) {
      form.setError("passwordConform", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    if (!userId || !secret) {
      form.setError("passwordNew", {
        type: "manual",
        message: "Invalid user ID or token",
      });
      return;
    }
    const res = await resetPassword({
      userId,
      secret,
      password: values.passwordNew,
    });
    if (res) {
      router.push("/sign-in");
    } else {
      toast({
        title: "Password reset failed",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <h4 className="h4-bold md:h2-bold pt-5 sm:pt-12">Password Recovery</h4>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        Please enter your email address to recover your password
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="passwordNew"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary w-full">
          {isPending ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Set passowrd"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Page;
