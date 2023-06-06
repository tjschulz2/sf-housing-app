import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { getCurrentUser, signInWithTwitter } from "../lib/utils/auth";

type HomePageComponentProps = {
  referralCode?: string;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({
  referralCode,
}) => {
  // supabase.auth.onAuthStateChange(async (event, session) => {
  //   console.log(`Supabase auth event: ${event}`);

  //   if (session) {
  //     console.log('Session:', session);
  //   } else {
  //     console.log('No session');
  //   }

  //   if (event === 'SIGNED_IN' && session) {
  //     console.log('User signed in!');
  //     console.log(session.user);
  //   }
  // });

  async function signout() {
    const { error } = await supabase.auth.signOut();
  }

  const renderContent = () => {
    if (referralCode === "twitter") {
      return (
        <div className={styles.signInWithTwitterParent}>
          <Link
            className={styles.signInWithTwitter}
            href="/?referralCode=twitter"
            onClick={signInWithTwitter}
          >
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign in with Twitter</div>
            </div>
          </Link>
          <button onClick={getCurrentUser}>check session</button>
          <button onClick={signout}>sign out</button>

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
        This is an invite-only directory of people you probably know that are
        looking for housing in San Francisco.
      </p>
      {renderContent()}
    </section>
  );
};

export default HomePageComponent;
