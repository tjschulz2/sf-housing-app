import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../../components/profile-card";
import Link from "next/link";

const Directory: NextPage = () => {
  const data = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>Do you already have a community/coliving house?</h2>
        <span className={styles.addInfoText}>
          Add your information and we will add you to the Existing communities
          directory so you can be discovered by people looking for housing
        </span>
        <Link className={styles.addMeButton} href="/community-form">
          Add my community house
        </Link>
      </div>
      <h2>Today</h2>
      <div className={styles.containerGrid}>
        {/* {data.map((index) => (
          <ProfileCard key={index} />
        ))} */}
      </div>
    </>
  );
};

export default Directory;
