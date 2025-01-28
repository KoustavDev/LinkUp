import PostDetails from "@/components/special/PostDetails";
import React from "react";
type types = {
  params: {
    id: string;
  };
};
const page =  async ({ params }: types) => {
  const postId = await params;
  return <PostDetails postId={postId.id} />;
};

export default page;
