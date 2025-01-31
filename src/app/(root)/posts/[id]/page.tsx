import PostDetails from "@/components/special/PostDetails";
import React from "react";
type types = {
  params: Promise<{ id: string }>;
};
const page = async ({ params }: types) => {
  const postId = (await params).id;
  return <PostDetails postId={postId} />;
};

export default page;
