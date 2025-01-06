import {
  Card,
  CardTop,
  CardBottom,
  CardListSection,
} from "@/components/cards/card";
import UserProfileImage from "@/components/user-profile-image";
import ContactMeButton from "@/components/contact-me-button";
import Link from "next/link";
import SeeMoreButton from "@/components/see-more-button/see-more-button";
import deriveActivityLevel, { housingMap } from "@/lib/configMaps";
import { addProtocolToURL, cleanURL, dateDiff } from "@/lib/utils/general";
import ActivityStatusDot from "@/components/activity-status-dot";
import { useAuthContext } from "@/contexts/auth-context";
import { ExternalLink } from "lucide-react";
import CardBioSection from "./card-bio-section";
import ReferralBadge from "@/components/referral-badge";
import { Button } from "../ui/button";
import CommonFollowers from "@/components/follower-intersection/CommonFollowers";
import { UserHoverCard } from "@/components/cards/user-hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

type PropsType = {
  profile: SpaceListingWithUserData;
};

export default function SpaceProfileCard(props: PropsType) {
  const { profile } = props;
  const { userSession } = useAuthContext();

  const bio = profile.description ?? "";

  let activityLevel;
  if (profile.last_updated_date) {
    const { diffDays } = dateDiff(profile.last_updated_date);
    activityLevel = deriveActivityLevel(diffDays);
  }

  return (
    <Card>
      <CardTop>
        <UserProfileImage
          size="large"
          src={profile.image_url || profile.user?.twitter_avatar_url}
          className="shrink-0"
        />
        <div className="flex flex-col gap-4 items-center max-w-[60%]">
          <div className="w-full flex justify-center">
            <span className="font-semibold text-ellipsis overflow-hidden text-pretty text-center">
              {profile.name}{" "}
            </span>
            {activityLevel === "high" ? (
              <span className="ml-2">
                <ActivityStatusDot status={activityLevel} />
              </span>
            ) : null}
          </div>

          <div className="w-fit">
            <Link
              href={`https://x.com/${profile.user?.twitter_handle}`}
              className="flex items-center justify-center w-full"
              target="_blank"
            >
              <UserProfileImage
                size="small"
                src={profile.user?.twitter_avatar_url}
                className="mr-1"
              />

              <UserHoverCard userData={profile.user} withLink={false}>
                <span className="text-blue-500 hover:text-blue-400 max-w-full truncate">
                  {profile.user?.name}
                </span>
              </UserHoverCard>
            </Link>
          </div>

          <div className="flex gap-2">
            <ContactMeButton
              phoneNum={profile.contact_phone}
              email={profile.contact_email}
              twitter={profile.user?.twitter_handle}
              recipientName={`${profile.user?.name} (@${profile.user?.twitter_handle})`}
              spaceSlug={profile.custom_space_slug || profile.space_slug}
            />
            <TooltipProvider delayDuration={250}>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/s/${
                        profile.custom_space_slug || profile.space_slug
                      }`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Full, linkable page for this listing
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardTop>
      <CardBottom>
        {/* {userSession && (
          <CommonFollowers
            userID1={userSession.userID}
            userID2={profile.user_id}
          />
        )} */}

        <CardBioSection
          bio={bio}
          link={profile.website_url}
          title={profile.name || ""}
        />
        <div className="flex flex-col grow gap-2 justify-center">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
            <div>
              <span className="mr-2">📍</span>
              <span className="text-neutral-600">
                {housingMap.location[profile.location || 0]}
              </span>
            </div>
            <div>
              <span className="mr-2">🏷️</span>
              <span className="text-neutral-600">
                {profile.room_price_range
                  ? housingMap.roomPrice[profile.room_price_range]
                  : null}
              </span>
            </div>

            <div>
              <span className="mr-2">👥</span>
              <span className="text-neutral-600">
                {typeof profile.resident_count === "number"
                  ? `${profile.resident_count.toString()}`
                  : null}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-xs text-gray-500 mr-1">Invited by</span>
            <ReferralBadge textSize="xs" userID={profile.user_id} />
          </div>
        </div>
      </CardBottom>
    </Card>
  );
}
