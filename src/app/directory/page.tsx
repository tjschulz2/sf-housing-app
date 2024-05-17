"use client";
import styles from "./page.module.css";
import ProfileCard from "../../components/profile-card";
import SearcherProfileCard from "@/components/cards/searcher-profile-card";
import Link from "next/link";
import {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getHousingSearchProfiles } from "../../lib/utils/data";
import { differenceInDays } from "date-fns";
import { ProfilesContext, ProfilesContextType } from "./layout";
import FilterBar from "../../components/filter-bar";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import ActiveProfileBanner from "@/components/active-profile-banner";
import EditSearcherProfileDialog from "@/components/edit-searcher-profile-dialog";
import CardGrid from "@/components/cards/card-grid";
import { Button } from "@/components/ui/button";

function Directory() {
  const {
    searcherProfiles,
    setSearcherProfiles,
    searcherProfilesFilter,
    setSearcherProfilesFilter,
    userHousingSearchProfile,
  } = useContext(ProfilesContext) as ProfilesContextType;
  // const [currentUserData, setCurrentUserData] = useState<CoreUserSessionData>();
  const allowDataPull = useRef(false);
  const allDataRetrieved = useRef(false);
  const [dataLoading, setDataLoading] = useState(true);
  const initialPullRequired = useRef(true);
  const observerTarget = useRef(null);

  // useEffect(() => {
  //   async function pullSessionData() {
  //     const userSession = await getUserSession();
  //     if (userSession) {
  //       setCurrentUserData(userSession);
  //     }
  //   }
  //   pullSessionData();
  // }, []);

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

  const todayProfiles = useMemo(() => {
    return searcherProfiles?.filter(
      (profile) =>
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) < 1
    );
  }, [searcherProfiles]);

  const thisWeekProfiles = useMemo(() => {
    return searcherProfiles?.filter(
      (profile) =>
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) < 7 &&
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) >= 1
    );
  }, [searcherProfiles]);

  const thisMonthProfiles = useMemo(() => {
    return searcherProfiles?.filter(
      (profile) =>
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) < 31 &&
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) >= 7
    );
  }, [searcherProfiles]);

  const olderProfiles = useMemo(() => {
    return searcherProfiles?.filter(
      (profile) =>
        differenceInDays(
          new Date(),
          new Date(profile.last_updated_date || "")
        ) >= 31
    );
  }, [searcherProfiles]);

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
  }

  // if (!currentUserData) {
  //   return <LoadingSpinner overlay={true} />;
  // }

  return (
    <>
      <div className="mb-8">
        {userHousingSearchProfile ? (
          <ActiveProfileBanner refreshProfileData={refreshProfileData} />
        ) : (
          <div className="flex flex-col p-6 border-[1px] bg-blue-50 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              👋 Are you looking for housing?
            </h2>
            <span className={styles.addInfoText}>
              Create a profile to be discovered by communities and organizers
            </span>
            <EditSearcherProfileDialog
              newProfile={true}
              refreshProfileData={refreshProfileData}
            >
              <Button className="rounded-3xl p-6 bg-blue-700 hover:bg-blue-600 w-fit">
                Add me
              </Button>
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
          <CardGrid>
            {todayProfiles.map((profile) => (
              <SearcherProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {thisWeekProfiles && thisWeekProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Week</h2>
          <CardGrid>
            {thisWeekProfiles.map((profile) => (
              <SearcherProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {thisMonthProfiles && thisMonthProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">This Month</h2>
          <CardGrid>
            {thisMonthProfiles.map((profile) => (
              <SearcherProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      {olderProfiles && olderProfiles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4">Older</h2>
          <CardGrid>
            {olderProfiles.map((profile) => (
              <SearcherProfileCard key={profile.user_id} profile={profile} />
            ))}
          </CardGrid>
        </>
      )}

      <div ref={observerTarget}></div>
    </>
  );
}

export default Directory;
