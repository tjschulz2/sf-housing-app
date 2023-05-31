import type { NextPage } from "next";
import styles from "./profile-card.module.css";
import Link from 'next/link'

  const ProfileCard: NextPage= () => {
    return (
        <li className={styles.frameParent} id="profile-card-element">
        <div className={styles.image3Parent}>
          <img className={styles.image3Icon} alt="" src="/image-3@2x.png" />
          <div className={styles.frameGroup}>
            <a
              className={styles.contactMeWrapper}
              href="https://twitter.com"
              target="_blank"
            >
              <p className={styles.contactMe}>Contact me</p>
            </a>
            <a
              className={styles.vectorParent}
              href="https://a9.io"
              target="_blank"
            >
              <img className={styles.vectorIcon} alt="" src="/link.svg" />
              <div className={styles.a9io}>a9.io</div>
            </a>
            <div className={styles.locationParent}>
              <img className={styles.locationIcon} alt="" src="/location.svg" />
              <p className={styles.sanFrancisco} id="location">
                San Francisco
              </p>
            </div>
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.frameA}>
            <div className={styles.maxKriegerParent}>
              <h4 className={styles.maxKrieger} id="twitter-name">
                Max Krieger
              </h4>
              <a
                className={styles.maxkriegers}
                href="twitter.com"
                target="_blank"
              >
                @maxkriegers
              </a>
              <img className={styles.vectorIcon1} alt="" src="/twitter-logo.svg" />
            </div>
            <sub className={styles.followedBy980} id="followed-by">
              Followed by 980+ people you follow
            </sub>
          </div>
          <p className={styles.lookingToLive} id="looking-for-text">
            Looking to live with people researching and building AI companies
          </p>
          <p className={styles.wants1YearLeaseContainer} id="wants-text">
            <span className={styles.wants}>Wants:</span>
            <span> 1-year lease, 2-4 roommates</span>
          </p>
          <p className={styles.wants1YearLeaseContainer} id="moving-text">
            <span className={styles.wants}>Moving:</span>
            <span>{` Now -> August 2023`}</span>
          </p>
        </div>
      </li>
    );
  };
  
  export default ProfileCard;