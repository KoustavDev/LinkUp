"use client";
import { useCreateComment } from "@/backend/queryAndMutation";
import { Models } from "appwrite";
import React, { useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

const CommentBox = ({
  postId,
  userId,
  setComments,
}: {
  postId: string;
  userId: string;
  setComments?: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}) => {
  const [comment, setComment] = useState<string>("");
  const { mutate: createComment } = useCreateComment();
  const handleComment = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    if (comment) {
      createComment(
        {
          postId: postId,
          userId: userId,
          comment: comment.trim(),
        },
        {
          onSuccess: (newComment: Models.Document | null) => {
            if (newComment) {
              setComment("");
              setComments?.((prev) => [...prev, newComment]);
            }
          },
        }
      );
    }
  };
  return (
    <div className="relative flex-1 mt-2">
      <Input
        placeholder="Write your comment..."
        className="w-full bg-zinc-900 border-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Image
        src={"/assets/icons/send.png"}
        alt="send"
        width={20}
        height={20}
        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={(e) => handleComment(e)}
      />
    </div>
  );
};

export default CommentBox;
