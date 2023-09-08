"use client";
import styles from "./page.module.css";
import Navbar from "../../../components/navbar/navbar";
import InviteButton from "../../../components/invite-button/invite-button";
import { signout } from "../../../lib/utils/auth";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "../../../lib/utils/auth";
import {
  getUserData,
  getUserHousingSearchProfile,
} from "../../../lib/utils/data";
import Dropdown from "../../../components/dropdown/dropdown";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner";

export type ProfilesContextType = {
  searcherProfiles: HousingSearchProfile[] | null;
  setSearcherProfiles: Dispatch<SetStateAction<HousingSearchProfile[]>>;
  userHousingSearchProfile: UserHousingSearchProfile;
};

type User = {
  twitterAvatarUrl: string;
};

type UserHousingSearchProfile =
  | Database["public"]["Tables"]["housing_search_profiles"]["Row"]
  | null;

export const ProfilesContext = createContext<ProfilesContextType | null>(null);

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userHousingSearchProfile, setUserHousingSearchProfile] =
    useState<UserHousingSearchProfile>(null);
  const router = useRouter();
  const [searcherProfiles, setSearcherProfiles] = useState<
    HousingSearchProfile[]
  >([]);

  useEffect(() => {
    async function pullUserData() {
      const userSession = await getUserSession();
      if (!userSession) {
        router.replace("/");
        return;
      }

      const userData = await getUserData(userSession.userID);
      if (!userData) {
        await signout();
        router.replace("/");
        return;
      }
      if (!userData.contact_email) {
        router.push("/email-signup");
      }

      const userSearchProfile = await getUserHousingSearchProfile(
        userSession.userID
      );
      if (userSearchProfile) {
        setUserHousingSearchProfile(userSearchProfile);
      }

      const user = {
        twitterAvatarUrl: userSession.twitterAvatarURL,
      };
      setUser(user);
    }
    pullUserData();
  }, [router]);
  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.topArea}>
          <div className={styles.directoryInviteSettings}>
            <h1>Directory</h1>
            <div className={styles.inviteSettingsContainer}>
              <InviteButton />
              {user && <Dropdown userAvatarURL={user.twitterAvatarUrl} />}
            </div>
          </div>
          <Navbar />
        </div>
        <ProfilesContext.Provider
          value={{
            searcherProfiles,
            setSearcherProfiles,
            userHousingSearchProfile,
          }}
        >
          <div className={styles.directoryContainer}>{children}</div>
        </ProfilesContext.Provider>

        <a href="https://github.com/tjschulz2/sf-housing-app">
          Want to see a new feature on DirectorySF? Submit a pull request!
          DirectorySF is open-source.
        </a>
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
}
