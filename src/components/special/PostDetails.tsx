"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  useDeletePost,
  useGetPost,
  useGetUserPosts,
} from "@/backend/queryAndMutation";
import Loader from "../shared/Loader";
import Link from "next/link";
import { useAuthProvider } from "@/context/AuthProvider";
import { multiFormatDateString } from "@/lib/utils";
import PostState from "../shared/PostState";
import GridPostList from "../shared/GridPostList";
import { Models } from "appwrite";
import CommentList from "./CommentList";
import CommentBox from "./CommentBox";

const PostDetails = ({ postId }: { postId: string }) => {
  const { data: post, isPending: isLoading } = useGetPost(postId);
  const { user } = useAuthProvider();
  const { mutate: deletePost } = useDeletePost();
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const [comments, setComments] = useState<Models.Document[]>([]);
  const relatedPost = userPosts?.documents.filter(
    (postData) => postData.$id !== postId
  );
  const handleDeletePost = () => {
    deletePost({ postId: postId, imageId: post?.imageId });
    router.back();
  };
  const router = useRouter();
  useEffect(() => {
    if (post?.comments) {
      setComments(post.comments);
    }
  }, [post?.comments]);
  return (
    <div className="post_details-container mb-16 lg:mb-0">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="shad-button_ghost"
        >
          <Image
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
            priority
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>
      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card ">
          <Image
            src={post?.imageUrl}
            alt="creator"
            height={320}
            width={320}
            layout="responsive"
            className="post_details-img"
            priority
            // style={{ objectFit: "cover" }}
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                href={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <Image
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  height={32}
                  width={32}
                  className="lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  href={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <Image
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <Image
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            {comments?.length > 0 && <CommentList comments={comments} userId={user.id}/>}
            <div className="w-full">
              <PostState post={post} userId={user.id} />
              <CommentBox
                postId={post.$id}
                userId={user.id}
                setComments={setComments}
              />
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPost ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPost} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
