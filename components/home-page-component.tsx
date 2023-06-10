"use client";
import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import Link from "next/link";
import React from "react";
import { signInWithTwitter } from "../lib/utils/auth";

type HomePageComponentProps = {
  referralDetails: ReferralDetails;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({
  referralDetails,
}) => {
  const renderContent = () => {
    if (referralDetails?.status === "unclaimed") {
      return (
        <div className={styles.signInWithTwitterParent}>
          <Link
            className={styles.signInWithTwitter}
            href={`/?referralCode=${referralDetails.referralID}`}
            onClick={signInWithTwitter}
          >
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign in with Twitter</div>
            </div>
          </Link>
          <div className={styles.vectorGroup}>
            <img className={styles.vectorIcon1} alt="" src="/vector1.svg" />
            <p className={styles.youHaveBeenContainer}>
              <span>{`You have been invited by `}</span>
              <span className={styles.maxKrieger}>
                {referralDetails.originatorName}
              </span>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {referralDetails?.status === "invalid" && (
            <p>Invalid referral code</p>
          )}
          <Link
            href="/directory"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyWrapper}
          >
            <div className={styles.apply}>Apply</div>
          </Link>
          <Link
            href=""
            className={styles.signInSmall}
            onClick={signInWithTwitter}
          >
            Already have an account? Sign in
          </Link>
        </div>
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
