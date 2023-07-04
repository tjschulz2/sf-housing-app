"use client";
import styles from "./page.module.css";
import ProfileCard from "../../../components/profile-card";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { getHousingSearchProfiles } from "../../../lib/utils/data";
import { differenceInDays } from "date-fns";
import { ProfilesContext, ProfilesContextType } from "./layout";

function Directory() {
  // const [profiles, setSearcherProfiles] = useState<HousingSearchProfile[]>();
  const { searcherProfiles, setSearcherProfiles } = useContext(
    ProfilesContext
  ) as ProfilesContextType;

  useEffect(() => {
    async function pullProfiles() {
      const profiles = await getHousingSearchProfiles();
      if (profiles) {
        setSearcherProfiles(profiles);
      }
    }
    if (!searcherProfiles?.length) {
      pullProfiles();
    }
  }, []);

  const todayProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 1
  );
  const thisWeekProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 7 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 1
  );
  const thisMonthProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) < 31 &&
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 7
  );
  const olderProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.created_at || "")) >= 31
  );

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
              <ProfileCard
                key={profile.profile_id}
                profile={profile}
                color="blue"
              />
            ))}
          </div>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2>This Week</h2>
          <div className={styles.containerGrid}>
            {thisWeekProfiles.map((profile) => (
              <ProfileCard
                key={profile.profile_id}
                profile={profile}
                color="blue"
              />
            ))}
          </div>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2>This Month</h2>
          <div className={styles.containerGrid}>
            {thisMonthProfiles.map((profile) => (
              <ProfileCard
                key={profile.profile_id}
                profile={profile}
                color="blue"
              />
            ))}
          </div>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2>Older</h2>
          <div className={styles.containerGrid}>
            {olderProfiles.map((profile) => (
              <ProfileCard
                key={profile.profile_id}
                profile={profile}
                color="blue"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Directory;
