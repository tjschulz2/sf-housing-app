"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../components/profile-card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHousingSearchProfiles } from "../../../lib/utils/data";
import { differenceInDays } from 'date-fns'; 

function Directory() {
  const [profiles, setProfiles] = useState<HousingSearchProfile[]>();

  useEffect(() => {
    async function pullProfiles() {
      const profiles = await getHousingSearchProfiles();
      if (profiles) {
        setProfiles(profiles);
      }
    }
    pullProfiles();
  }, []);

  const todayProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 1);
  const thisWeekProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 7 && differenceInDays(new Date(), new Date(profile.created_at || '')) >= 1);
  const thisMonthProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 31 && differenceInDays(new Date(), new Date(profile.created_at || '')) >= 7);
  const olderProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) >= 31);

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>👋 Are you looking for housing?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Looking for housing
          directory so you can be discovered by communities and organizers
        </span>
        <Link className={styles.addMeButton} href="/housemates-form">
          Add me
        </Link>
      </div>
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2>Today</h2>
          <div className={styles.containerGrid}>
            {todayProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="blue" />
            ))}
          </div>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2>This Week</h2>
          <div className={styles.containerGrid}>
            {thisWeekProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="blue" />
            ))}
          </div>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2>This Month</h2>
          <div className={styles.containerGrid}>
            {thisMonthProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="blue" />
            ))}
          </div>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2>Older</h2>
          <div className={styles.containerGrid}>
            {olderProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="blue" />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Directory;
