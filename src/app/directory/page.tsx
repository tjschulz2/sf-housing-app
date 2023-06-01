import styles from "./page.module.css";
import { NextPage } from "next";
import ProfileCard from "../../../components/profile-card";
import Link from "next/link";

const Directory: NextPage = () => {
  const data = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <>
      <div className={styles.lookingHousematesContainer}>
        <h2>👋 Are you looking for housemates?</h2>
        <text className={styles.addInfoText}>
          Add your information and we will add you to the People looking
          directory so you can be discovered by communities and organizers
        </text>
        <Link className={styles.addMeButton} href="/housemates-form">
          Add me
        </Link>
      </div>
      <h2>Today</h2>
      <div className={styles.containerGrid}>
        {data.map((index) => (
          <ProfileCard key={index} />
        ))}
      </div>
    </>
  );
};

export default Directory;
