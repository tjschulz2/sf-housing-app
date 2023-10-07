"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../components/home-page-component";
import { useState } from "react";
import { getReferralDetails } from "../lib/utils/data";
import { useRouter } from "next/navigation";
import { handleSignIn } from "../lib/utils/process";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";

const Home: NextPage = () => {
  const router = useRouter();
  const referralCode = useSearchParams().get("referralCode");
  const errorDescription = useSearchParams().get("error_description");
  const [referralDetails, setReferralDetails] = useState<ReferralDetails>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function handlePageLoad() {
      // Check for error query parameter in URL
      if (
        errorDescription === "Error getting user email from external provider"
      ) {
        alert(
          "You need to add your email address to your Twitter account. \n\nGo to Twitter -> More -> Settings and Support -> Your account -> Email. \n\nAfter you do this, try again."
        );
      } else if (errorDescription) {
        alert(
          "You got an error:\n\n" +
            errorDescription +
            "\n\nContact @thomasschulzz on Twitter to investigate."
        );
      }
      if (referralCode) {
        const referral = await getReferralDetails(referralCode);
        if (referral.status === "unclaimed") {
          localStorage.setItem("referral-code", referralCode);
        } else {
          alert(`This referral is ${referral.status}`);
        }
        setReferralDetails(referral);
      } else {
        //localStorage.setItem("referral-code", "")
        setIsLoading(true);
        const signInResult = await handleSignIn();
        console.log(signInResult);
        setIsLoading(false);

        if (signInResult?.status !== "success") {
          if (signInResult?.status === "error") {
            alert(signInResult.message);
          }
          return;
        }
        if (signInResult.message === "initial sign in") {
          router.replace("/email-signup");
        } else {
          router.replace("/directory");
        }
      }
    }
    handlePageLoad();
  }, [errorDescription, referralCode, router]);

  return (
    <div className={styles.home}>
      {isLoading && <LoadingSpinner />}
      <HomePageComponent referralDetails={referralDetails} />
    </div>
  );
};

export default Home;
