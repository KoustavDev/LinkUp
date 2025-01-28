import { useAuthProvider } from "@/context/AuthProvider";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostState from "./PostState";
import CommentBox from "../special/CommentBox";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuthProvider();
//   console.log(post);
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.creator.$id}`}>
            <Image
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
              width={48}
              height={48}
              priority
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/update-post/${post.$id}`}
          className={`${user.id !== post.$id} && 'hidden'`}
        >
          <Image
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link href={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags?.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <Image
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
          height={256}
          width={256}
          priority
        />
      </Link>
      <div className="flex flex-col gap-8">
        <PostState post={post} userId={user.id} />
        <CommentBox postId={post.$id} userId={user.id} />
      </div>
    </div>
  );
};

export default PostCard;
