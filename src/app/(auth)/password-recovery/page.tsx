"use client";
import { useInitPasswordRecovery } from "@/backend/queryAndMutation";
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
import { emailValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PasswordRecover = () => {
  const { toast } = useToast();
  const { mutateAsync: initPasswordRecovery, isPending } =
    useInitPasswordRecovery();
  const router = useRouter();
  
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (cookieFallback) {
      router.back();
    }
  }, [router]);

  const form = useForm<z.infer<typeof emailValidation>>({
    resolver: zodResolver(emailValidation),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof emailValidation>) {
    console.log(values.email);
    const result = await initPasswordRecovery(values.email);
    if (result) {
      toast({
        title: "Password recovery email sent",
        description:
          "If this email is registered, a recovery email has been sent to your inbox. This avoids revealing whether the email exists or not",
      });
    } else {
      toast({
        title: "Password recovery email failed",
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
        <Button type="submit" className="shad-button_primary w-full">
          {isPending ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Send Email"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordRecover;
