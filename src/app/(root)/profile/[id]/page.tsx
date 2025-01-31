import ProfilePosts from '@/components/special/ProfilePosts';
import React from 'react'

type types = {
  params: Promise<{ id: string }>;
};
const page = async ({params} : types) => {
  const userId = (await params).id;;
  return (
    <ProfilePosts id={userId} showLikedPost={false}/>
  )
}

export default page