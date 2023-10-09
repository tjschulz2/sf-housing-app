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
import ActiveProfileBanner from "@/components/active-profile-banner";
import EditSearcherProfileDialog from "@/components/edit-searcher-profile-dialog";
import { getUserSession } from "@/lib/utils/auth";

function Directory() {
  const {
    searcherProfiles,
    setSearcherProfiles,
    searcherProfilesFilter,
    setSearcherProfilesFilter,
    userHousingSearchProfile,
  } = useContext(ProfilesContext) as ProfilesContextType;
  const [currentUserData, setCurrentUserData] = useState<CoreUserSessionData>();
  const allowDataPull = useRef(false);
  const allDataRetrieved = useRef(false);
  const [dataLoading, setDataLoading] = useState(true);
  const initialPullRequired = useRef(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    async function pullSessionData() {
      const userSession = await getUserSession();
      if (userSession) {
        setCurrentUserData(userSession);
      }
    }
    pullSessionData();
  }, []);

  const pullNextBatch = useCallback(async () => {
    if (!searcherProfiles?.length || allDataRetrieved.current) {
      console.log("skipping pull");
      return;
    }
    const additionalProfiles = await getHousingSearchProfiles(
      searcherProfiles.length,
      10,
      searcherProfilesFilter
    );

    if (additionalProfiles?.length) {
      setSearcherProfiles((prevProfiles) => [
        ...prevProfiles,
        ...additionalProfiles,
      ]);
    } else {
      allDataRetrieved.current = true;
    }
  }, [searcherProfiles, searcherProfilesFilter, setSearcherProfiles]);

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
      setDataLoading(true);
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

    if (initialPullRequired.current) {
      initialPullRequired.current = false;
      pullProfiles();
    }
  }, [setSearcherProfiles, searcherProfilesFilter]);

  const todayProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
      1
  );
  const thisWeekProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
        7 &&
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
        1
  );
  const thisMonthProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) <
        31 &&
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
        7
  );
  const olderProfiles = searcherProfiles?.filter(
    (profile) =>
      differenceInDays(new Date(), new Date(profile.last_updated_date || "")) >=
      31
  );

  function handleFilterChange(filterData: SearcherProfilesFilterType) {
    for (const [filterKey, filterVal] of Object.entries(filterData)) {
      const stateFilterVal =
        searcherProfilesFilter[filterKey as keyof SearcherProfilesFilterType] ||
        "";
      if (stateFilterVal !== filterVal) {
        refreshProfileData(filterData);
      }
    }
  }

  function refreshProfileData(filterData: SearcherProfilesFilterType = {}) {
    setDataLoading(true);
    allDataRetrieved.current = false;
    initialPullRequired.current = true;
    setSearcherProfiles([]);
    const newFilterState = { ...searcherProfilesFilter, ...filterData };
    setSearcherProfilesFilter(newFilterState);
    return;
  }

  return (
    <>
      <div className="mb-8">
        {userHousingSearchProfile ? (
          <ActiveProfileBanner refreshProfileData={refreshProfileData} />
        ) : (
          <div className={styles.lookingHousematesContainer}>
            <h2 className="text-xl font-bold mb-4">
              👋 Are you looking for housing?
            </h2>
            <span className={styles.addInfoText}>
              Add your information here to be discovered by communities and
              organizers
            </span>
            <EditSearcherProfileDialog
              newProfile={true}
              refreshProfileData={refreshProfileData}
            >
              <button className={styles.addMeButton}>Add me</button>
            </EditSearcherProfileDialog>
          </div>
        )}
      </div>
      <FilterBar
        onFilterChange={handleFilterChange}
        filterState={searcherProfilesFilter}
      />
      {dataLoading && !searcherProfiles?.length ? (
        <LoadingSpinner overlay={false} />
      ) : null}
      {!dataLoading && !searcherProfiles?.length ? (
        <p className="m-auto p-4 italic text-neutral-600">No data</p>
      ) : null}
      {todayProfiles && todayProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Today</h2>
          <div className={styles.containerGrid}>
            {todayProfiles.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                color="blue"
                curUserName={currentUserData?.twitterName}
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
                color="blue"
                curUserName={currentUserData?.twitterName}
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
                color="blue"
                curUserName={currentUserData?.twitterName}
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
                color="blue"
                curUserName={currentUserData?.twitterName}
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
