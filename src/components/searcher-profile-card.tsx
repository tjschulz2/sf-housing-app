import { Card, CardTop, CardBottom, CardListSection } from "@/components/card";
import UserProfileImage from "@/components/user-profile-image";
import ContactMeButton from "@/components/contact-me-button";
import TwitterLogo from "@/images/twitter-logo.svg";
import Link from "next/link";
import SeeMoreButton from "@/components/see-more-button/see-more-button";
import deriveActivityLevel, { housingMap } from "@/lib/configMaps";
import { dateDiff } from "@/lib/utils/general";
import ActivityStatusDot from "@/components/activity-status-dot";

type PropsType = {
  profile: HousingSearchProfile;
  userSession: CoreUserSessionData;
};

export default function SearcherProfileCard(props: PropsType) {
  const { profile, userSession } = props;

  let bio = profile.pref_housemate_details ?? "";
  if (bio.length > 45) {
    bio = bio.substring(0, 43) + "...";
  }

  let activityLevel;
  if (profile.last_updated_date) {
    const { diffDays } = dateDiff(profile.last_updated_date);
    activityLevel = deriveActivityLevel(diffDays);
  }

  return (
    <Card>
      <CardTop>
        <UserProfileImage size="large" src={profile.user?.twitter_avatar_url} />
        <div className="flex flex-col items-center">
          <span className="font-semibold">
            {profile.user?.name}{" "}
            {activityLevel === "high" ? (
              <span className="ml-2">
                <ActivityStatusDot status={activityLevel} />
              </span>
            ) : null}
          </span>
          <Link
            href={`https://x.com/${profile.user?.twitter_handle}`}
            className="flex items-center"
          >
            <span className="text-blue-500 hover:text-blue-400  py-2">
              @{profile.user?.twitter_handle}
            </span>
            <TwitterLogo className="ml-1" fill="#3191e7" />
          </Link>

          <ContactMeButton
            phoneNum={profile.contact_phone}
            email={profile.contact_email}
            twitter={profile.user?.twitter_handle}
            curUserName={userSession.twitterName}
          />
        </div>
      </CardTop>
      <CardBottom>
        <CardListSection sectionTitle="About">
          <span className="text-neutral-600">{bio}</span>
          {bio.length > 45 ? (
            <SeeMoreButton color={"blue"} seeMoreText={bio ?? ""} />
          ) : null}
        </CardListSection>
        <CardListSection sectionTitle="Preference">
          <span className="text-neutral-600">
            {" "}
            {profile.pref_housing_type
              ? housingMap.housingType[profile.pref_housing_type] + ", "
              : null}{" "}
            {profile.pref_housemate_count
              ? housingMap.housemates[profile.pref_housemate_count]
              : null}
          </span>
        </CardListSection>
        <CardListSection sectionTitle="Moving">
          <span className="text-neutral-600">
            {profile.pref_move_in
              ? housingMap.moveIn[profile.pref_move_in]
              : null}
          </span>
        </CardListSection>
        <CardListSection sectionTitle="Referred by">
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              href={`https://twitter.com/`}
              className="flex items-center no-underline"
            >
              <span className="mx-1">
                <UserProfileImage size="small" src={`https://twitter.com/`} />
              </span>
              <span>test</span>
            </a>
          </div>
        </CardListSection>
      </CardBottom>
    </Card>
  );
}
