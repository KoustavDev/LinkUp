"use client";
import { z } from "zod";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import FileUploader from "../shared/FileUploader";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthProvider } from "@/context/AuthProvider";
import { useGetUserById, useUpdateUser } from "@/backend/queryAndMutation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const UpdateUser = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user, setUser } = useAuthProvider();
  const { data: currentUser, isLoading: isLoadingUser } = useGetUserById(id);
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();
  const [isFormChanged, setIsFormChanged] = useState(false);

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: "",
      username: "",
      email: "",
      bio: "",
    },
  });

  // Watch all form fields
  const watchedValues = useWatch({
    control: form.control,
  });

  // Update form values when currentUser data is available
  useEffect(() => {
    if (currentUser) {
      form.reset({
        file: [],
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, form]);

  // Check for changes in form values
  useEffect(() => {
    if (!currentUser) return;

    const hasNameChanged = watchedValues.name !== currentUser.name;
    const hasBioChanged = watchedValues.bio !== currentUser.bio;
    const hasFileChanged = !!(watchedValues.file && watchedValues.file.length > 0);

    // If any field has changed, set isFormChanged to true
    setIsFormChanged(hasNameChanged || hasBioChanged || hasFileChanged);
  }, [watchedValues, currentUser]);

  if (isLoadingUser || !currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    try {
      const updatedUser = await updateUser({
        userId: currentUser.$id,
        name: value.name,
        bio: value.bio,
        file: value.file,
        imageUrl: currentUser.imageUrl,
        imageId: currentUser.imageId,
      });

      if (updatedUser) {
        setUser({
          ...user,
          name: updatedUser.name,
          bio: updatedUser.bio,
          imageUrl: updatedUser.imageUrl,
        });
        router.back();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex flex-1 mb-16 lg:mb-0">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <Image
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <FileUploader
                      fieldChange={field.onChange}
                      mediaURL={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate || !isFormChanged}
              >
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateUser;
