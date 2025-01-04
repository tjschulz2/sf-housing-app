"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import HeaderBar from "./headerbar";
import {
  getHousingSearchProfiles,
  getCommunities,
  getOrganizerProfiles,
} from "../lib/utils/data";
import Link from "next/link";
import React from "react";
import { differenceInDays } from "date-fns";
import { MovingBorderButton } from "./ui/moving-border-button";
import Head from "next/head";
import { signInWithTwitterAction } from "@/app/auth/actions";

type HomePageComponentProps = {
  referralDetails: ReferralDetails;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({
  referralDetails,
}) => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [totalWeeklyProfiles, setTotalWeeklyProfiles] = useState(0);

  useEffect(() => {
    const pullMemberCount = async () => {
      let { data, error } = await supabase.rpc("get_total_members");

      if (!error) {
        setNumberOfUsers(data ?? 0);
      }
    };

    const pullMonthlyListingCount = async () => {
      let { data, error } = await supabase.rpc("this_month_listing_count");
      if (error) {
        console.error(error);
      } else if (data) {
        setTotalWeeklyProfiles(data);
      }
    };

    pullMemberCount();
    pullMonthlyListingCount();
  }, []);

  const renderContent = () => {
    if (referralDetails?.status === "unclaimed") {
      return (
        <div className={styles.signInWithTwitterParent}>
          {/* <Link
            className={styles.signInWithTwitter}
            href={`/?referralCode=${referralDetails.referralID}`}
            onClick={signInWithTwitter}
          >
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign up with Twitter</div>
            </div>
          </Link> */}

          <form>
            <input
              type="hidden"
              name="referralCode"
              value={referralDetails.referralID?.toString()}
            />
            <button
              formAction={signInWithTwitterAction}
              type="submit"
              className={styles.signInWithTwitter}
            >
              <div className={styles.vectorParent}>
                <img className={styles.vectorIcon} alt="" src="/vector.svg" />
                <div className={styles.signInWith}>Sign up with Twitter</div>
              </div>
            </button>
          </form>

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
            href="https://forms.gle/LT3UkjJ99e7VgCXN7"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyWrapper}
          >
            <div className={styles.apply}>Apply</div>
            {/* <MovingBorderButton
              duration={3500}
              borderRadius="1.75rem"
              className="bg-black text-white"
            >
              Apply
            </MovingBorderButton> */}
          </Link>
          {/* <Link
            href=""
            className={styles.signInSmall}
            onClick={() => signInWithTwitterAction()}
          >
            Have an account? Sign in
          </Link> */}
          <form>
            <button
              formAction={signInWithTwitterAction}
              type="submit"
              className={styles.signInSmall}
            >
              Have an account? Sign in
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    // <section className={styles.frameParent}>

    // <section className="bg-grid-slate bg-fixed h-dvh flex flex-col justify-center items-center w-full">
    <div className="h-dvh w-full bg-[#FEFBEB]">
      <HeaderBar />
      <div className="w-full bg-[#FEFBEB] bg-grid-blue-300/[0.2] relative flex flex-col items-center justify-center mt-10">
        <div className="z-[1] max-w-screen-md flex flex-col text-center justify-center items-center gap-6 p-4 drop-shadow-xl">
          <div className={styles.frameWrapper}>
            <div className={styles.ellipseParent}>
              <img
                className={styles.frameChild}
                alt=""
                src="/ellipse-51@3x.jpg"
              />
              <img
                className={styles.frameItem}
                alt=""
                src="/ellipse-50@3x.jpg"
              />
              <img
                className={styles.frameInner}
                alt=""
                src="/ellipse-52@3x.jpg"
              />
              <img
                className={styles.ellipseIcon}
                alt=""
                src="/ellipse-53@3x.jpg"
              />
            </div>
          </div>
          <h1 className="font-bold text-4xl leading-[2.75rem] py-4">
            Find housemates, sublets, and coliving communities in the SF scene
          </h1>
          <p className={styles.thisIsAn}>
            The housing directory of people you probably know
          </p>
          {renderContent()}
          {/* <div className={styles.membersBox}> */}
          <div className="flex text-sm gap-6 border-2 border-[#0000001A] p-4 px-6 rounded-full mt-8">
            <div>
              <span className={styles.boldAndColored}>{numberOfUsers}</span>{" "}
              members of DirectorySF
            </div>
            <div>
              <span className={styles.boldAndColored}>
                {totalWeeklyProfiles}
              </span>{" "}
              listings this month 🔥
            </div>
          </div>
        </div>
        {/* <p className="text-neutral-500 mt-6">
        Questions? DM{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://twitter.com/neallseth"
        >
          Neall
        </a>{" "}
        or{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://twitter.com/thomasschulzz"
        >
          Tom
        </a>
      </p> */}

        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-[#FEFBEB] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
    </div>
  );
};

export default HomePageComponent;
