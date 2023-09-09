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
import { getUserData } from "../../lib/utils/data";
import Dropdown from "../../components/dropdown/dropdown";

export type ProfilesContextType = {
  searcherProfiles: HousingSearchProfile[] | null;
  setSearcherProfiles: Dispatch<SetStateAction<HousingSearchProfile[]>>;
  searcherProfilesFilter: SearcherProfilesFilterType;
  setSearcherProfilesFilter: Dispatch<SetStateAction<SearcherProfilesFilterType>>
};



type User = {
  twitterAvatarUrl: string;
};

export const ProfilesContext = createContext<ProfilesContextType | null>(null);

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [searcherProfiles, setSearcherProfiles] = useState<
    HousingSearchProfile[]
  >([]);
  const [searcherProfilesFilter, setSearcherProfilesFilter] = useState<SearcherProfilesFilterType>({})

  useEffect(() => {
    async function checkSession() {
      const fetchedUser = await getUserSession();
      if (!fetchedUser) {
        await signout();
        router.push("/#");
        return;
      }
      const user: User = {
        twitterAvatarUrl: fetchedUser.twitterAvatarURL,
      };
      setUser(user);
    }
    async function checkUserData() {
      const userData = await getUserData();
      if (userData && !userData.contact_email) {
        router.push("/email-signup");
      }
    }

    checkSession();
    checkUserData();
  }, [router]);
  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <div className={styles.directoryInviteSettings}>
          <h1 className="text-3xl font-bold my-4">Directory</h1>
          <div className={styles.inviteSettingsContainer}>
            <InviteButton />
            {user && <Dropdown user={user} />}
          </div>
        </div>
        <Navbar />
      </div>
      <ProfilesContext.Provider
        value={{ searcherProfiles, setSearcherProfiles, searcherProfilesFilter, setSearcherProfilesFilter }}
      >
        <div className={styles.directoryContainer}>{children}</div>
      </ProfilesContext.Provider>

      <a href="https://github.com/tjschulz2/sf-housing-app">
        Want to see a new feature on DirectorySF? Submit a pull request!
        DirectorySF is open-source.
      </a>
    </div>
  );
}
