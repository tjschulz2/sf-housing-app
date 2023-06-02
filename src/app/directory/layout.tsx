import styles from "./page.module.css";
import InvitePopup from "../../../components/invite-popup-component";
import Navbar from "../../../components/navbar/navbar";
import Link from "next/link";
import InviteButton from "../../../components/invite-button/invite-button";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <div className={styles.directoryInviteSettings}>
          <h1>Directory</h1>
          <div className={styles.inviteSettingsContainer}>
            <InviteButton />
            <InvitePopup />
            <Link className={styles.settingsButton} href="/settings">
              <img className={styles.gearIcon} alt="" src="/gearIcon.svg" />
            </Link>
          </div>
        </div>
        <Navbar />
      </div>
      <div className={styles.directoryContainer}>{children}</div>
    </div>
  );
}
