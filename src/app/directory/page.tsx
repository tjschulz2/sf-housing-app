"use client";
import styles from "./page.module.css";
import ProfileCard from "../../components/profile-card";
import Link from "next/link";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { getHousingSearchProfiles } from "../../lib/utils/data";
import { differenceInDays } from "date-fns";
import { ProfilesContext, ProfilesContextType } from "./layout";
import FilterBar from "../../components/filter-bar/filter-bar";

function Directory() {
  const { searcherProfiles, setSearcherProfiles } = useContext(
    ProfilesContext
  ) as ProfilesContextType;
  const allowDataPull = useRef(false);
  const [allDataRetrieved, setAllDataRetrieved] = useState(false);

  const observerTarget = useRef(null);

  const pullNextBatch = useCallback(async () => {
    if (!searcherProfiles?.length || allDataRetrieved) {
      console.log("skipping pull");
      return;
    }
    const additionalProfiles = await getHousingSearchProfiles(
      searcherProfiles.length,
      10
    );

    if (additionalProfiles?.length) {
      setSearcherProfiles((prevProfiles) => [
        ...prevProfiles,
        ...additionalProfiles,
      ]);
    } else {
      setAllDataRetrieved(true);
    }
  }, [searcherProfiles, setSearcherProfiles, allDataRetrieved]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && allowDataPull.current) {
          pullNextBatch();
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
  }, [observerTarget, pullNextBatch, allowDataPull]);

  useEffect(() => {
    async function pullProfiles() {
      const profiles = await getHousingSearchProfiles(0, 25);
      if (profiles) {
        setSearcherProfiles(profiles);
      }
    }
    if (!searcherProfiles?.length) {
      pullProfiles();
    }
  }, [setSearcherProfiles, searcherProfiles]);

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
        <h2 className="text-xl font-bold mb-4">👋 Are you looking for housing?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Looking for housing
          directory so you can be discovered by communities and organizers
        </span>
        <Link className={styles.addMeButton} href="/housemates-form">
          Add me
        </Link>
      </div>
      <FilterBar />
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
          <h2 className="text-2xl font-bold my-4">This Week</h2>
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
          <h2 className="text-2xl font-bold my-4">This Month</h2>
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
          <h2 className="text-2xl font-bold my-4">Older</h2>
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

      <div ref={observerTarget}></div>
    </>
  );
}

export default Directory;
