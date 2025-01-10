"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../components/home-page-component";
import { useState } from "react";
// import { getReferralDetails } from "../lib/utils/data";
import { getReferralDetails } from "./auth/actions";
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
    // TODO: replace with pure server-side logic within RSC
    async function handlePageLoad() {
      if (referralCode) {
        const referral = await getReferralDetails(referralCode);
        if (referral.status === "unclaimed") {
          setReferralDetails(referral);
        } else {
          alert(`This referral is ${referral.status}`);
        }
      }
    }
    handlePageLoad();
  }, [errorDescription, referralCode, router]);

  return (
    <div className={styles.home}>
      {/* {isLoading && <LoadingSpinner />} */}
      <HomePageComponent referralDetails={referralDetails} />
    </div>
  );
};

export default Home;
