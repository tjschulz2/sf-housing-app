import { CalendarDays, Mail } from "lucide-react";
import TwitterLogo from "@/images/twitter-logo.svg";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserProfileImage from "@/components/user-profile-image";
import ReferralBadge from "@/components/referral-badge";
import { formatDateMonthYear } from "@/lib/utils/general";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function UserHoverCard({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: MemberUserType | null;
}) {
  if (!userData) {
    return null;
  }
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="">
        <div className="flex justify-between">
          {/* <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar> */}
          <UserProfileImage src={userData?.twitter_avatar_url} size="medium" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* <TwitterLogo className="overflow-visible" fill="#3191e7" /> */}
              <h4 className="text-xs">@{userData?.twitter_handle}</h4>
            </div>
            <div className="flex items-center">
              {userData?.created_at ? (
                <>
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDateMonthYear(userData.created_at)}
                  </span>
                </>
              ) : null}{" "}
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 opacity-70" />{" "}
              <ReferralBadge textSize="xs" userID={userData.user_id} />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
