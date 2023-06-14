"use client";
import styles from "./profile-card.module.css";
import SeeMoreButton from "./see-more-button/see-more-button";
import { housingMap } from "../lib/prefMap";
import { cleanURL, addProtocolToURL } from "../lib/utils/general";
import { useEffect, useState } from "react";
import { getFollowIntersection } from "../lib/utils/data";
import { FollowedBy } from "./followed-by/followed-by";
import TwitterLogo from '../src/images/twitter-logo.svg'

type ProfileCardProps = {
  profile: HousingSearchProfile | OrganizerProfile;
  color: string; // Define color as a string type (or whatever type your color variable is)
};

const ProfileCard = ({ profile, color }: ProfileCardProps) => {
  const { user } = profile;
  const colorClass = color === 'purple' ? styles.colorPurple : styles.colorBlue;
  const svgImage = color === 'purple' ? "#6B31E7" : "#3191e7";
  const colorClassWrapper = color === 'purple' ? styles.backgroundPurple : styles.backgroundBlue;

  function isHousingSearchProfile(profile: HousingSearchProfile | OrganizerProfile): profile is HousingSearchProfile {
    return (profile as HousingSearchProfile).pref_housemate_details !== undefined;
  }
  
  function isOrganizerProfile(profile: HousingSearchProfile | OrganizerProfile): profile is OrganizerProfile {
    return (profile as OrganizerProfile).pref_house_details !== undefined;
  }

  return (
    <li className={styles.frameParent} id="profile-card-element">
      <div className={styles.image3Parent}>
        {user?.twitter_avatar_url ? (
          <img
            className={styles.image3Icon}
            alt=""
            src={user.twitter_avatar_url}
          />
        ) : null}
        <div className={styles.frameGroup}>
          <a
            className={`${styles.contactMeWrapper} ${colorClassWrapper}`}
            href={profile.pref_contact_method || "https://google.com"}
            target="_blank"
          >
            <p className={styles.contactMe}>Contact me</p>
          </a>
          {profile.link ? (
            <a
              className={`${styles.vectorParent} ${colorClass}`}
              href={addProtocolToURL(profile.link)}
              target="_blank"
            >
              <img className={styles.vectorIcon} alt="" src="/link.svg" />
              <div className={`${styles.a9io} ${colorClass}`}>{cleanURL(profile.link)}</div>
            </a>
          ) : null}
          <div className={styles.locationParent}>
            <img className={styles.locationIcon} alt="" src="/location.svg" />
            <p className={styles.sanFrancisco} id="location">
              San Francisco
            </p>
          </div>
        </div>
      </div>
      <div className={styles.frameContainer}>
        <a
          href={`https://twitter.com/${user?.twitter_handle}`}
          target="_blank"
          className={styles.frameALink}
        >
          <div className={styles.frameA}>
            <div className={styles.maxKriegerParent}>
              <h4 className={styles.maxKrieger} id="twitter-name">
                {user?.name}
              </h4>
              <div className={`${styles.maxkriegers} ${colorClass}`}>@{user?.twitter_handle}</div>
              <TwitterLogo fill={svgImage} className={styles.vectorIcon1}  />
            </div>
            <FollowedBy profile={profile} />
          </div>
        </a>
        <div className={styles.lookingToLive} id="looking-for-text">
          <div className={styles.content}>
            <span className={styles.wants}>About me: </span>
            {isHousingSearchProfile(profile) ? profile.pref_housemate_details : profile.pref_house_details}
            {isHousingSearchProfile(profile) ? (
              <SeeMoreButton color={color} seeMoreText={profile.pref_housemate_details ?? ""} />
            ) : isOrganizerProfile(profile) ? (
              <SeeMoreButton color={color} seeMoreText={profile.pref_house_details ?? ""} />
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
            {isHousingSearchProfile(profile)
              ? housingMap.moveIn[profile.pref_move_in ?? 1]
              : isOrganizerProfile(profile) ? housingMap.moveIn[profile.pref_lease_start ?? 1] : null}
          </span>
        </p>
      </div>
    </li>
  );
};

export default ProfileCard;
