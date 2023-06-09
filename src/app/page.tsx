"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { handleHomePageLoad } from "../../lib/utils/process";
import { useState } from "react";
import { getReferralDetails } from "../../lib/utils/data";

const Home: NextPage = () => {
  const referralCode = useSearchParams().get("referralCode");
  const [referralDetails, setReferralDetails] =
    useState<null | ReferralDetails>(null);

  useEffect(() => {
    async function handleReferral() {
      if (!referralCode) {
        return;
      }
      const referralDetails = await getReferralDetails(referralCode);
      console.log(referralDetails);
      if (!referralDetails?.recipientID) {
        localStorage.setItem("referral-code", referralCode);
        // @ts-ignore
        setReferralDetails(referralDetails);
      }
    }
    handleReferral();
  }, []);

  // const signInWithTwitter = async () => {
  //   await signInWithTwitterAuth();
  // };

  // const signUpWithTwitter = async () => {
  //   localStorage.setItem("isSignUp", "true");
  //   await signUpWithTwitterAuth();
  // };

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const isSignUp = localStorage.getItem("isSignUp") === "true";
  //     if (isSignUp) {
  //       await handleSignIn();
  //       // router.push("/directory");
  //     } else {
  //       const signInSuccessful = await getSessionData();
  //       if (signInSuccessful) {
  //         // router.push("/directory");
  //       }
  //     }
  //     // Clear localStorage after authentication is complete
  //     localStorage.removeItem("isSignUp");
  //   };
  //   checkUser();
  // }, []);

  return (
    <div className={styles.home}>
      <HomePageComponent
        referralDetails={referralDetails}
        // referralCode={normalizedReferralCode}
        // signInWithTwitter={signInWithTwitter}
        // signUpWithTwitter={signUpWithTwitter}
      />
    </div>
  );
};

export default Home;
