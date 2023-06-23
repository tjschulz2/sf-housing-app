"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../../components/profile-card";
import React, { useState, useEffect } from "react";
import { getCommunities } from "../../../../lib/utils/data";
import Link from "next/link";
import { differenceInDays } from 'date-fns'; 

const Directory: NextPage = () => {
  const [profiles, setProfiles] = useState<CommunityProfile[]>();

  useEffect(() => {
    async function pullProfiles() {
      const profiles = await getCommunities();
      if (profiles) {
        setProfiles(profiles);
      }
    }
    pullProfiles();
  }, []);

  const data = Array.from({ length: 20 }, (_, i) => i + 1);
  const todayProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 1);
  const thisWeekProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 7 && differenceInDays(new Date(), new Date(profile.created_at || '')) >= 1);
  const thisMonthProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) < 31 && differenceInDays(new Date(), new Date(profile.created_at || '')) >= 7);
  const olderProfiles = profiles?.filter((profile) => differenceInDays(new Date(), new Date(profile.created_at || '')) >= 31);

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>Do you already have an apartment or coliving house?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Existing communities
          directory so you can be discovered by people looking for housing
        </span>
        <Link className={styles.addMeButton} href="/community-form">
          Add my community house
        </Link>
      </div>
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2>Today</h2>
          <div className={styles.containerGrid}>
            {todayProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="green" />
            ))}
          </div>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2>This Week</h2>
          <div className={styles.containerGrid}>
            {thisWeekProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="green" />
            ))}
          </div>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2>This Month</h2>
          <div className={styles.containerGrid}>
            {thisMonthProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="green" />
            ))}
          </div>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2>Older</h2>
          <div className={styles.containerGrid}>
            {olderProfiles.map((profile) => (
              <ProfileCard key={profile.profile_id} profile={profile} color="green" />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Directory;
