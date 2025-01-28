"use client";
import { useGetUserById } from "@/backend/queryAndMutation";
import React from "react";
import Loader from "../shared/Loader";
import { useAuthProvider } from "@/context/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FollowListBtn from "../shared/FollowListBtn";
import FollowSystum from "../shared/FollowSystum";

interface StabBlockProps {
  value: string | number;
  label: string;
}

export const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = ({ userId }: { userId: string }) => {
  const { user } = useAuthProvider();
  const { data: userData } = useGetUserById(userId);
  const { data: currentData } = useGetUserById(user.id);
  const pathname = usePathname();
  if (!userData || !currentData)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div>
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <Image
            src={userData.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            width={112}
            height={112}
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {userData.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{userData.username}
              </p>
            </div>

            <div className="flex gap-0 md:gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userData.posts.length} label="Posts" />
              <FollowListBtn text="Followers" data={userData.follower} />
              <FollowListBtn text="Following" data={userData.following} />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {userData.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== userData.$id && "hidden"}`}>
              <Link
                href={`/update-profile/${userData.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== userData.$id && "hidden"
                }`}
              >
                <Image
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === userId && "hidden"}`}>
              <FollowSystum currentUser={currentData} targetUser={userData} />
            </div>
          </div>
        </div>
      </div>

      {userData.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            href={`/profile/${userId}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${userId}` && "!bg-dark-3"
            }`}
          >
            <Image
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            href={`/profile/${userId}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${userId}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <Image
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      {/* <Routes>
        <Route
          index
          element={<GridPostList posts={userData.posts} showUser={false} />}
        />
        {userData.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet /> */}
    </div>
  );
};

export default Profile;
