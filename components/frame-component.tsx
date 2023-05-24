import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./frame-component.module.css";
const FrameComponent: NextPage = () => {
  // const onFrameButtonClick = useCallback(() => {
  //   window.open("https://solarissociety.org");
  // }, []);

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
      <h1
        className={styles.findHousemates}
      >{`Find housemates & coliving communities in the San Francisco tech scene`}</h1>
      <p className={styles.thisIsAn}>
        This is an invite-only directory of people you probably know that are
        looking for housing in San Francisco.
      </p>
      {/* <button className={styles.applyWrapper} onClick={onFrameButtonClick}>
        <div className={styles.apply}>Apply</div>
      </button> */}
      <a
        href="https://solarissociety.org"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.applyWrapper}
      >
        <div className={styles.apply}>Apply</div>
      </a>
    </section>
  );
};

export default FrameComponent;
