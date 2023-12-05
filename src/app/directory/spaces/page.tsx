"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../components/profile-card";
import React, { useState, useEffect } from "react";
import { getCommunities } from "../../../lib/utils/data";
import Link from "next/link";
import { differenceInDays } from "date-fns";
import ActiveSpaceBanner from "@/components/spaces/active-space-banner";
import { useSpacesContext } from "@/contexts/spaces-context";
import EditSpaceListingDialog from "@/components/spaces/edit-space-listing-dialog";

const Directory = () => {
  const [profiles, setProfiles] = useState<CommunityProfile[]>();
  const { userSpaceListing, pullSpaceListings, spaceListings } =
    useSpacesContext();

  // useEffect(() => {
  //   async function pullProfiles() {
  //     const profiles = await getCommunities();
  //     if (profiles) {
  //       setProfiles(profiles);
  //     }
  //   }
  //   pullProfiles();
  // }, []);

  useEffect(() => {
    pullSpaceListings();
  }, [pullSpaceListings]);

  const todayProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 1
  );
  const thisWeekProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 7 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 1
  );
  const thisMonthProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 31 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 7
  );
  const olderProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 31
  );

  return (
    <>
      {userSpaceListing ? (
        <ActiveSpaceBanner />
      ) : (
        <div className={styles.lookingHousematesContainer}>
          <h2 className="text-xl font-bold mb-4">
            Do you have a vacant room, sublet, or coliving house?
          </h2>
          <span className={styles.addInfoText}>
            Add your space to be discovered by people looking for housing
          </span>
          <EditSpaceListingDialog newListing={true}>
            <button className={styles.addMeButton}> Add my space</button>
          </EditSpaceListingDialog>
          {/* <Link className={styles.addMeButton} href="/community-form">
            Add my space
          </Link> */}
        </div>
      )}
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Today</h2>
          <div className={styles.containerGrid}>
            {todayProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="green"
              />
            ))}
          </div>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Week</h2>
          <div className={styles.containerGrid}>
            {thisWeekProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="green"
              />
            ))}
          </div>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Month</h2>
          <div className={styles.containerGrid}>
            {thisMonthProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="green"
              />
            ))}
          </div>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Older</h2>
          <div className={styles.containerGrid}>
            {olderProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="green"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Directory;
