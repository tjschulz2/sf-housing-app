import UserProfileImage from "@/components/user-profile-image";
import ReferralBadge from "@/components/referral-badge";
import { Card, CardTop, CardBottom } from "@/components/cards/card";
import TwitterLogo from "@/images/twitter-logo.svg";
import Link from "next/link";
import { formatDateMonthYear } from "@/lib/utils/general";

export default function MemberCard({ member }: { member: MemberUserType }) {
  if (!member.name || !member.twitter_handle) {
    return null;
  }
  return (
    <Card className="shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 basis-1/3">
          <div className="flex items-center gap-4">
            <UserProfileImage
              src={member.twitter_avatar_url}
              size="medium-dynamic"
            />
            <div className="text-sm font-semibold md:text-md break-words">
              {member.name}
            </div>
          </div>

          {/* <div className="flex flex-col">
            <div className="text-sm">@{member.twitter_handle}</div>
          </div> */}
        </div>
        <div className="flex flex-col gap-2 grow">
          <div className="flex gap-2 text-sm">
            <span className="text-xs text-gray-600">Referred by</span>
            <ReferralBadge
              textSize="xs"
              showAvatar={false}
              userID={member.user_id}
            />
          </div>
          {member.created_at ? (
            <div className="flex gap-2 text-xs text-gray-600">
              {/* <span className="">Joined</span> */}
              {formatDateMonthYear(member.created_at)}
            </div>
          ) : null}
        </div>
        <Link target="_blank" href={`https://x.com/${member.twitter_handle}`}>
          <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
        </Link>
      </div>
    </Card>
  );
}
