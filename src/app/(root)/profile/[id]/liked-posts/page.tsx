import ProfilePosts from '@/components/special/ProfilePosts';
import React from 'react'

type types = {
  params: {
    id: string;
  };
};
const page = async ({params} : types) => {
  const userId = await params;
  return <ProfilePosts id={userId.id} showLikedPost={true} />;
}

export default page
