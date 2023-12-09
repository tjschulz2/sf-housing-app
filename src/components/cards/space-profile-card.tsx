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
        <UserProfileImage size="large" src={profile.user?.twitter_avatar_url} />
        <div className="flex flex-col items-center max-w-[60%]">
          <div>
            <span className="font-semibold max-w-[12rem] truncate">
              {profile.name}{" "}
            </span>
            {activityLevel === "high" ? (
              <span className="ml-2">
                <ActivityStatusDot status={activityLevel} />
              </span>
            ) : null}
          </div>

          <Link
            href={`https://x.com/${profile.user?.twitter_handle}`}
            className="flex items-center justify-center w-full"
          >
            <span className="text-blue-500 hover:text-blue-400 py-2 max-w-full truncate">
              @{profile.user?.twitter_handle}
            </span>
            <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
          </Link>
          <ContactMeButton
            phoneNum={profile.contact_phone}
            email={profile.contact_email}
            twitter={profile.user?.twitter_handle}
          />
        </div>
      </CardTop>
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
              {profile.user?.twitter_handle &&
              profile.user?.name &&
              profile.user?.twitter_avatar_url ? (
                <ReferralBadge
                  handle={profile.user.twitter_handle}
                  name={profile.user.name}
                  imageURL={profile.user.twitter_avatar_url}
                />
              ) : null}
            </CardListSection>
          </div>
        </div>
      </CardBottom>
    </Card>
  );
}
