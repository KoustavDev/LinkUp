"use client";

import { z } from "zod";
import { Models } from "appwrite";
import Loader from "../shared/Loader";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploader from "../shared/FileUploader";
import { postValidation } from "@/lib/validation";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthProvider } from "@/context/AuthProvider";
import { useCreatePost, useUpdatePost } from "@/backend/queryAndMutation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthProvider();
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const {mutate: updatePost, isPending: isUpdating} = useUpdatePost();
  const [isChanged, setIsChanged] = useState(false); // Track if values have changed

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const { control, handleSubmit } = form;

  // Watch form fields for changes
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (action === "Update" && post) {
      // Compare current values with initial post values
      const initialValues = {
        caption: post.caption,
        location: post.location,
        tags: post.tags.join(","),
      };
      const isDifferent =
        watchedValues.caption !== initialValues.caption ||
        watchedValues.location !== initialValues.location ||
        watchedValues.tags !== initialValues.tags;

      setIsChanged(isDifferent);
    }
  }, [watchedValues, post, action]);

  async function onSubmit(values: z.infer<typeof postValidation>) {
    if (action === "Create") {
      const newPost = await createPost({ ...values, userId: user.id });
      if (newPost) {
        router.push("/");
      } else {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
    } else {
      // console.log("Updating post with values:", values);
      if (post) {
        const updatedPost = updatePost({
          ...values,
          postId: post?.$id,
          imageId: post?.imageId,
          imageUrl: post?.imageUrl,
        });
        if (updatedPost !== null) {
          router.push(`/posts/${post.$id}`);
        } else {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="shadcn"
                  {...field}
                  className="shad-textarea custom-scrollbar"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaURL={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma &quot; , &quot;)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Art, Expression, Learn"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end mt-7">
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
            disabled={
              action === "Update"
                ? !isChanged || isCreating || isUpdating
                : isCreating || isUpdating
            }
          >
            {isCreating || isUpdating ? <Loader /> : `${action} post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
