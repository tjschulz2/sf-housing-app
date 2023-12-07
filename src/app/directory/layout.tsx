"use client";
import styles from "./page.module.css";
import Navbar from "../../components/navbar/navbar";
import InviteButton from "../../components/invite-button/invite-button";
import { signout } from "../../lib/utils/auth";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "../../lib/utils/auth";
import { getUserData, getUserHousingSearchProfile } from "../../lib/utils/data";
import Dropdown from "../../components/dropdown/dropdown";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { useAuthContext } from "@/contexts/auth-context";
import SpacesContextProvider from "@/contexts/spaces-context";

export type ProfilesContextType = {
  searcherProfiles: HousingSearchProfile[] | null;
  setSearcherProfiles: Dispatch<SetStateAction<HousingSearchProfile[]>>;
  searcherProfilesFilter: SearcherProfilesFilterType;
  setSearcherProfilesFilter: Dispatch<
    SetStateAction<SearcherProfilesFilterType>
  >;
  userHousingSearchProfile: UserHousingSearchProfile;
  refreshUserHousingSearchProfileData: (userID: string) => Promise<void>;
  userSession: CoreUserSessionData;
};

export type UserHousingSearchProfile =
  | Database["public"]["Tables"]["housing_search_profiles"]["Row"]
  | null;

export const ProfilesContext = createContext<ProfilesContextType | null>(null);

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userHousingSearchProfile, setUserHousingSearchProfile] =
    useState<UserHousingSearchProfile>(null);
  const router = useRouter();
  const [searcherProfiles, setSearcherProfiles] = useState<
    HousingSearchProfile[]
  >([]);
  const [searcherProfilesFilter, setSearcherProfilesFilter] =
    useState<SearcherProfilesFilterType>({});

  const { userData, userSession, authLoading } = useAuthContext();

  useEffect(() => {
    async function handleAuthCheck() {
      if (!authLoading) {
        if (!userSession) {
          router.replace("/");
          return;
        }

        if (!userData) {
          await signout();
          router.replace("/");
          return;
        }

        await refreshUserHousingSearchProfileData(userSession.userID);
      }
    }
    handleAuthCheck();
  }, [authLoading, router, userData, userSession]);

  // useEffect(() => {
  //   async function pullUserData() {
  //     const userSession = await getUserSession();
  //     if (!userSession) {
  //       router.replace("/");
  //       return;
  //     }

  //     const userData = await getUserData(userSession.userID);
  //     if (!userData) {
  //       await signout();
  //       router.replace("/");
  //       return;
  //     }
  //     if (!userData.contact_email) {
  //       router.push("/email-signup");
  //     }

  //     await refreshUserHousingSearchProfileData(userSession.userID);

  //     const user = {
  //       twitterAvatarUrl: userSession.twitterAvatarURL,
  //     };
  //     setUser(user);
  //   }
  //   pullUserData();
  // }, [router]);

  async function refreshUserHousingSearchProfileData(userID: string) {
    const userSearchProfile = await getUserHousingSearchProfile(userID);
    setUserHousingSearchProfile(userSearchProfile || null);
  }

  if (userSession && userData) {
    return (
      // <div className={styles.container}>
      <div className="p-4 md:p-12 max-w-screen-xl	mx-auto">
        <div>
          <div className={styles.topArea}>
            <div className={styles.directoryInviteSettings}>
              <h1 className="text-3xl font-bold my-4">Directory</h1>
              <div className={styles.inviteSettingsContainer}>
                <InviteButton />
                <Dropdown userAvatarURL={userSession.twitterAvatarURL} />
              </div>
            </div>
            <Navbar />
          </div>
          <ProfilesContext.Provider
            value={{
              searcherProfiles,
              setSearcherProfiles,
              searcherProfilesFilter,
              setSearcherProfilesFilter,
              userHousingSearchProfile,
              refreshUserHousingSearchProfileData,
              userSession: user,
            }}
          >
            <SpacesContextProvider>
              <div className={styles.directoryContainer}>{children}</div>
            </SpacesContextProvider>
          </ProfilesContext.Provider>
        </div>
        <Footer />
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
}
