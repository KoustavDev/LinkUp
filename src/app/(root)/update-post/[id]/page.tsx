import UpdatePost from "@/components/special/UpdatePost";
import React from "react";

interface types {
  params: {
    id: string;
  };
}

const Page = async ({ params }: types) => {
  const { id } = await params;
  return (
   <UpdatePost id={id} />
  );
};

export default Page;
