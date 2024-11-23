import UserProfileImage from "@/components/user-profile-image";
import ReferralBadge from "@/components/referral-badge";
import { Card, CardTop, CardBottom } from "@/components/cards/card";
import TwitterLogo from "@/images/twitter-logo.svg";
import Link from "next/link";

function formatDate(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name
  const monthName = months[date.getUTCMonth()];

  // Get the year and convert it to a 2-digit format
  const year = date.getUTCFullYear().toString().slice(-2);

  // Return the formatted string
  return `${monthName} '${year}`;
}

export default function MemberCard({ member }: { member: MemberUserType }) {
  if (!member.name || !member.twitter_handle) {
    return null;
  }
  return (
    <Card className="shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <UserProfileImage
              src={member.twitter_avatar_url}
              size="medium-dynamic"
            />
            <div className="text-md font-semibold md:text-lg">
              {member.name}
            </div>
          </div>

          {/* <div className="flex flex-col">
            <div className="text-sm">@{member.twitter_handle}</div>
          </div> */}
        </div>
        <div className="flex flex-col gap-2 text-sm text-center">
          <span className="font-semibold">Referrer</span>
          <ReferralBadge userID={member.user_id} />
        </div>
        {member.created_at ? (
          <div className="flex flex-col gap-2 text-sm text-center">
            <span className="font-semibold">Since</span>
            {formatDate(member.created_at)}
          </div>
        ) : null}
        <Link target="_blank" href={`https://x.com/${member.twitter_handle}`}>
          <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
        </Link>
      </div>
    </Card>
  );
}
