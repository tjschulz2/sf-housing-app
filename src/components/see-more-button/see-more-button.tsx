"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./see-more-button.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cleanURL } from "@/lib/utils/general";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    openModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
        <div className="whitespace-pre-line">{seeMoreText}</div>
        {followOnLink ? (
          <div className="flex justify-end mt-4">
            <Link
              href={followOnLink}
              className="text-sky-600 hover:text-sky-700 flex items-center"
              target="_blank"
            >
              {cleanURL(followOnLink)}
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
