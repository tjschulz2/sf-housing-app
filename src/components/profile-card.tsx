"use client";
import styles from "./profile-card.module.css";
import SeeMoreButton from "./see-more-button/see-more-button";
import deriveActivityLevel, { housingMap } from "../lib/configMaps";
import { cleanURL, addProtocolToURL, dateDiff } from "../lib/utils/general";
import { FollowedBy } from "./followed-by/followed-by";
import TwitterLogo from "../images/twitter-logo.svg";
// import ContactMeButton from "./contactme-button/contactme-button";
import React, { useState, useEffect } from "react";
import { getImageLink } from "../lib/utils/process";
import { getReferrerName } from "../lib/utils/data";
import { Button } from "./ui/button";
import Link from "next/link";
import ActivityStatusDot from "./activity-status-dot";
import ContactMeButton from "./contact-me-button";
import UserProfileImage from "./user-profile-image";

type ProfileCardProps = {
  profile: HousingSearchProfile | OrganizerProfile | CommunityProfile;
  color: string; // Define color as a string type (or whatever type your color variable is)
  curUserName?: string;
};

const ProfileCard = ({ profile, color, curUserName }: ProfileCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<{
    name: string | null;
    twitter_handle: string | null;
    twitter_avatar_url: string | null;
  }>({ name: null, twitter_handle: null, twitter_avatar_url: null });

  const { user } = profile;
  let colorClass: any;
  let svgImage: string;
  let colorClassWrapper: any;
  if (color === "purple") {
    colorClass = styles.colorPurple;
    svgImage = "#6B31E7";
    colorClassWrapper = styles.backgroundPurple;
  } else if (color === "green") {
    colorClass = styles.colorGreen; // Make sure to define colorGreen in your styles
    svgImage = "#25CB8F";
    colorClassWrapper = styles.backgroundGreen;
  } else {
    colorClass = styles.colorBlue;
    svgImage = "#3191e7";
    colorClassWrapper = styles.backgroundBlue;
  }

  function isHousingSearchProfile(
    profile: HousingSearchProfile | OrganizerProfile | CommunityProfile
  ): profile is HousingSearchProfile {
    return (
      (profile as HousingSearchProfile).pref_housemate_details !== undefined
    );
  }

  function isOrganizerProfile(
    profile: HousingSearchProfile | OrganizerProfile | CommunityProfile
  ): profile is OrganizerProfile {
    return (profile as OrganizerProfile).pref_house_details !== undefined;
  }

  function isCommunityProfile(
    profile: HousingSearchProfile | OrganizerProfile | CommunityProfile
  ): profile is CommunityProfile {
    return (profile as CommunityProfile).resident_count !== undefined;
  }

  const renderReferrer = () => {
    if (referrer.name !== null) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontWeight: "600" }}>Referred by:</div>
          <a
            href={`https://twitter.com/${referrer.twitter_handle}`}
            className={styles.referrerContainer}
          >
            <span className="mx-1">
              <UserProfileImage
                size="small"
                src={referrer.twitter_avatar_url}
              />
            </span>
            <div className={`${colorClass}`}>{referrer.name}</div>
          </a>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontWeight: "600", marginRight: "4px" }}>
            Referred by:
          </div>
          <div className={styles.referrerContainer}>
            <div
              style={{ height: "25px", display: "flex", alignItems: "center" }}
            >{`DirectorySF`}</div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchReferrer = async () => {
      if (profile.user_id) {
        try {
          const referrerData = await getReferrerName(profile.user_id);
          if (referrerData) setReferrer(referrerData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchReferrer();
  }, [profile.user_id]);

  const renderHousingAndOrganizerOrCommunity = () => {
    if (
      !isCommunityProfile(profile) &&
      (isOrganizerProfile(profile) || isHousingSearchProfile(profile))
    ) {
      let contactMethod = "";
      if (profile.pref_contact_method) {
        contactMethod = profile.pref_contact_method;
      }
      let userName = user?.name || "";
      if (userName.length > 20) {
        userName = userName?.substring(0, 19) + "...";
      }
      const lastUpdatedDate = (profile as HousingSearchProfile)
        .last_updated_date;
      let activityLevel: "low" | "med" | "high" = "low";
      if (lastUpdatedDate) {
        const { diffDays } = dateDiff(lastUpdatedDate);
        activityLevel = deriveActivityLevel(diffDays);
      }

      let twitterHandle = user?.twitter_handle || "";
      if (twitterHandle.length > 15) {
        twitterHandle = twitterHandle.substring(0, 14) + "...";
      }
      let link = profile.link || "";
      link = cleanURL(link);
      if (link.length > 14) {
        link = link.substring(0, 14) + "...";
      }
      let housingDescription = "";
      if (isHousingSearchProfile(profile)) {
        housingDescription = profile.pref_housemate_details ?? "";
        if (housingDescription.length > 45) {
          housingDescription = housingDescription.substring(0, 43) + "...";
        }
      }
      let organizerDescription = "";
      if (isOrganizerProfile(profile)) {
        organizerDescription = profile.pref_house_details ?? "";
        if (organizerDescription.length > 45) {
          organizerDescription = organizerDescription.substring(0, 43) + "...";
        }
      }

      return (
        <li className={styles.frameParent} id="profile-card-element">
          <div className={styles.image3Parent}>
            <UserProfileImage size="large" src={user?.twitter_avatar_url} />
            <div className={styles.frameGroup}>
              <ContactMeButton
                phoneNum={
                  "contact_phone" in profile && profile.contact_phone
                    ? profile.contact_phone
                    : null
                }
                email={
                  "contact_email" in profile && profile.contact_email
                    ? profile.contact_email
                    : null
                }
                twitter={profile.user?.twitter_handle}
                curUserName={curUserName}
              />
              {profile.link ? (
                <a
                  className={`${styles.vectorParent} ${colorClass}`}
                  href={addProtocolToURL(profile.link)}
                  target="_blank"
                >
                  <img className={styles.vectorIcon} alt="" src="/link.svg" />
                  <div className={`${styles.a9io} ${colorClass}`}>{link}</div>
                </a>
              ) : null}
              <div className={styles.locationParent}>
                <img
                  className={styles.locationIcon}
                  alt=""
                  src="/location.svg"
                />
                <p className={styles.sanFrancisco} id="location">
                  San Francisco
                </p>
              </div>
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.frameA}>
              <h4 className={styles.maxKrieger} id="twitter-name">
                {userName}
                {lastUpdatedDate && activityLevel === "high" ? (
                  <span className="ml-2">
                    <ActivityStatusDot status={activityLevel} />
                  </span>
                ) : null}
              </h4>
              <a
                href={`https://twitter.com/${user?.twitter_handle}`}
                target="_blank"
                className={styles.frameALink}
              >
                <div className={styles.nameAndHandleContainer}>
                  <div
                    className={`${styles.maxkriegers} ${styles.smallExtension} ${colorClass}`}
                  >
                    @{twitterHandle}
                  </div>
                  <TwitterLogo fill={svgImage} className={styles.vectorIcon1} />
                </div>
                {/* <FollowedBy profile={profile} /> */}
              </a>
            </div>
            <div className={styles.lookingToLive} id="looking-for-text">
              <div className={styles.content}>
                <span className={styles.wants}>About me: </span>
                {isHousingSearchProfile(profile)
                  ? housingDescription
                  : organizerDescription}
                {isHousingSearchProfile(profile) ? (
                  <SeeMoreButton
                    color={color}
                    seeMoreText={profile.pref_housemate_details ?? ""}
                  />
                ) : isOrganizerProfile(profile) ? (
                  <SeeMoreButton
                    color={color}
                    seeMoreText={profile.pref_house_details ?? ""}
                  />
                ) : null}
              </div>
            </div>
            <p className={styles.wants1YearLeaseContainer} id="wants-text">
              <span className={styles.wants}>Wants:</span>
              <span>
                {" "}
                {profile.pref_housing_type
                  ? housingMap.housingType[profile.pref_housing_type] + ", "
                  : null}{" "}
                {profile.pref_housemate_count
                  ? housingMap.housemates[profile.pref_housemate_count]
                  : null}
              </span>
            </p>
            <p className={styles.wants1YearLeaseContainer} id="moving-text">
              <span className={styles.wants}>Moving:</span>
              <span>
                {" "}
                {isHousingSearchProfile(profile) && profile.pref_move_in
                  ? housingMap.moveIn[profile.pref_move_in]
                  : isOrganizerProfile(profile) && profile.pref_lease_start
                  ? housingMap.moveIn[profile.pref_lease_start]
                  : null}
              </span>
            </p>
            {renderReferrer()}
          </div>
        </li>
      );
    } else if (isCommunityProfile(profile)) {
      let contactMethod = "";
      if (profile.pref_contact_method) {
        contactMethod = profile.pref_contact_method;
      }
      let userName = user?.name || "";
      if (userName.length > 22) {
        userName = userName?.substring(0, 21) + "...";
      }
      let link = profile.website_url || "";
      link = cleanURL(link);
      if (link.length > 14) {
        link = link.substring(0, 14) + "...";
      }
      let communityDescription = "";
      if (isCommunityProfile(profile)) {
        communityDescription = profile.description ?? "";
        if (communityDescription.length > 45) {
          communityDescription = communityDescription.substring(0, 43) + "...";
        }
      }

      const communityImageURL = profile.image_url || user?.twitter_avatar_url;

      return (
        <li className={styles.frameParent} id="profile-card-element">
          <div className={styles.image3Parent}>
            {communityImageURL ? (
              <img
                className={styles.image3Icon}
                alt="community image"
                src={communityImageURL}
              />
            ) : null}

            <div className={styles.frameGroup}>
              {/* <ContactMeButton contactMethod={contactMethod} color={color} /> */}
              <Link
                href={`https://x.com/${profile.user?.twitter_handle}`}
                target="_blank"
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="rounded-3xl font-bold w-full text-md"
                >
                  Contact me
                </Button>
              </Link>

              {profile.website_url ? (
                <a
                  className={`${styles.vectorParent} ${colorClass}`}
                  href={addProtocolToURL(profile.website_url)}
                  target="_blank"
                >
                  <img className={styles.vectorIcon} alt="" src="/link.svg" />
                  <div className={`${styles.a9io} ${colorClass}`}>{link}</div>
                </a>
              ) : null}
              <div className={styles.locationParent}>
                <img
                  className={styles.locationIcon}
                  alt=""
                  src="/location.svg"
                />
                {isCommunityProfile(profile) && profile.location ? (
                  <p className={styles.sanFrancisco} id="location">
                    {housingMap.location[profile.location]}
                  </p>
                ) : !isCommunityProfile(profile) ? (
                  <p className={styles.sanFrancisco} id="location">
                    San Francisco
                  </p>
                ) : null}
              </div>
              <div className={styles.locationParent}>
                <img
                  className={styles.locationIcon}
                  alt=""
                  src="/threepeople.svg"
                />
                <p className={styles.sanFrancisco} id="location">
                  {profile.resident_count
                    ? housingMap.housemates[profile.resident_count]
                    : null}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.bottomFrame}>
            <div className={styles.houseName}>{profile.name}</div>
            <a
              href={`https://twitter.com/${user?.twitter_handle}`}
              target="_blank"
              className={styles.frameALink}
            >
              <div className={styles.twitterProfileContainer}>
                <div
                  className={`${styles.maxKrieger} ${styles.biggerExtension}`}
                >
                  {userName}
                </div>
                <div className={styles.nameAndHandleContainer}>
                  <div
                    className={`${styles.maxkriegers} ${styles.smallExtension} ${colorClass}`}
                  >
                    @{user?.twitter_handle}
                  </div>
                  <TwitterLogo fill={svgImage} className={styles.vectorIcon1} />
                </div>
                {/* <FollowedBy profile={profile} /> */}
              </div>
            </a>
            <div className={styles.lookingToLive} id="looking-for-text">
              <div className={styles.content}>
                <span className={styles.wants}>About us: </span>
                {communityDescription}
                <SeeMoreButton
                  color={color}
                  seeMoreText={profile.description ?? ""}
                />
              </div>
            </div>
            <p className={styles.wants1YearLeaseContainer} id="wants-text">
              <span className={styles.wants}>Montly rent:</span>
              <span>
                {" "}
                {profile.room_price_range
                  ? housingMap.roomPrice[profile.room_price_range]
                  : null}{" "}
              </span>
            </p>
            {renderReferrer()}
          </div>
        </li>
      );
    } else {
      return null;
    }
  };

  return <div>{renderHousingAndOrganizerOrCommunity()}</div>;
};

export default ProfileCard;
