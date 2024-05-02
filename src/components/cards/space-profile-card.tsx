import {
  Card,
  CardTop,
  CardBottom,
  CardListSection,
} from "@/components/cards/card";
import UserProfileImage from "@/components/user-profile-image";
import ContactMeButton from "@/components/contact-me-button";
import TwitterLogo from "@/images/twitter-logo.svg";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PropsType = {
  profile: SpaceListingWithUserData;
};

export default function SpaceProfileCard(props: PropsType) {
  const { profile } = props;

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

          {/* <Link
            href={`https://x.com/${profile.user?.twitter_handle}`}
            className="flex items-center justify-center w-full"
          >
            <span className="text-blue-500 hover:text-blue-400 max-w-full truncate">
              @{profile.user?.twitter_handle}
            </span>
            <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
          </Link> */}

          <div className="flex gap-4">
            <div className="flex">
              <img className="mr-1" src="/location.svg" />
              <p id="location" className="text-sm md:text-md truncate">
                {housingMap.location[profile.location || 0]}
              </p>
            </div>
            <div className="flex">
              <img className="mr-1" src="/threepeople.svg" />
              <p className="text-sm md:text-md">
                {typeof profile.resident_count === "number"
                  ? `${profile.resident_count.toString()}`
                  : null}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <ContactMeButton
              phoneNum={profile.contact_phone}
              email={profile.contact_email}
              twitter={profile.user?.twitter_handle}
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
      <div className="w-fit">
        <Link
          href={`https://x.com/${profile.user?.twitter_handle}`}
          className="flex items-center justify-center w-full"
        >
          {/* <UserProfileImage
            size="small"
            src={profile.user?.twitter_avatar_url}
          /> */}

          <span className="text-blue-500 hover:text-blue-400 max-w-full truncate">
            @{profile.user?.twitter_handle}
          </span>
          <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
        </Link>
      </div>
      <CardBottom>
        <CardBioSection bio={bio} link={profile.website_url} />
        <div className="flex flex-col grow justify-center">
          <div className="flex flex-col gap-2">
            <CardListSection sectionTitle="Room price">
              <span className="text-neutral-600">
                {profile.room_price_range
                  ? housingMap.roomPrice[profile.room_price_range]
                  : null}
              </span>
            </CardListSection>
            <CardListSection
              sectionTitle="Referred by"
              className="flex items-center"
            >
              <ReferralBadge userID={profile.user_id} />
            </CardListSection>
          </div>
        </div>
      </CardBottom>
    </Card>
  );
}
