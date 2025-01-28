"use client";
import { useGetFollower, useGetUserById } from "@/backend/queryAndMutation";
import React from "react";
import Loader from "../shared/Loader";
import { Models } from "appwrite";

const FollowingUser = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserById(userId);
  console.log(user);
  const { data: followerList, isPending: follwerLoading } = useGetFollower(user?.follower || []);
  console.log( followerList);
  console.log( followerList?.length);
  if (isLoading || follwerLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      {followerList &&
        followerList.map((follower: Models.Document) => (
          <p key={follower.$id}>{follower.name}</p>
        ))}
    </div>
  );
};

export default FollowingUser;
