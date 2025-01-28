import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import CommentLike from './CommentLike';

const CommentList = ({ comments, userId }: { comments: Models.Document[], userId:string }) => {
  return (
    <div className="w-full text-white p-4 space-y-4 flex flex-col gap-8 max-h-[225px] overflow-y-auto scrollbar-hide">
      {comments.map((comment: Models.Document) => (
        <div key={comment.$id} className="flex gap-3">
          <Link
            href={`/profile/${comment.author.$id}`}
            className="flex items-center gap-3"
          >
            <Image
              src={
                comment.author.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              height={32}
              width={32}
              className="lg:w-12 lg:h-12 rounded-full"
            />
          </Link>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(comment.$createdAt)}
              </p>
              <CommentLike comment={comment} userId = {userId}/>
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-line">
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList