"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../components/profile-card";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getOrganizerProfiles } from "../../../lib/utils/data";
import { differenceInDays } from "date-fns";

const Directory: NextPage = () => {
  const [profiles, setProfiles] = useState<OrganizerProfile[]>();

  useEffect(() => {
    async function pullProfiles() {
      const profiles = await getOrganizerProfiles();
      if (profiles) {
        setProfiles(profiles);
      }
    }
    pullProfiles();
  }, []);
  const data = Array.from({ length: 20 }, (_, i) => i + 1);
  const todayProfiles = profiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 1
  );
  const thisWeekProfiles = profiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 7 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 1
  );
  const thisMonthProfiles = profiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 31 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 7
  );
  const olderProfiles = profiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 31
  );

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2 className="text-xl font-bold mb-4">
          Do you want to start a new house?
        </h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Starting a new house
          directory so you can be discovered by people looking for housemates.
        </span>
        <Link className={styles.addMeButton} href="/organizer-form">
          Start house
        </Link>
      </div>
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Today</h2>
          <div className={styles.containerGrid}>
            {todayProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="purple"
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
                color="purple"
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
                color="purple"
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
                color="purple"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Directory;
