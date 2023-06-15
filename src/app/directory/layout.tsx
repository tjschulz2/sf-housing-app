"use client";
import styles from "./page.module.css";
import Navbar from "../../../components/navbar/navbar";
import Link from "next/link";
import InviteButton from "../../../components/invite-button/invite-button";
import { signout } from "../../../lib/utils/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "../../../lib/utils/auth";
import { getUserData } from "../../../lib/utils/data";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    async function checkSession() {
      const user = await getUserSession();
      if (!user) {
        await signout();
        router.push("/#");
      }
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
            <Link className={styles.settingsButton} href="/settings">
              <img className={styles.gearIcon} alt="" src="/gearIcon.svg" />
            </Link>
            <Link href="/logout" className={styles.signOutButton}>
              Sign out
            </Link>
          </div>
        </div>
        <Navbar />
      </div>
      <div className={styles.directoryContainer}>{children}</div>
    </div>
  );
}
