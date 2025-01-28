"use client";
import { useGetAllUser } from "@/backend/queryAndMutation";
import React from "react";
import Loader from "./Loader";
import UserCard from "./UserCard";

const TopCreater = () => {
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetAllUser(10);
  if (isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  return (
    <div className="home-creators">
      <h3 className="h3-bold text-light-1">Top Creators</h3>
      {isUserLoading && !creators ? (
        <Loader />
      ) : (
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {creators?.documents.map((creator) => (
            <li key={creator?.$id}>
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopCreater;
