'use client';
import styles from './page.module.css';
import { NextPage } from 'next';
import ProfileCard from '../../../../components/profile-card';
import Link from 'next/link'
import InvitePopup from '../../../../components/invite-popup-component';

const Directory: NextPage = () => {
  const data = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <div className={styles.directoryInviteSettings}>
          <h1>Directory</h1>
          <div className={styles.inviteSettingsContainer}>
            <InvitePopup />
            <Link className={styles.settingsButton} href="/settings">
              <img className={styles.gearIcon} alt="" src="/gearIcon.svg" />
            </Link>
          </div>
        </div>
        <div className={styles.sectionButtons}>
          <Link href="/directory" className={styles.unselectedText}>People looking</Link>
          <Link href="/directory/people-organizing" className={styles.unselectedText}>People organizing</Link>
          <Link href="/directory/existing-communities" className={styles.selectedText}>Existing communities</Link>
        </div>
      </div>
      <div className={ styles.directoryContainer }>
        <div className={styles.lookingHousematesContainer}>
          <h2>Do you already have a community/coliving house?</h2>
          <text className={styles.addInfoText}>Add your information and we will add you to the Existing communities directory so you can be discovered by people looking for housing</text>
          <Link className={styles.addMeButton} href="/form">Add my community house</Link>
        </div>
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