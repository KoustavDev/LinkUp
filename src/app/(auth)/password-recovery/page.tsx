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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { emailValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PasswordRecover = () => {
  const { toast } = useToast();
  const dialogRef = useRef<HTMLButtonElement>(null);
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
      dialogRef.current?.click();
    } else {
      toast({
        title: "Password recovery email failed",
        variant: "destructive",
      });
    }
  }
  return (
    <>
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button ref={dialogRef} className="hidden">
            Open
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="card">
          <AlertDialogHeader>
            <AlertDialogTitle>Please check your email</AlertDialogTitle>
            <AlertDialogDescription>
              A password recovery email has been sent to your inbox. Please
              check your email and follow the instructions to reset your
              password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PasswordRecover;
