"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { useState } from "react";
import { getReferralDetails } from "../../lib/utils/data";
import { getCurrentUser } from "../../lib/utils/auth";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();
  const referralCode = useSearchParams().get("referralCode");
  const [referralDetails, setReferralDetails] =
    useState<null | ReferralDetails>(null);

  useEffect(() => {
    async function handlePageLoad() {
      if ((await getCurrentUser())?.userID) {
        router.replace("/directory");
      }
      if (!referralCode) {
        return;
      }
      const referralDetails = await getReferralDetails(referralCode);
      console.log(referralDetails);
      if (referralDetails.status === "unclaimed") {
        localStorage.setItem("referral-code", referralCode);
        setReferralDetails(referralDetails);
      }
    }
    handlePageLoad();
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
