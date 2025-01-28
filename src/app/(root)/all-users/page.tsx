"use client";
import { useGetAllUser, useGetUserById } from "@/backend/queryAndMutation";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import { useAuthProvider } from "@/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebouncer";
import React, { useState } from "react";

const Page = () => {
  const { user: mainUser } = useAuthProvider();
  const { data: user, isLoading: userDataLoading } = useGetUserById(mainUser.id);
  const { data, isLoading, isError } = useGetAllUser();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 1000);
  const userData = data?.documents.filter((creator) => {
    const matchesSearch = creator.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    return debouncedSearch ? matchesSearch : matchesSearch && creator.$id !== user?.$id;
  });
  const { toast } = useToast();
  if (isError) {
    toast({ title: "Something went wrong." });
    return;
  }
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">Search Users</h2>
        <Input
          type="text"
          placeholder="Search"
          className="explore-search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !data && userDataLoading && user === undefined ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {userData?.length ? (
              userData.map((creator) => (
                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                  {user && <UserCard user={creator} currentUser={user} />}
                </li>
              ))
            ) : (
              <p className="text-light-4 mt-10 text-center w-full">User not found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;
