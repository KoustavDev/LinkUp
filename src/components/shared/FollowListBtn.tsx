import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StatBlock } from "../special/Profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetFollower } from "@/backend/queryAndMutation";
import Loader from "./Loader";
import { Models } from "appwrite";
import { Button } from "../ui/button";
import Link from "next/link";

function FollowerListItem({ followe }: { followe: Models.Document }) {
  return (
    <Link href={`/profile/${followe.$id}`} className="flex items-center space-x-4 p-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={followe.imageUrl} alt={followe.name} />
        <AvatarFallback>{followe.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="flex-grow">{followe.name}</span>
    </Link>
  );
}

const FollowListBtn = ({ text, data }: { text: string; data: string[] }) => {
  const { data: followerList, isLoading: follwerLoading } = useGetFollower(
    data || []
  );
  if (follwerLoading) {
    return <Loader />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <StatBlock value={data.length} label={text} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black">
        <DropdownMenuLabel>{text}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {followerList?.map((follower) => (
            <FollowerListItem key={follower.$id} followe={follower} />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FollowListBtn;
