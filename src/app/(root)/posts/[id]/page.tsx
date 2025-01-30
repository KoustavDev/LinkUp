// app/(root)/posts/[id]/page.tsx
import PostDetails from "@/components/special/PostDetails";
import { Metadata } from "next";


export default function Page({ params }: { params: { id: string } }) {
  return <PostDetails postId={params.id} />;
}

export const metadata: Metadata = {
  title: "Post Details",
};
