"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../../components/profile-card";
import React, { useState, useEffect } from "react";
import { getCommunities } from "../../../../lib/utils/data";
import Link from "next/link";

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
      <h2>Today</h2>
      <div className={styles.containerGrid}>
        {profiles?.map((profile) => (
          <ProfileCard key={profile.profile_id} profile={profile} color="green" />
        ))}
      </div>
    </>
  );
};

export default Directory;
