"use client";
import styles from "./profile-card.module.css";
import SeeMoreButton from "./see-more-button/see-more-button";
import { housingMap } from "../lib/prefMap";
import { cleanURL, addProtocolToURL } from "../lib/utils/general";
import { useEffect, useState } from "react";
import { getFollowIntersection } from "../lib/utils/data";
import { FollowedBy } from "./followed-by/followed-by";
const ProfileCard = ({ profile }: { profile: HousingSearchProfile }) => {
  const { user } = profile;

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
            className={styles.contactMeWrapper}
            href={profile.pref_contact_method || "https://google.com"}
            target="_blank"
          >
            <p className={styles.contactMe}>Contact me</p>
          </a>
          {profile.link ? (
            <a
              className={styles.vectorParent}
              href={addProtocolToURL(profile.link)}
              target="_blank"
            >
              <img className={styles.vectorIcon} alt="" src="/link.svg" />
              <div className={styles.a9io}>{cleanURL(profile.link)}</div>
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
              <div className={styles.maxkriegers}>@{user?.twitter_handle}</div>
              <img
                className={styles.vectorIcon1}
                alt=""
                src="/twitter-logo.svg"
              />
            </div>
            {/* <sub className={styles.followedBy980} id="followed-by">
              Followed by 980+ people you follow
            </sub> */}
            <FollowedBy profile={profile} />
          </div>
        </a>
        <div className={styles.lookingToLive} id="looking-for-text">
          <div className={styles.content}>
            <span className={styles.wants}>About me: </span>
            {profile.pref_housemate_details}
            {profile.pref_housemate_details ? (
              <SeeMoreButton seeMoreText={profile.pref_housemate_details} />
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
          {/* <span>{` Now -> August 2023`}</span> */}
          <span>
            {" "}
            {profile.pref_move_in
              ? housingMap.moveIn[profile.pref_move_in]
              : null}
          </span>
        </p>
      </div>
    </li>
  );
};

export default ProfileCard;
