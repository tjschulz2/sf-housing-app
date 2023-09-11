"use client";
import styles from "./page.module.css";
import ProfileCard from "../../components/profile-card";
import Link from "next/link";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { getHousingSearchProfiles } from "../../lib/utils/data";
import { differenceInDays } from "date-fns";
import { ProfilesContext, ProfilesContextType } from "./layout";
import FilterBar from "../../components/filter-bar";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";

function Directory() {
  const {
    searcherProfiles,
    setSearcherProfiles,
    searcherProfilesFilter,
    setSearcherProfilesFilter,
  } = useContext(ProfilesContext) as ProfilesContextType;
  const allowDataPull = useRef(false);
  const [allDataRetrieved, setAllDataRetrieved] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  // const initialPullRequired = useRef(true);

  const observerTarget = useRef(null);

  const pullNextBatch = useCallback(async () => {
    if (!searcherProfiles?.length || allDataRetrieved) {
      console.log("skipping pull");
      return;
    }
    const additionalProfiles = await getHousingSearchProfiles(
      searcherProfiles.length,
      10,
      searcherProfilesFilter
    );
    console.log({ additionalProfiles });

    if (additionalProfiles?.length) {
      setSearcherProfiles((prevProfiles) => [
        ...prevProfiles,
        ...additionalProfiles,
      ]);
    } else {
      setAllDataRetrieved(true);
    }
  }, [
    searcherProfiles,
    allDataRetrieved,
    searcherProfilesFilter,
    setSearcherProfiles,
  ]);

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
  }, [observerTarget, pullNextBatch]);

  useEffect(() => {
    async function pullProfiles() {
      // initialPullRequired.current = false;
      const profiles = await getHousingSearchProfiles(
        0,
        25,
        searcherProfilesFilter
      );
      if (profiles) {
        setSearcherProfiles(profiles);
      }
      setDataLoading(false);
    }

    pullProfiles();

    // if (initialPullRequired.current) {
    //   pullProfiles();
    // }
  }, [setSearcherProfiles, searcherProfilesFilter]);

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

  function handleFilterChange(filterData: SearcherProfilesFilterType) {
    for (const [filterKey, filterVal] of Object.entries(filterData)) {
      const stateFilterVal =
        searcherProfilesFilter[filterKey as keyof SearcherProfilesFilterType] ||
        "";
      if (stateFilterVal !== filterVal) {
        // update state to match filter
        setDataLoading(true);
        setAllDataRetrieved(false);
        const newFilterState = { ...searcherProfilesFilter, ...filterData };
        setSearcherProfilesFilter(newFilterState);
        return;
      }
    }
    // todo: only set to state if obect is not equal to state object.
    // Add useEffect to watch for state change and trigger data pull.
    // Subsequent infinite scroll calls should use filter state
  }

  useEffect(() => {
    console.log("state updated: ", searcherProfilesFilter);
  }, [searcherProfilesFilter]);

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2 className="text-xl font-bold mb-4">
          👋 Are you looking for housing?
        </h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Looking for housing
          directory so you can be discovered by communities and organizers
        </span>
        <Link className={styles.addMeButton} href="/housemates-form">
          Add me
        </Link>
      </div>
      <FilterBar
        onFilterChange={handleFilterChange}
        filterState={searcherProfilesFilter}
      />
      {dataLoading ? <LoadingSpinner overlay={false} /> : null}
      {!dataLoading && !searcherProfiles?.length ? (
        <p className="m-auto p-4 italic text-neutral-600">No data</p>
      ) : null}
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
