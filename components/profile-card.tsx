"use client";
import styles from "./profile-card.module.css";
import SeeMoreButton from "./see-more-button/see-more-button";
import { housingMap } from "../lib/prefMap";
import { cleanURL, addProtocolToURL } from "../lib/utils/general";
import { FollowedBy } from "./followed-by/followed-by";
import TwitterLogo from '../src/images/twitter-logo.svg'
import ContactMeButton  from '../components/contactme-button/contactme-button'
import React, { useState, useEffect } from 'react'
import { getImageLink } from "../lib/utils/process";

type ProfileCardProps = {
  profile: HousingSearchProfile | OrganizerProfile | CommunityProfile;
  color: string; // Define color as a string type (or whatever type your color variable is)
};

const ProfileCard = ({ profile, color }: ProfileCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { user } = profile;
  let colorClass: any;
  let svgImage: string;
  let colorClassWrapper: any;
  if (color === 'purple') {
    colorClass = styles.colorPurple;
    svgImage = "#6B31E7"
    colorClassWrapper = styles.backgroundPurple
  } else if (color === 'green') {
    colorClass = styles.colorGreen;  // Make sure to define colorGreen in your styles
    svgImage = "#25CB8F"
    colorClassWrapper = styles.backgroundGreen
  } else {
    colorClass = styles.colorBlue;
    svgImage = "#3191e7"
    colorClassWrapper = styles.backgroundBlue
  }

  function isHousingSearchProfile(profile: HousingSearchProfile | OrganizerProfile | CommunityProfile): profile is HousingSearchProfile {
    return (profile as HousingSearchProfile).pref_housemate_details !== undefined;
  }
  
  function isOrganizerProfile(profile: HousingSearchProfile | OrganizerProfile | CommunityProfile): profile is OrganizerProfile {
    return (profile as OrganizerProfile).pref_house_details !== undefined;
  }

  function isCommunityProfile(profile: HousingSearchProfile | OrganizerProfile | CommunityProfile): profile is CommunityProfile {
    return (profile as CommunityProfile).resident_count !== undefined;
  }


  useEffect(() => {
    if (isCommunityProfile(profile) && profile.user_id) {
      getImageLink(profile.user_id)
        .then((url: string | Error) => {
          if (typeof url === 'string') {
            setImageUrl(url);
          }
        })
        .catch((error) => console.error('Error fetching image:', error));
    }
  }, [profile.user_id]);

  const renderHousingAndOrganizerOrCommunity = () => {

    if (!isCommunityProfile(profile) && (isOrganizerProfile(profile) || isHousingSearchProfile(profile))) {
      let contactMethod = ""
      if (profile.pref_contact_method) {
        contactMethod = profile.pref_contact_method;
      }
      let userName = user?.name || ""
      if (userName.length > 16) {
        userName = userName?.substring(0,15) + "...";
      }
      let link = profile.link || ""
      link = cleanURL(link);
      if (link.length > 14) {
        link = link.substring(0,14) + "...";
      }
      let housingDescription = "";
      if (isHousingSearchProfile(profile)) {
        housingDescription = profile.pref_housemate_details ?? "";
        if (housingDescription.length > 45) {
          housingDescription = housingDescription.substring(0,43) + "..."
          console.log(housingDescription)
        }
      }
      let organizerDescription = "";
      if (isOrganizerProfile(profile)) {
        organizerDescription = profile.pref_house_details ?? "";
        if (organizerDescription.length > 45) {
          organizerDescription = organizerDescription.substring(0,43) + "..."
        }
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
            <ContactMeButton contactMethod={contactMethod} color={color} />
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
                  {userName}
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
              {isHousingSearchProfile(profile) ? housingDescription : organizerDescription}
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
      ) 
    } else if (isCommunityProfile(profile)) {
      let contactMethod = ""
      console.log(profile.image_url)
      if (profile.pref_contact_method) {
        contactMethod = profile.pref_contact_method;
      }
      let userName = user?.name || ""
      if (userName.length > 16) {
        userName = userName?.substring(0,15) + "...";
      }
      let link = profile.website_url || ""
      link = cleanURL(link);
      if (link.length > 14) {
        link = link.substring(0,14) + "...";
      }
      let communityDescription = "";
      if (isCommunityProfile(profile)) {
        communityDescription = profile.description ?? "";
        if (communityDescription.length > 45) {
          communityDescription = communityDescription.substring(0,43) + "..."
        }
      }

      return (
        <li className={styles.frameParent} id="profile-card-element">
          <div className={styles.image3Parent}>
            {profile.image_url ? (
              <img
                className={styles.image3Icon}
                alt=""
                src={imageUrl || undefined}
              />
            ) : user?.twitter_avatar_url ? (
              <img
                className={styles.image3Icon}
                alt=""
                src={user.twitter_avatar_url}
              />
            ) : null}
            <div className={styles.frameGroup}>
              <ContactMeButton contactMethod={contactMethod} color={color} />
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
                <img className={styles.locationIcon} alt="" src="/location.svg" />
                <p className={styles.sanFrancisco} id="location">
                  San Francisco
                </p>
              </div>
              <div className={styles.locationParent}>
                <img className={styles.locationIcon} alt="" src="/threepeople.svg" />
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
                <div className={styles.nameAndHandleContainer}>
                  <div className={`${styles.maxKrieger} ${styles.biggerExtension}`}>{userName}</div>
                  <div className={`${styles.maxkriegers} ${styles.smallExtension} ${colorClass}`}>{user?.twitter_handle}</div>
                  <TwitterLogo fill={svgImage} className={styles.vectorIcon1}  />
                </div>
                <FollowedBy profile={profile} />
              </div>
            </a>
            <div className={styles.lookingToLive} id="looking-for-text">
              <div className={styles.content}>
                <span className={styles.wants}>About us: </span>
                {communityDescription}
                <SeeMoreButton color={color} seeMoreText={profile.description ?? ""} />
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
          </div>
        </li>
      );
    } else {
      return null;
    }
  }

  return (
    <div>
      {renderHousingAndOrganizerOrCommunity()}
    </div>
  );
};

export default ProfileCard;
