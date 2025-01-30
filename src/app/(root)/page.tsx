"use client";
import React, { useEffect } from "react";
import {
  useGetAllUser,
  useGetInfinitePosts,
  useGetUserById,
} from "@/backend/queryAndMutation";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useAuthProvider } from "@/context/AuthProvider";
import { useInView } from "react-intersection-observer";
import SkeletonPost from "@/components/shared/Skeleton-post";

export default function Page() {
  const { ref, inView } = useInView();
  const { user: mainUser } = useAuthProvider();
  const { data: user, isLoading: userDataLoading } = useGetUserById(
    mainUser.id
  );

  const {
    data: InfinitePosts,
    fetchNextPage,
    hasNextPage,
    isFetching: isPostLoading,
    isError: isErrorPosts,
  } = useGetInfinitePosts();

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetAllUser(10);

  const userData = creators?.documents.filter(
    (creator) => creator.$id !== user?.$id
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isErrorPosts || isErrorCreators) {
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
    <div className="flex flex-1 mb-16">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !InfinitePosts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {InfinitePosts?.pages.map((page, pageIndex) =>
                page?.documents.map(
                  (post: Models.Document) =>
                    post && (
                      <li
                        key={`${pageIndex}-${post.$id}`}
                        className="flex justify-center w-full"
                      >
                        <PostCard post={post} />
                      </li>
                    )
                )
              )}
            </ul>
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <SkeletonPost />
            </div>
          )}
        </div>
      </div>

      <div className="fixed top-0 right-0 h-full">
        <div className="home-creators">
          <h3 className="h3-bold text-light-1">Top Creators</h3>
          {isUserLoading && userDataLoading && !creators && !user ? (
            <Loader />
          ) : (
            <ul className="grid 2xl:grid-cols-2 gap-6">
              {userData?.map((creator) => (
                <li key={creator?.$id}>
                  {user && <UserCard user={creator} currentUser={user} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
