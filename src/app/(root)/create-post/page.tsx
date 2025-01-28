import PostForm from '@/components/forms/PostForm';
import Image from 'next/image';
import React from 'react'

const page = () => {
  return (
    <div className="min-w-[100svw] lg:min-w-[70svw] mb-16 lg:mb-0">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <Image
            src={"/assets/icons/add-post.svg"}
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  );
}

export default page