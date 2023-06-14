"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../../components/profile-card";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getOrganizerProfiles } from "../../../../lib/utils/data";

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

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>Do you want to start a community house?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the People organizing
          directory so you can be discovered by people looking for housemates
        </span>
        <Link className={styles.addMeButton} href="/organizer-form">
          Start house
        </Link>
      </div>
      <h2>Today</h2>
      <div className={styles.containerGrid}>
      {profiles?.map((profile) => (
          <ProfileCard key={profile.profile_id} profile={profile} color="purple" />
        ))}
      </div>
    </>
  );
};

export default Directory;
