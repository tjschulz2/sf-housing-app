import { CalendarDays, Mail } from "lucide-react";

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
  console.log(userData);
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="">
        <div className="flex justify-between space-x-4">
          {/* <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar> */}
          <UserProfileImage src={userData?.twitter_avatar_url} size="medium" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              @{userData?.twitter_handle}
            </h4>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 opacity-70" />{" "}
              <ReferralBadge textSize="xs" userID={userData.user_id} />
            </div>
            <div className="flex items-center pt-2">
              {userData?.created_at ? (
                <>
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDateMonthYear(userData.created_at)}
                  </span>
                </>
              ) : null}{" "}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
