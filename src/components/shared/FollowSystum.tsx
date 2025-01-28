"use client";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useFollow, useUnfollow } from "@/backend/queryAndMutation";
import Loader from "./Loader";

type FollowSystumProps = {
  currentUser: Models.Document;
  targetUser: Models.Document;
};

const FollowSystum = ({ currentUser, targetUser }: FollowSystumProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const { mutate: follow, isPending: followPending } = useFollow();
  const { mutate: unFollow, isPending: unFollowPending } = useUnfollow();

  useEffect(() => {
    const followingUserIds:string[] = currentUser.following || [];
    const followerUserIds:string[] = currentUser.follower || [];
    setIsFollowing(followingUserIds.includes(targetUser.$id));
    setIsFollower(followerUserIds.includes(targetUser.$id));
  }, [currentUser, targetUser]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    if (isFollowing) {
      unFollow({ user: currentUser, follower: targetUser });
    } else {
      follow({ user: currentUser, follower: targetUser });
    }
  };

  const btnText = isFollowing
    ? "Unfollow"
    : isFollower
    ? "Follow Back"
    : "Follow";

  return (
    <Button
      onClick={handleFollowToggle}
      size="sm"
      className="shad-button_primary px-5"
      disabled={followPending || unFollowPending}
    >
      {followPending || unFollowPending ? <Loader /> : btnText}
    </Button>
  );
};

export default FollowSystum;
