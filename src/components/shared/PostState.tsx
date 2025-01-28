import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  // useCreateComment,
} from "@/backend/queryAndMutation";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { Input } from "../ui/input";

const PostState = ({
  post,
  userId,
}: {
  post: Models.Document;
  userId: string;
}) => {
  const { data: userData } = useGetCurrentUser();
  const likedUsers = post.likes.map((user: Models.Document) => user.$id);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState<string[]>(likedUsers);
  // const [comment, setComment] = useState<string>('');
  const { mutate: likePost } = useLikePost();
  const { mutate: savedPost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();
  // const { mutate: createComment } = useCreateComment();

  const savedPostRecord = userData?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
    // setIsSaved(savedPostRecord ? true : false)
  }, [userData, savedPostRecord]);

  const handleLike = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    // Determine if the user has already liked the post
    const isLiked = likes.includes(userId);
    // Update the likes array accordingly
    const updatedLikes = isLiked
      ? likes.filter((id) => id !== userId) // Remove the userId if already liked
      : [...likes, userId]; // Add the userId if not already liked

    setLikes(updatedLikes);
    // Call mutation to update the backend
    likePost({ postId: post.$id, userId: updatedLikes });
  };

  const handleSave = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    // const a = await authService.getCurrentUser()
    // console.log(a);
    if (isSaved) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      setIsSaved(true);
      savedPost({ userId: userId, postId: post.$id });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className={`flex justify-between items-center z-20`}>
        <div className="flex flex-row gap-8">
          <div className="flex gap-2 mr-5">
            <Image
              src={
                likes.includes(userId) // Use `likes` state instead of `likedUsers`
                  ? `/assets/icons/liked.svg`
                  : `/assets/icons/like.svg`
              }
              alt="like"
              width={20}
              height={20}
              onClick={(e) => handleLike(e)}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
          </div>
          <Link href={`/posts/${post.$id}`}>
            <div className="flex gap-2">
              <Image
                src={`/assets/icons/comment.svg`}
                alt="comment"
                width={20}
                height={20}
                className="cursor-pointer"
              />
              {post.comments.length}
            </div>
          </Link>
          <div className="flex gap-2">
            <Image
              src={
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }
              alt="share"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={(e) => handleSave(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostState;
