import { Card, CardTop, CardBottom } from "@/components/card";
import UserProfileImage from "@/components/user-profile-image";
import ContactMeButton from "@/components/contact-me-button";
import TwitterLogo from "@/images/twitter-logo.svg";
import Link from "next/link";
import SeeMoreButton from "@/components/see-more-button/see-more-button";

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

  return (
    <Card>
      <CardTop>
        <UserProfileImage size="large" src={profile.user?.twitter_avatar_url} />
        <div className="flex flex-col items-center">
          <span className="font-semibold">{profile.user?.name}</span>
          <Link
            href={`https://x.com/${profile.user?.twitter_handle}`}
            className="flex items-center"
          >
            <span className="text-blue-500 hover:text-blue-400 text-sm">
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
        <h3 className="font-semibold">About</h3>
        <span>{bio}</span>
        {bio.length > 45 ? (
          <SeeMoreButton color={"blue"} seeMoreText={bio ?? ""} />
        ) : null}
      </CardBottom>
    </Card>
  );
}
