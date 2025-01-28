"use client";
import { useLikeComment } from "@/backend/queryAndMutation";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useState } from "react";

const CommentLike = ({
  comment,
  userId,
}: {
  comment: Models.Document;
  userId: string;
}) => {
  const likedUsers = comment.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likedUsers);
  const { mutate: likeComment } = useLikeComment();

  const handleLike = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    comment: Models.Document
  ) => {
    e.stopPropagation();
    const isLiked = likes.includes(userId);
    const updatedLikes = isLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    likeComment({ commentId: comment.$id, userId: updatedLikes });
  };
  return (
    <div className="flex items-center gap-4">
      <Image
        src={
          likes.includes(userId)
            ? `/assets/icons/liked.svg`
            : `/assets/icons/like.svg`
        }
        alt="like"
        width={20}
        height={20}
        className="cursor-pointer"
        onClick={(e) => handleLike(e, comment)}
      />
      <span className="small-medium lg:base-medium">
        {likes.length}
      </span>
    </div>
  );
};

export default CommentLike;
