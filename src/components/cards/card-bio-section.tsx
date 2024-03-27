import SeeMoreButton from "@/components/see-more-button/see-more-button";
import { addProtocolToURL, cleanURL } from "@/lib/utils/general";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CardBioSection({
  bio,
  link,
}: {
  bio: string;
  link?: string | null;
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

  return (
    <div className="p-2 bg-neutral-50 rounded-xl flex flex-col gap-1 text-sm">
      <p ref={bioRef} className="text-neutral-600 line-clamp-3">
        {bio}
      </p>
      {isOverflowing || link ? (
        <div className="flex justify-between">
          {isOverflowing ? (
            <SeeMoreButton color={"blue"} seeMoreText={bio ?? ""} />
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
