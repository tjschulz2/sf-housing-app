"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../components/profile-card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHousingSearchProfiles } from "../../../lib/utils/data";

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

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>👋 Are you looking for housemates?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the People looking
          directory so you can be discovered by communities and organizers
        </span>
        <Link className={styles.addMeButton} href="/housemates-form">
          Add me
        </Link>
      </div>
      <h2>Today</h2>
      <div className={styles.containerGrid}>
        {profiles?.map((profile) => (
          <ProfileCard key={profile.profile_id} profile={profile} color="blue" />
        ))}
      </div>
    </>
  );
}

export default Directory;
