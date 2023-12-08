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
    <div className="p-2 bg-neutral-50 rounded-lg flex flex-col gap-1 mb-2 text-sm">
      <p ref={bioRef} className="text-neutral-600 line-clamp-3">
        {bio}
      </p>
      {isOverflowing || link ? (
        <div className="flex justify-between">
          {isOverflowing ? (
            <SeeMoreButton color={"blue"} seeMoreText={bio ?? ""} />
          ) : null}
          {link ? (
            <Link
              href={addProtocolToURL(link)}
              className="flex items-center"
              target="_blank"
            >
              <span className="text-neutral-500 hover:text-blue-400 max-w-[10rem] truncate">
                {cleanURL(link)}
              </span>
              <ExternalLink className="h-4 w-4 ml-1 text-neutral-500" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
