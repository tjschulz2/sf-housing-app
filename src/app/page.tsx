"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { useState } from "react";
import { getReferralDetails } from "../../lib/utils/data";
import { useRouter } from "next/navigation";
import { handleSignIn } from "../../lib/utils/process";

const Home: NextPage = () => {
  const router = useRouter();
  const referralCode = useSearchParams().get("referralCode");
  const [referralDetails, setReferralDetails] = useState<ReferralDetails>(null);

  useEffect(() => {
    async function handlePageLoad() {
      if (referralCode) {
        const referral = await getReferralDetails(referralCode);
        if (referral.status === "unclaimed") {
          localStorage.setItem("referral-code", referralCode);
        } else {
          alert(`This referral is ${referral.status}`);
        }
        setReferralDetails(referral);
      } else {
        const signInResult = await handleSignIn();
        if (signInResult?.status === "success") {
          router.replace("/directory");
        }
      }
    }
    handlePageLoad();
  }, []);

  return (
    <div className={styles.home}>
      <HomePageComponent referralDetails={referralDetails} />
    </div>
  );
};

export default Home;
