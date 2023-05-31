'use client';
import styles from './page.module.css';
import { NextPage } from 'next';
import ProfileCard from '../../../components/profile-card';
import Link from 'next/link'

const Directory: NextPage = () => {
  const data = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <div className={styles.directoryInviteSettings}>
          <h1>Directory</h1>
          <div className={styles.inviteSettingsContainer}>
            <Link className={styles.inviteButton} href="/referral">Invite a friend</Link>
            <Link className={styles.settingsButton} href="/settings">
              <img className={styles.gearIcon} alt="" src="/gearIcon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.sectionButtons}>
          <Link href="/people" className={styles.selectedText}>People looking</Link>
          <Link href="/organizing" className={styles.unselectedText}>People organizing</Link>
          <Link href="/existing" className={styles.unselectedText}>Existing communities</Link>
        </div>
      </div>
      <div>
        <h2>Today</h2>
        <div className={styles.containerGrid}>
          {data.map((index) => (
            <ProfileCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Directory;