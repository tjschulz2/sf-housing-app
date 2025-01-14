"use client";
import UserProfileImage from "@/components/user-profile-image";
import { getReferrerData } from "@/lib/utils/data";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loading-spinner/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { UserHoverCard } from "@/components/cards/user-hover-card";

type ReferrerData = {
  name: string | null;
  twitter_handle: string | null;
  twitter_avatar_url: string | null;
};

export default function ReferralBadge({
  userID,
  showAvatar = true,
  textSize = "sm",
  allowHoverCard = true,
}: {
  userID: string;
  showAvatar?: boolean;
  textSize?: "xs" | "sm" | "md";
  allowHoverCard?: boolean;
}) {
  const [referrer, setReferrer] = useState<MemberUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchReferrer = async () => {
      try {
        const referrerData = await getReferrerData(userID);
        if (referrerData) setReferrer(referrerData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReferrer();
  }, [userID]);

  if (referrer) {
    if (allowHoverCard) {
      return (
        <UserHoverCard userData={referrer}>
          <a
            href={`https://x.com/${referrer.twitter_handle}`}
            className="flex items-center no-underline"
            target="_blank"
          >
            {showAvatar ? (
              <span className="mx-1">
                <UserProfileImage
                  size="small"
                  src={referrer.twitter_avatar_url}
                />
              </span>
            ) : null}
            <span
              className={`text-blue-500 hover:text-blue-400 text-${textSize}`}
            >
              {referrer.name?.split(" ").slice(0, 2).join(" ")}
            </span>
          </a>
        </UserHoverCard>
      );
    } else {
      return (
        <div className="flex items-center no-underline">
          {showAvatar ? (
            <span className="mx-1">
              <UserProfileImage
                size="small"
                src={referrer.twitter_avatar_url}
              />
            </span>
          ) : null}
          <span className={`text-blue-500 text-${textSize}`}>
            {referrer.name?.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
      );
    }
  } else if (isLoading) {
    return <Skeleton className="h-4 w-[75px]" />;
  } else {
    return (
      <span className={`text-neutral-600 text-${textSize}`}>DirectorySF </span>
    );
  }
}
