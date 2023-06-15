"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import Link from 'next/link';


const HowToPage: NextPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.form}>
            <h1>How to use DirectorySF</h1>
            <Link href="/directory" className={styles.nextButton}>
                Go to Directory
            </Link>
            <div style={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />
            <div>
                <h2>Step 1: Add yourself to The Directory</h2>
                <p>To be discovered, add your profile to the respective directory</p>
                <div className={styles.containerGrid}>
                    <img src="/addToHousing.jpg" style={{maxWidth: '600px', width: '100%'}}></img>
                    <img src="/addOrganizingButton.jpg" style={{maxWidth: '600px', width:'100%'}}></img>
                    <img src="/addCommunityButton.jpg" style={{maxWidth: '600px', width:'100%'}}></img>
                </div>
            </div>
            <div>
                <h2>Step 2: Browse people</h2>
                <p>Click around and find people of similar interests and values</p>
                <div className={styles.containerGrid}>
                    <img src="/browse.jpg" style={{maxWidth: '1000px', width:'100%'}}></img>
                </div>
            </div>
            <div>
                <h2>Step 3: Contact people of interest to you</h2>
                <p>Message others looking for housing!</p>
                <div className={styles.containerGrid}>
                    <img src="/profileSocial.jpg" style={{maxWidth: '1000px', width:'100%'}}></img>
                </div>
            </div>
            <div>
                <h2>Step 4: Special tip ✨</h2>
                <p>If you are an organizer or community leader, reach out to people looking for housing. Coordination is difficult and it is your role to make housing happen. If you are searching, reach out to communities and organizers expressing your interest. Best of luck finding a spot!</p>
            </div>
            <Link href="/directory" className={styles.nextButton}>
                Finish
            </Link>
        </div>
    </div>
  );
};

export default HowToPage;
