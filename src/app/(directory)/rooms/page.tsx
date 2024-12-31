"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { differenceInDays } from "date-fns";
import ActiveSpaceBanner from "@/components/spaces/active-space-banner";
import { useSpacesContext } from "@/contexts/spaces-context";
import EditSpaceListingDialog from "@/components/spaces/edit-space-listing-dialog";
import SpaceProfileCard from "@/components/cards/space-profile-card";
import CardGrid from "@/components/cards/card-grid";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { Button } from "@/components/ui/button";
import { RoomSponsorBanner } from "@/components/room-sponsor-banner";
import accelr8Ski from "/public/images/sponsorship/accelr8/accelr8-ski.png";
import Image from "next/image";
const Directory = () => {
  const {
    userSpaceListing,
    pullNextSpaceListingBatch,
    spaceListings,
    allSpaceListingsRetrieved,
  } = useSpacesContext();
  const allowDataPull = useRef(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && allowDataPull.current) {
          pullNextSpaceListingBatch();
          allowDataPull.current = false;
        } else {
          allowDataPull.current = true;
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, pullNextSpaceListingBatch]);

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
      <div className="flex flex-col lg:flex-row">
        <div className="flex justify-center lg:hidden mb-4">
          <Image
            src={accelr8Ski}
            className="max-h-40 w-auto"
            alt="accelr8 sponsorship banner"
          />
        </div>
        <div className="grow">
          {userSpaceListing ? (
            <ActiveSpaceBanner />
          ) : (
            <div className="flex flex-col p-6 border-[1px] bg-[#F7FCEF] rounded-xl">
              <h2 className="text-xl font-bold mb-4">
                🏡 Have a co-living space, sublet, or vacant room?
              </h2>
              <span className={styles.addInfoText}>
                Add your space to be discovered by people looking for housing
              </span>
              <EditSpaceListingDialog newListing={true}>
                {/* <button className={styles.addMeButton}> Add my space</button> */}
                <Button className="rounded-3xl p-6 bg-[#519F69] hover:bg-[#74B183] w-fit">
                  Add my space
                </Button>
              </EditSpaceListingDialog>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center hidden lg:flex ml-4">
          <Image
            src={accelr8Ski}
            className="max-h-48 w-auto"
            alt="accelr8 sponsorship banner"
          />
        </div>
      </div>

      {/* <RoomSponsorBanner /> */}
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
      <div ref={observerTarget}>
        {!allSpaceListingsRetrieved ? <LoadingSpinner overlay={false} /> : null}
      </div>
    </>
  );
};

export default Directory;
