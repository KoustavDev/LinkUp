'use client'
import { useGetCurrentUser } from '@/backend/queryAndMutation';
import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Models } from 'appwrite';
import Image from 'next/image';
import React from 'react'

const Page = () => {
  const {data: user} = useGetCurrentUser();
  const savedPosts: Models.Document[] = user?.save
    .map((post: Models.Document) => ({
      ...post.post,
      creator: {
        imageUrl: user.imageUrl,
      },
    }))
    .reverse();
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <Image
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!user ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default Page