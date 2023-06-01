'use client';
import styles from './page.module.css';
import { NextPage } from 'next';
import ProfileCard from '../../../../components/profile-card';
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
          <Link href="/directory" className={styles.unselectedText}>People looking</Link>
          <Link href="/directory/people-organizing" className={styles.selectedText}>People organizing</Link>
          <Link href="/directory/existing-communities" className={styles.unselectedText}>Existing communities</Link>
        </div>
      </div>
      <div className={ styles.directoryContainer }>
        {/* <div className={styles.lookingHousematesContainer}>
          <h2>Do you want to organize a community house?</h2>
          <p className={styles.addInfoText}>Add your information below and we'll add you to the "People organizing" directory so you can be discovered by people looking for housemates</p>
          <Link className={styles.addMeButton} href="/form">Become organizer</Link>
        </div> */}
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