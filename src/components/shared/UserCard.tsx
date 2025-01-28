import { Models } from "appwrite";
import Image from "next/image";
import React from "react";
import FollowSystum from "./FollowSystum";
import { Button } from "../ui/button";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

const UserCard = ({
  user,
  currentUser,
}: {
  user: Models.Document;
  currentUser: Models.Document;
}) => {
  const router = useRouter();
  return (
    <>
      <div className="user-card">
        <Image
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          height={56}
          width={56}
          className="rounded-full cursor-pointer"
          onClick={() => router.push(`/profile/${user.$id}`)}
        />

        <div
          className="flex-center flex-col gap-1 cursor-pointer"
          onClick={() => router.push(`/profile/${user.$id}`)}
        >
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
        {currentUser ? (
          <FollowSystum currentUser={currentUser} targetUser={user} />
        ) : (
          <Button type="button" size="sm" className="shad-button_primary px-5">
            <Loader />
          </Button>
        )}
      </div>
    </>
  );
};

export default UserCard;
