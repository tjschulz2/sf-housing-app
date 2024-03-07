"use client";
import styles from "./page.module.css";
import ProfileCard from "../../../components/profile-card";
import React, { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import ActiveSpaceBanner from "@/components/spaces/active-space-banner";
import { useSpacesContext } from "@/contexts/spaces-context";
import EditSpaceListingDialog from "@/components/spaces/edit-space-listing-dialog";
import SpaceProfileCard from "@/components/cards/space-profile-card";
import CardGrid from "@/components/cards/card-grid";

const Directory = () => {
  const { userSpaceListing, pullSpaceListings, spaceListings } =
    useSpacesContext();

  useEffect(() => {
    pullSpaceListings();
  }, [pullSpaceListings]);

  const todayProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
      1
  );
  const thisWeekProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
        7 &&
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
        1
  );
  const thisMonthProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
        31 &&
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
        7
  );
  const olderProfiles = spaceListings?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
      31
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
        </div>
      )}
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Today</h2>
          <CardGrid>
            {todayProfiles.map((profile) => (
              <SpaceProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Week</h2>
          <CardGrid>
            {thisWeekProfiles.map((profile) => (
              <SpaceProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Month</h2>
          <CardGrid>
            {thisMonthProfiles.map((profile) => (
              <SpaceProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Older</h2>
          <CardGrid>
            {olderProfiles.map((profile) => (
              <SpaceProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}
    </>
  );
};

export default Directory;
