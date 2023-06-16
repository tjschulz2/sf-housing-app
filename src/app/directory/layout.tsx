"use client";
import styles from "./page.module.css";
import Navbar from "../../../components/navbar/navbar";
import Link from "next/link";
import InviteButton from "../../../components/invite-button/invite-button";
import { signout } from "../../../lib/utils/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "../../../lib/utils/auth";
import { getUserData } from "../../../lib/utils/data";
import Dropdown from "../../../components/dropdown/dropdown";

type User = {
  twitterAvatarUrl: string;
};

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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
      }
      setUser(user);
    }
    async function checkUserData() {
      const userData = await getUserData();
      if (userData && !userData.contact_email) {
        router.push("/email-signup")
      }
    }

    checkSession();
    checkUserData();
  }, [router]);
  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <div className={styles.directoryInviteSettings}>
          <h1>Directory</h1>
          <div className={styles.inviteSettingsContainer}>
            <InviteButton />
            {user && <Dropdown user={user} />}
          </div>
        </div>
        <Navbar />
      </div>
      <div className={styles.directoryContainer}>{children}</div>
    </div>
  );
}
