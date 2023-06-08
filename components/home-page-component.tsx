'use client';
import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import React, { useState, useEffect } from 'react'

type HomePageComponentProps = {
  referralCode?: string;
  signInWithTwitter?: any;
  signUpWithTwitter?: any;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({
  referralCode, signInWithTwitter, signUpWithTwitter
}) => {
  const [isValidReferral, setIsValidReferral] = useState(false);
  const [originatorName, setOriginatorName] = useState<string | null>(null);

  interface Referral {
    referral_id: number | null;
    originator_id: string;
  }

  useEffect(() => {
    const fetchReferral = async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("referral_id, originator_id")
        .eq("referral_id", referralCode)
        .filter('recipient_id', 'is.null', true);

      if (error) throw error;

      if (data && data.length > 0) {
        setIsValidReferral(true);
        // Now fetch the originator's name
        const originatorId = (data[0] as Referral).originator_id;
        if (originatorId) {
          const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("user_id", originatorId);

          if (userError) throw userError;

          if (userData && userData.length > 0) {
            setOriginatorName(userData[0].name);
          }
        }
      } else {
        setIsValidReferral(false);
      }
    };

    if (referralCode) {
      fetchReferral();
    }
  }, [referralCode]);

  const renderContent = () => {
    if (isValidReferral) {
      return (
        <div className={styles.signInWithTwitterParent}>
          <Link
            className={styles.signInWithTwitter}
            href={`/?referralCode=${referralCode}`}
            onClick={signUpWithTwitter}
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
              <span className={styles.maxKrieger}>{originatorName}</span>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {referralCode && <p>Invalid referral code</p>}
          <Link
            href="/directory"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyWrapper}
          >
            <div className={styles.apply}>Apply</div>
          </Link>
          <Link href="" className={styles.signInSmall} onClick={signInWithTwitter}>Already have an account? Sign in</Link>
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
