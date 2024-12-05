"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cleanURL, addProtocolToURL } from "@/lib/utils/general";
import { ExternalLink } from "lucide-react";

type ChildComponentProps = {
  seeMoreText: string;
  title: string;
  description?: string;
  followOnLink?: string;
};

export default function SeeMoreButton({
  seeMoreText,
  title,
  description,
  followOnLink,
}: ChildComponentProps) {
  return (
    <Dialog>
      <DialogTrigger className="text-sky-600 hover:text-sky-700">
        See More
      </DialogTrigger>
      <DialogContent className="max-h-[600px] md:max-h-[750px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || "About"}</DialogTitle>

          <DialogDescription className="whitespace-pre-line">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-line break-words overflow-hidden">
          {seeMoreText}
        </div>
        {followOnLink ? (
          <div className="flex justify-end mt-2">
            <Link
              href={addProtocolToURL(followOnLink)}
              className="text-sky-600 hover:text-sky-700 flex items-center max-w-48  overflow-hidden break-words"
              target="_blank"
            >
              <span className="truncate max-w-full">
                {cleanURL(followOnLink)}
              </span>
              <ExternalLink className="h-4 w-4 ml-1 shrink-0" />
            </Link>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
