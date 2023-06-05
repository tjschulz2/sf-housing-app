import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import React, { useState, useEffect } from 'react';

type HomePageComponentProps = {
  referralCode?: string;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({ referralCode }) => {
  async function signInWithTwitter() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
    })
}

// const [session, setSession] = useState(null);

// useEffect(() => {
//   setSession(supabase.auth.session());

//   supabase.auth.onAuthStateChange((_event, session) => {
//     setSession(session);
//   });
// }, []);



async function signout() {
    const { error } = await supabase.auth.signOut()
}

  const renderContent = () => {
    if (referralCode === 'twitter') {
      return (
        <div className={styles.signInWithTwitterParent}>
          <Link className={styles.signInWithTwitter} href="/?referralCode=twitter" onClick={signInWithTwitter}>
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign in with Twitter</div>
            </div>
          </Link>
          <div className={styles.vectorGroup}>
            <img className={styles.vectorIcon1} alt="" src="/vector1.svg" />
            <p className={styles.youHaveBeenContainer}>
              <span>{`You have been invited by `}</span>
              <span className={styles.maxKrieger}>Max Krieger</span>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <Link 
          href="/directory"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyWrapper}
        >
          <div className={styles.apply}>Apply</div>
        </Link>
        // <a
        //   href="https://solarissociety.org"
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className={styles.applyWrapper}
        // >
        //   <div className={styles.apply}>Apply</div>
        // </a>
      );
    }
  };

  return (
    <section className={styles.frameParent}>
      <div className={styles.frameWrapper}>
        <div className={styles.ellipseParent}>
          <img className={styles.frameChild} alt="" src="/ellipse-51@3x.jpg" />
          <img className={styles.frameItem} alt="" src="/ellipse-50@3x.jpg" />
          <img className={styles.frameInner} alt="" src="/ellipse-52@3x.jpg" />
          <img className={styles.ellipseIcon} alt="" src="/ellipse-53@3x.jpg" />
        </div>
      </div>
      <h1 className={styles.findHousemates}>
        Find housemates & coliving communities in the San Francisco tech scene
      </h1>
      <p className={styles.thisIsAn}>
        This is an invite-only directory of people you probably know that are looking for housing in San Francisco.
      </p>
      {renderContent()}
    </section>
  );
};

export default HomePageComponent;
