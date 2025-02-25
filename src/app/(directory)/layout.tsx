"use client";
import styles from "./page.module.css";
import Navbar from "../../components/navbar/navbar";
import InviteButton from "../../components/invite-button/invite-button";
import HeaderBarInApp from "@/components/headerbarinapp";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { useAuthContext } from "@/contexts/auth-context";
import SpacesContextProvider from "@/contexts/spaces-context";
import { getUserHousingSearchProfile } from "@/dal";

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
    refreshUserHousingSearchProfileData();
  }, [authLoading, router, userData, userSession]);

  async function refreshUserHousingSearchProfileData() {
    const userSearchProfile = await getUserHousingSearchProfile();
    setUserHousingSearchProfile(userSearchProfile || null);
  }

  return (
    <div className={`w-full bg-[#FEFBEB] min-h-dvh`}>
      <HeaderBarInApp />
      <div className="bg-grid-green-800/[0.1] relative flex flex-col items-center justify-center">
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
  );
}
