import {
  Card,
  CardTop,
  CardBottom,
  CardListSection,
} from "@/components/cards/card";
import UserProfileImage from "@/components/user-profile-image";
import ContactMeButton from "@/components/contact-me-button";
// import TwitterLogo from "@/../public/images/twitter-logo.svg";
import Link from "next/link";
import SeeMoreButton from "@/components/see-more-button/see-more-button";
import deriveActivityLevel, { housingMap } from "@/lib/configMaps";
import { addProtocolToURL, cleanURL, dateDiff } from "@/lib/utils/general";
import ActivityStatusDot from "@/components/activity-status-dot";
import { useAuthContext } from "@/contexts/auth-context";
import { ExternalLink } from "lucide-react";
import CardBioSection from "./card-bio-section";
import ReferralBadge from "@/components/referral-badge";
import CommonFollowers from "@/components/follower-intersection/CommonFollowers";
import { CalendarDays, Calendar, Mail, Handshake } from "lucide-react";
import Image from "next/image";

type PropsType = {
  profile: HousingSearchProfile;
};

export default function SearcherProfileCard(props: PropsType) {
  const { profile } = props;
  const { userSession } = useAuthContext();

  const bio = profile.pref_housemate_details ?? "";

  const daysSinceConfirmation = profile.last_updated_date
    ? dateDiff(profile.last_updated_date).diffDays
    : null;

  return (
    <Card>
      <CardTop>
        <UserProfileImage size="large" src={profile.user?.twitter_avatar_url} />
        <div className="flex flex-col items-center max-w-[60%]">
          <div className="grid grid-cols-[1fr,25px]">
            <span className="font-semibold max-w-[12rem] truncate">
              {profile.user?.name}{" "}
            </span>
            {daysSinceConfirmation !== null ? (
              <span className="ml-2">
                <ActivityStatusDot
                  status={deriveActivityLevel(daysSinceConfirmation)}
                />
              </span>
            ) : null}
          </div>

          <Link
            href={`https://x.com/${profile.user?.twitter_handle}`}
            className="flex items-center justify-center w-full"
            target="_blank"
          >
            <span className="text-blue-500 hover:text-blue-400 py-2 max-w-full truncate">
              @{profile.user?.twitter_handle}
            </span>
            {/* <Image
              src={TwitterLogo}
              width={20}
              height={20}
              alt="Twitter icon"
              className="ml-1 overflow-visible"
            /> */}
            <Image
              src="/images/twitter-logo.svg"
              unoptimized={true}
              width={20}
              height={20}
              alt="Twitter icon"
              className="ml-1 overflow-visible"
            />
          </Link>
          <ContactMeButton
            phoneNum={profile.contact_phone}
            email={profile.contact_email}
            twitter={profile.user?.twitter_handle}
            recipientName={profile.user?.name}
          />
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
          link={profile.link}
          title={profile.user?.name || ""}
        />
        <div className="flex flex-col grow justify-center">
          <div className="flex flex-col gap-2">
            {/* <CardListSection sectionTitle="Preference">
              <span className="text-neutral-600">
                {" "}
                {profile.pref_housing_type
                  ? housingMap.housingType[profile.pref_housing_type] + ", "
                  : null}{" "}
                {profile.pref_housemate_count
                  ? housingMap.housemates[profile.pref_housemate_count]
                  : null}
              </span>
            </CardListSection> */}
            <div>
              <span className="mr-2">👀</span>
              <span className="text-neutral-600">
                {" "}
                {profile.pref_housing_type
                  ? housingMap.housingType[profile.pref_housing_type] + ", "
                  : null}{" "}
                {profile.pref_housemate_count
                  ? housingMap.housemates[profile.pref_housemate_count]
                  : null}
              </span>
            </div>
            {/* <CardListSection sectionTitle="Moving">
              <span className="text-neutral-600">
                {profile.pref_move_in
                  ? housingMap.moveIn[profile.pref_move_in]
                  : null}
              </span>
            </CardListSection> */}
            <div className="flex items-center">
              {profile.pref_move_in ? (
                <>
                  {/* <CalendarDays className="mr-2 h-4 w-4" /> */}
                  <span className="mr-2">🗓️</span>
                  <span className="text-neutral-600">
                    {housingMap.moveIn[profile.pref_move_in]}{" "}
                  </span>
                </>
              ) : null}
            </div>
            {/* <CardListSection
              sectionTitle="Referred by"
              className="flex items-center"
            >
              <ReferralBadge userID={profile.user_id} />
            </CardListSection> */}
            <div className="flex items-center justify-end">
              <span className="text-xs text-gray-500 mr-1">Invited by</span>
              <ReferralBadge textSize="xs" userID={profile.user_id} />
            </div>
          </div>
        </div>
      </CardBottom>
    </Card>
  );
}
