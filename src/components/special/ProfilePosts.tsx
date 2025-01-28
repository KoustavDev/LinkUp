"use client";
import { useGetUserById } from "@/backend/queryAndMutation";
import React from "react";
import GridPostList from "../shared/GridPostList";
import Loader from "../shared/Loader";

const ProfilePosts = ({
  id,
  showLikedPost,
}: {
  id: string;
  showLikedPost: boolean;
}) => {
  const { data: userData } = useGetUserById(id);
  console.log(userData?.emailVerification);
  if (!userData)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  if (showLikedPost) {
    return (
      <section>
        {userData.liked.length === 0 && (
          <p className="text-light-4">No liked posts</p>
        )}
        <GridPostList posts={userData.liked} showStats={false} />
      </section>
    );
  } else {
    return <GridPostList posts={userData.posts} showUser={false} />;
  }
};

export default ProfilePosts;
