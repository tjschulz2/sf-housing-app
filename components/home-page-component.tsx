import type { NextPage } from "next";
import styles from "./home-page-component.module.css";

type HomePageComponentProps = {
  referralCode?: string;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({ referralCode }) => {
  const renderContent = () => {
    if (referralCode === 'twitter') {
      return (
        <div className={styles.signInWithTwitterParent}>
          <a className={styles.signInWithTwitter} href="https://twitter.com">
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign in with Twitter</div>
            </div>
          </a>
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
        <a
          href="https://solarissociety.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyWrapper}
        >
          <div className={styles.apply}>Apply</div>
        </a>
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
