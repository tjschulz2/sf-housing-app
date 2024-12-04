"use client";
import SeeMoreButton from "@/components/see-more-button/see-more-button";
import { addProtocolToURL, cleanURL } from "@/lib/utils/general";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CardBioSection({
  bio,
  link,
  bioPreviewSize = "small",
  subjectName,
}: {
  bio: string;
  link?: string | null;
  bioPreviewSize?: "small" | "medium" | "large";
  subjectName?: string;
}) {
  const bioRef = useRef<HTMLParagraphElement>(null); // Create a ref for the bio paragraph
  const [isOverflowing, setIsOverflowing] = useState(false);
  const validatedURL = link ? addProtocolToURL(link) : "";

  useEffect(() => {
    const checkOverflow = () => {
      const current = bioRef.current;
      if (current) {
        setIsOverflowing(current.offsetHeight < current.scrollHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  function getLineClampStyle() {
    if (bioPreviewSize === "small") {
      return "line-clamp-3";
    } else if (bioPreviewSize === "medium") {
      return "line-clamp-5";
    } else if (bioPreviewSize === "large") {
      return "line-clamp-[7]";
    }
  }

  return (
    <div className="p-2 bg-[#F6F5EB] rounded-xl flex flex-col gap-1 text-sm">
      <p
        ref={bioRef}
        // className="text-neutral-600 line-clamp-3 whitespace-pre-line"
        className={`text-neutral-600 ${getLineClampStyle()} whitespace-pre-line`}
      >
        {bio}
      </p>
      {isOverflowing || link ? (
        <div className="flex justify-between">
          {isOverflowing ? (
            <SeeMoreButton
              color={"blue"}
              seeMoreText={bio ?? ""}
              subjectName={subjectName}
            />
          ) : null}
          {validatedURL ? (
            <Link
              href={validatedURL}
              className="flex items-center"
              target="_blank"
            >
              <span className="text-neutral-500 hover:text-blue-400 max-w-[10rem] truncate">
                {cleanURL(validatedURL)}
              </span>
              <ExternalLink className="h-4 w-4 ml-1 text-neutral-500" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
