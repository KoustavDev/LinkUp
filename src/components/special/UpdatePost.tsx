"use client";
import { useGetPost } from "@/backend/queryAndMutation";
import PostForm from "@/components/forms/PostForm";
import Image from "next/image";
import React from "react";
import Loader from "../shared/Loader";

const UpdatePost = ({ id }: { id: string }) => {
  const { data: post, isPending } = useGetPost(id);
  if (isPending) return <Loader />;
  return (
    <div className="flex flex-1 mb-16 lg:mb-0">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <Image
            src={"/assets/icons/add-post.svg"}
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm post={post} action="Update" />
      </div>
    </div>
  );
};

export default UpdatePost;
