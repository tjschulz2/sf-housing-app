"use client";
import styles from "./page.module.css";
import Navbar from "../../components/navbar/navbar";
import InviteButton from "../../components/invite-button/invite-button";
import HeaderBarInApp from "@/components/headerbarinapp";
import { signout } from "../../lib/utils/auth";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserSession } from "../../lib/utils/auth";
import { getUserData, getUserHousingSearchProfile } from "../../lib/utils/data";
import Dropdown from "../../components/dropdown/dropdown";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { useAuthContext } from "@/contexts/auth-context";
import SpacesContextProvider from "@/contexts/spaces-context";
import { LoadScript } from "@react-google-maps/api";
import Head from "next/head";
import OnboardingModal from "@/components/onboarding/onboarding-modal";

export type ProfilesContextType = {
  searcherProfiles: HousingSearchProfile[] | null;
  setSearcherProfiles: Dispatch<SetStateAction<HousingSearchProfile[]>>;
  searcherProfilesFilter: SearcherProfilesFilterType;
  setSearcherProfilesFilter: Dispatch<
    SetStateAction<SearcherProfilesFilterType>
  >;
  userHousingSearchProfile: UserHousingSearchProfile;
  refreshUserHousingSearchProfileData: (userID: string) => Promise<void>;
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

  const pathname = usePathname();
  const currentPath = pathname;
  const isDirectoryPage = currentPath === "/directory/homes";
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  if (userSession && userData) {
    return (
      // <div className={styles.container}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <div className={`w-full bg-[#FEFBEB] min-h-dvh`}>
          <HeaderBarInApp userSession={userSession} />
          <div className="bg-grid-blue-300/[0.2] relative flex flex-col items-center justify-center">
            <div
              className={`mx-auto w-full z-10 px-10 ${styles.responsivePadding}`}
            >
              <div>
                <div className={styles.topArea}>
                  <div className={styles.navbarContainer}>
                    <Navbar />
                  </div>
                </div>
                <ProfilesContext.Provider
                  value={{
                    searcherProfiles,
                    setSearcherProfiles,
                    searcherProfilesFilter,
                    setSearcherProfilesFilter,
                    userHousingSearchProfile,
                    refreshUserHousingSearchProfileData,
                  }}
                >
                  <SpacesContextProvider>
                    <div className={styles.directoryContainer}>{children}</div>
                  </SpacesContextProvider>
                </ProfilesContext.Provider>
              </div>
              <Footer />
            </div>
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#FEFBEB] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
        </div>
        <OnboardingModal />
      </LoadScript>
    );
  } else {
    return <LoadingSpinner />;
  }
}
