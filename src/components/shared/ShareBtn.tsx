import React, { useEffect, useState } from 'react'
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { useSharePost } from '@/backend/queryAndMutation';

const ShareBtn = ({
  postId,
  url,
  shareNumber,
}: {
  postId: string;
  url: string;
  shareNumber: number;
}) => {
  const [shares, setShares] = useState(0);
  const {mutate : sharePost} = useSharePost();

  useEffect(() => {
    if (shareNumber) {
      setShares(shareNumber);
    }
  }, [shareNumber]);

  const handleShare = () => {
    setShares((prevShares) => prevShares + 1);
    sharePost({ postId, shareNumber: shares });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex gap-2 cursor-pointer items-center"
          onClick={handleShare}
        >
          <Image
            src="/assets/icons/Forward.svg"
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <span>{shares}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md card">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={url}
              readOnly
              className="bg-opacity-50 selection:bg-[#877eff] selection:text-black text-black backdrop-filter backdrop-blur-sm"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-opacity-70 backdrop-filter backdrop-blur-sm"
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-opacity-70 backdrop-filter backdrop-blur-sm"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBtn